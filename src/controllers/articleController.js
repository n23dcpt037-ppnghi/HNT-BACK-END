const articleModel = require('../models/articleModel');

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.findAll();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

const getArticleById = async (req, res) => {
    try {
        const article = await articleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Bài viết không tồn tại." });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

const createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung." });
        
        await articleModel.createArticle(req.body);
        res.status(201).json({ message: "Đăng bài thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

const updateArticle = async (req, res) => {
    try {
        const affectedRows = await articleModel.updateArticle(req.params.id, req.body);
        if (affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài viết." });
        res.status(200).json({ message: "Cập nhật bài viết thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const affectedRows = await articleModel.deleteArticle(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài viết." });
        res.status(200).json({ message: "Xóa bài viết thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

module.exports = { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle };