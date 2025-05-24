const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productModel.create(req.body);
        res.status(201).json(createdProduct);

    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await productModel.find({});
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json();
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {

    try {
        const updateProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    
        if (!updateProduct) {
            return res.status(404).send();
        }   
        res.status(200).json(updateProduct);
    } catch (error) {
        console.error(error);
        next(error);
    }
    
}

exports.deleteProduct = async (req, res, next) => {
    try {

        const deleteProduct = await productModel.findByIdAndDelete(req.params.productId);
    
        if (!deleteProduct) {
            return res.status(404).send();
        }  
        res.status(200).json(deleteProduct);
    } catch (error) {
        console.error(error);
        next(error);
    }
}