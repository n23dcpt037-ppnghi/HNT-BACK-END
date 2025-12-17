const articleModel = require('../models/articleModel');

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.findAll();
        res.status(200).json(articles);
    } catch (error) {
        console.error('❌ Lỗi getAllArticles:', error);
        res.status(500).json({ 
            message: "Lỗi Server khi lấy danh sách bài viết.",
            error: error.message 
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const article = await articleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Bài viết không tồn tại." });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('❌ Lỗi getArticleById:', error);
        res.status(500).json({ 
            message: "Lỗi Server khi lấy bài viết.",
            error: error.message 
        });
    }
};

const createArticle = async (req, res) => {
    try {
        console.log('📥 Dữ liệu nhận được (body):', req.body);
        console.log('📎 File nhận được (files):', req.files);

        const { 
            article_code, 
            title, 
            author, 
            category, 
            summary, 
            content, 
            published_at 
        } = req.body;

        const requiredFields = ['title', 'author', 'category', 'content'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "Thiếu thông tin bắt buộc!",
                missing: missingFields
            });
        }

        let image_url = null;
        let file_url = null;
        
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                image_url = `http://localhost:3000/uploads/articles/${req.files.image[0].filename}`;
            }
            if (req.files.content_file && req.files.content_file[0]) {
                file_url = `http://localhost:3000/uploads/articles/${req.files.content_file[0].filename}`;
            }
        }

        const articleCode = article_code || `TT${Date.now()}`;

        const existingArticle = await articleModel.findByCode(articleCode);
        if (existingArticle) {
            return res.status(400).json({ 
                message: "Mã bài viết đã tồn tại!",
                existing_code: articleCode 
            });
        }

        const articleData = {
            article_code: articleCode,
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            summary: summary ? summary.trim() : '',
            content: content.trim(),
            image_url,
            file_url,
            published_at: published_at || new Date().toISOString().split('T')[0]
        };

        console.log('💾 Dữ liệu chuẩn bị lưu:', articleData);

        const articleId = await articleModel.createArticle(articleData);
        
        res.status(201).json({ 
            success: true,
            message: "Đăng bài thành công!",
            article_id: articleId,
            article_code: articleCode,
            data: articleData
        });

    } catch (error) {
        console.error('❌ Lỗi createArticle:', error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi Server khi tạo bài viết.",
            error: error.message 
        });
    }
};

const updateArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        console.log(`✏️ Cập nhật bài viết ID: ${articleId}`);
        console.log('📥 Dữ liệu body:', req.body);
        console.log('📎 Files:', req.files);

        const { 
            title, 
            author, 
            category, 
            summary, 
            content, 
            published_at 
        } = req.body;

        const currentArticle = await articleModel.findById(articleId);
        if (!currentArticle) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy bài viết." 
            });
        }

        let image_url = currentArticle.image_url;
        let file_url = currentArticle.file_url;
        
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                image_url = `http://localhost:3000/uploads/articles/${req.files.image[0].filename}`;
            }
            if (req.files.content_file && req.files.content_file[0]) {
                file_url = `http://localhost:3000/uploads/articles/${req.files.content_file[0].filename}`;
            }
        }

        const updateData = {
            title: title !== undefined ? title.trim() : currentArticle.title,
            author: author !== undefined ? author.trim() : currentArticle.author,
            category: category !== undefined ? category.trim() : currentArticle.category,
            summary: summary !== undefined ? summary.trim() : currentArticle.summary,
            content: content !== undefined ? content.trim() : currentArticle.content,
            image_url,
            file_url,
            published_at: published_at || currentArticle.published_date
        };

        console.log('💾 Dữ liệu cập nhật:', updateData);

        const affectedRows = await articleModel.updateArticle(articleId, updateData);
        
        if (affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy bài viết để cập nhật." 
            });
        }

        res.status(200).json({ 
            success: true,
            message: "Cập nhật bài viết thành công!",
            article_id: articleId,
            data: updateData
        });

    } catch (error) {
        console.error('❌ Lỗi updateArticle:', error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi Server khi cập nhật bài viết.",
            error: error.message 
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const affectedRows = await articleModel.deleteArticle(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy bài viết." 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "Xóa bài viết thành công!" 
        });
    } catch (error) {
        console.error('❌ Lỗi deleteArticle:', error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi Server khi xóa bài viết.",
            error: error.message 
        });
    }
};

const getPopularArticles = async (req, res) => {
    try {
        const articles = await articleModel.findAll();
        const popularArticles = articles
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        res.status(200).json(popularArticles);
    } catch (error) {
        console.error('❌ Lỗi getPopularArticles:', error);
        res.status(500).json({ 
            message: "Lỗi Server khi lấy bài viết phổ biến.",
            error: error.message 
        });
    }
};

const incrementArticleViews = async (req, res) => {
    try {
        const affectedRows = await articleModel.incrementViews(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Bài viết không tồn tại." });
        }
        res.status(200).json({ message: "Đã tăng lượt xem." });
    } catch (error) {
        console.error('❌ Lỗi incrementArticleViews:', error);
        res.status(500).json({ 
            message: "Lỗi Server khi tăng lượt xem.",
            error: error.message 
        });
    }
};

module.exports = { 
    getAllArticles, 
    getArticleById, 
    createArticle, 
    updateArticle, 
    deleteArticle, 
    getPopularArticles,
    incrementArticleViews 
};