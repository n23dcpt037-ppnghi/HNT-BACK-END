const productModel = require('../models/productModel');

// [PUBLIC] READ: Lấy danh sách tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ. Vui lòng thử lại." });
    }
};

// [PUBLIC] READ: Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// ------------------------------------------------------------------
// [ADMIN ONLY] CREATE: Thêm sản phẩm mới
const createProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ body của request
        const data = req.body; 

        // Kiểm tra dữ liệu bắt buộc (ví dụ: tên và giá)
        if (!data.product_name || !data.price_vnd || !data.stock) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (Tên, Giá, Tồn kho)." });
        }

        const newProductId = await productModel.createProduct(data);
        res.status(201).json({ message: "Thêm sản phẩm thành công.", product_id: newProductId });

    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [ADMIN ONLY] UPDATE: Cập nhật thông tin sản phẩm
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        
        // Kiểm tra xem sản phẩm có tồn tại không trước khi update (tùy chọn)
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
             return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật." });
        }

        const affectedRows = await productModel.updateProduct(id, data);
        
        if (affectedRows === 0) {
            return res.status(400).json({ message: "Không có thay đổi nào được áp dụng." });
        }

        res.status(200).json({ message: "Cập nhật sản phẩm thành công." });

    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [ADMIN ONLY] DELETE: Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        
        const affectedRows = await productModel.deleteProduct(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa." });
        }

        res.status(200).json({ message: "Xóa sản phẩm thành công." });

    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};