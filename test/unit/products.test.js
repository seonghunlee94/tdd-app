const productController = require("../../controller/products");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json")
const allProduct = require("../data/all-products.json")

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "60d0fe4f5311236168a109ca";
const updateProduct = { name: "updated name", description: "updated description" };
let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe("Product Controller Create", () => {

    beforeEach(() => {
        req.body = newProduct;
    })

    it("should have a createProduct function", () => {
        expect(typeof productController.createProduct).toBe("function");
    })
    it("should call ProductModel.create", async () => {
        
        await productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(newProduct);
    })
    it("should return 201 response code", async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })
    it("shoule return json body in response", async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "description property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})


describe("Product Controller Get", () => {
    it("should have a getProducts function", () => {
        expect(typeof productController.getProducts).toBe("function");
    })

    it("should call ProductModel.find({})", async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toBeCalledWith({});
    }) 
    it("should return 200 response", async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return json body in response", async () => {
        productModel.find.mockReturnValue(allProduct);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProduct);
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "Error finding product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("Product controller Get by Id", () => {
    it("should habe a getProductById", () => {
        expect(typeof productController.getProductById).toBe("function");
    })

    it("should call ProductModel.findById", async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    })

    it("should return json body and response code 200", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newProduct);
    })

    it("should return 404 when item doesnt exist", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle errors", async () => {
        const errorMessage = { message: "Error finding product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })


})

describe("Product Controller Update", () => {

    it("shoule have an updateProduct function", () => {
        expect(typeof productController.updateProduct).toBe("function");
    })

    it ("should call productModel.findByIdAndUpdate", async () => {
        req.params.productId = productId;
        req.body = updateProduct;
        
        await productController.updateProduct(req, res, next);

        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId,
            updateProduct,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        req.params.productId = productId;
        req.body = updateProduct;
        
        productModel.findByIdAndUpdate.mockReturnValue(updateProduct);
        await productController.updateProduct(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updateProduct);
    })

    it("should handle 404 when item doesnt exist", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle errors", async () => {
        const errorMessage = { message: "Error finding product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })

})


describe("Product Controller Delete", () => {

    it("should have a deleteProduct function", () => {
        expect(typeof productController.deleteProduct).toBe("function");
    })
    
    it("should call productModel.findByIdAndDelete", async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);

    })

    it("should return 200 response code", async () => {
        
        let deleteProduct = {
            name: "deleted product",
            description: "deleted product description"
        }
        productModel.findByIdAndDelete.mockReturnValue(deleteProduct);

        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deleteProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })
    
    it("should handle 404 when item doesnt exist", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle errors", async () => {
        const errorMessage = { message: "Error deleting product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})