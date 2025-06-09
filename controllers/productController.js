const sql = require('../config/db');

const productService  = require('../services/productService');

async function getAllProductController(req, res) {
    try {
        const result = await productService.getAllProduct();
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào!" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log("Lỗi khi lấy tất cả sản phẩm: ", err);
        res.status(500).json({ error:  err.message});
    }   
}
async function getProductByIDController(req, res) {
    try {
        const result = await productService.getProductByID(req.params.ProductID);
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log("Lỗi khi lấy sản phẩm: ", err);
        res.status(500).json({ error:  err.message});
    }   
}
async function addProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền thêm sản phẩm này!");
        }
        const newProduct = req.body;
        const result = await productService.addProduct(newProduct);
        res.status(200).json({
            message: "Thêm thành công",
            product: result
        })
    } catch (err) {
        res.status(500).send(`Lỗi khi thêm sản phẩm: ` + err.message);
    }
}
async function deleteProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền xóa sản phẩm này!");
        }
        const ProductID = req.params.ProductID;
        console.log(ProductID);
        const result = await productService.deleteProduct(ProductID);
        if (!result) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm cần xóa!" });
        }
        res.status(200).json({
            message: "Xóa thành công",
            product: result
        })
    } catch (err) {
        res.status(500).send(`Lỗi khi xóa sản phẩm: ` + err.message);
    }    
}
async function updateProductController(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền sửa sản phẩm này!");
        }
        const ProductID = req.params.ProductID;
        const updated = await productService.updateProduct(ProductID, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để sửa!" });
        }

        res.status(200).json({ message: "Sửa thành công", product: updated });

    } catch (err) {
        res.status(500).send("Lỗi khi sửa sản phẩm: " + err.message);
    }
}

module.exports = {
    getAllProductController,
    addProductController,
    deleteProductController,
    updateProductController,
    getProductByIDController
}