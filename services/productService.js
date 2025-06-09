const sql = require('../config/db');

async function getAllProduct() {
    const result = await sql.query`SELECT * FROM Products`;
    if (result.recordset.length === 0) {
        return null;
    }
    return result.recordset;
}
async function getProductByID(ProductID) {
    const result = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
    if (result.recordset.length === 0) return null;
    return result.recordset[0];
}

async function addProduct(newProduct) {
    try {
        const { ProductName, Description, Price, Stock } = newProduct;
        if (!ProductName || Price == null || Stock == null) {
            throw new Error("Thiếu thông tin sản phẩm: ProductName, Price hoặc Stock.");
        }        
        const result = await sql.query`INSERT INTO Products 
            (ProductName, Description, Price, Stock)
            OUTPUT INSERTED.*
            VALUES (${ProductName}, ${Description || "không có"}, ${Price}, ${Stock})
            `
        
        return result.recordset[0];
    } catch (err) {
        console.log("Lỗi khi thêm sản phẩm: ", err);
        throw err;
    }
}
async function deleteProduct(ProductID) {
    try {
        const checkProduct = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`
        if (checkProduct.recordset.length === 0) {
            // res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
            return null;
        }
        await sql.query`DELETE FROM Products WHERE ProductID = ${ProductID}`;
        return checkProduct.recordset[0];

    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm!", err.message);
        throw err;
    }
}
async function updateProduct(ProductID, updateData) {
    try {
        const curProduct = await sql.query`
            SELECT * FROM Products WHERE ProductID = ${ProductID}
        `;

        if (curProduct.recordset.length === 0) {
            return null; 
        }

        const current = curProduct.recordset[0];
        const { ProductName, Description, Price, Stock } = updateData;
        
        const result = await sql.query`
            UPDATE Products
            SET
                ProductName = ${ProductName || current.ProductName},
                Description = ${Description || current.Description},
                Price = ${Price || current.Price},
                Stock = ${Stock || current.Stock}
            OUTPUT INSERTED.*
            WHERE ProductID = ${ProductID}
        `;

        return result.recordset[0];

    } catch (err) {
        console.error("Lỗi khi sửa sản phẩm!", err.message);
        throw err;
    }
}

module.exports = {
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductByID
}