const db = require('../config/db');

const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT product_id, product_name, price_vnd, stock, image_url, category, description FROM products WHERE stock > 0');

        rows.forEach(product => {
            if (product.image_url) {
                if (product.image_url.startsWith('images/')) {
                    product.image_url = `http://localhost:3000/sp_home/${product.image_url}`;
                }
                else if (!product.image_url.includes('://') && !product.image_url.includes('/')) {
                    product.image_url = `http://localhost:3000/uploads/products/${product.image_url}`;
                }
            }
        });
        
        return rows;
    } catch (error) {
        throw error;
    }
};

const findById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE product_id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// CREATE: Thêm Sản phẩm mới (Admin)
const createProduct = async (data) => {
    const sql = `
        INSERT INTO products 
        (product_name, category, description, price_vnd, stock, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.product_name,
        data.category,
        data.description || null,
        data.price_vnd,
        data.stock,
        data.image_url || null
    ];
    
    const [result] = await db.execute(sql, values);
    return result.insertId;
};

// UPDATE: Cập nhật thông tin Sản phẩm (Admin) 
const updateProduct = async (id, data) => {
    try {
        const currentProduct = await findById(id); 
        if (!currentProduct) {
            return 0; 
        }

        const name = data.product_name !== undefined ? data.product_name : currentProduct.product_name;
        const category = data.category !== undefined ? data.category : currentProduct.category;
        const desc = data.description !== undefined ? data.description : currentProduct.description;
        const price = data.price_vnd !== undefined ? data.price_vnd : currentProduct.price_vnd;
        const stock = data.stock !== undefined ? data.stock : currentProduct.stock;
        const img = data.image_url !== undefined ? data.image_url : currentProduct.image_url;
        const [result] = await db.query(
            'UPDATE products SET product_name = ?, category = ?, description = ?, price_vnd = ?, stock = ?, image_url = ? WHERE product_id = ?',
            [name, category, desc, price, stock, img, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// DELETE: Xóa Sản phẩm (Admin)
const deleteProduct = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAll,
    findById,
    createProduct,
    updateProduct,
    deleteProduct,

};