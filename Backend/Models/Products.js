const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        ProductName: {
            type: String,
            required: true,
        },
        ProductPrice: {
            type: Number,
            required: true,
        },
        ProductBarcode: {
            type: Number,
            required: true,
        },
        ProductStock: {
            type: Number,
            required: true,
        },
        ProductMainCategory: {
            type: String,
            required: false,
        },
        ProductSubCategory: {
            type: String,
            required: false,
        },
    });

const Products = mongoose.model("Products", ProductSchema)
module.exports = Products;
