import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

const categories = {
    "Electronics": ["Smartphone", "Laptop", "Headphones", "Smartwatch", "Bluetooth Speaker", "Camera", "Monitor", "Router"],
    "Clothing": ["T-Shirt", "Jeans", "Jacket", "Sneakers", "Hat", "Socks", "Sweater", "Dress"],
    "Toys": ["Action Figure", "Puzzle", "Board Game", "Doll", "RC Car", "Lego Set", "Stuffed Animal", "Yo-Yo"],
    "Books": ["Novel", "Biography", "Science Book", "Mystery Book", "Comic Book", "Cookbook", "Travel Guide", "Children's Book"],
    "Kitchen": ["Knife Set", "Cutting Board", "Blender", "Toaster", "Microwave", "Coffee Maker", "Cookware Set", "Mixing Bowls"],
    "Sports": ["Football", "Basketball", "Tennis Racket", "Yoga Mat", "Running Shoes", "Dumbbells", "Cycling Helmet", "Swim Goggles"],
    "Other": ["Notebook", "Desk Lamp", "Backpack", "Water Bottle", "Sunglasses", "Wallet", "Watch", "Phone Case"]
};

export default function InsertProduct() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState();
    const [productBarcode, setProductBarcode] = useState();
    const [productStock, setProductStock] = useState();
    const [mainCategory, setMainCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate("");

    const setName = (e) => {
        setProductName(e.target.value);
    }

    const setPrice = (e) => {
        setProductPrice(e.target.value);
    }

    const setBarcode = (e) => {
        const value = e.target.value.slice(0, 12);
        setProductBarcode(value);
    };

    const setStock = (e) => {
        setProductStock(e.target.value);
    };

    const setMainCat = (e) => {
        setMainCategory(e.target.value);
        setSubCategory("");
    };

    const setSubCat = (e) => {
        setSubCategory(e.target.value);
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (
            !productName ||
            productPrice === undefined || productPrice === null || productPrice === "" ||
            productBarcode === undefined || productBarcode === null || productBarcode === "" ||
            productStock === undefined || productStock === null || productStock === "" ||
            !mainCategory ||
            !subCategory
        ) {
            setError("*Please fill in all the required fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:3001/insertproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "ProductName": productName,
                    "ProductPrice": productPrice,
                    "ProductBarcode": productBarcode,
                    "ProductStock": productStock,
                    "ProductMainCategory": mainCategory,
                    "ProductSubCategory": subCategory
                })
            });

            await res.json();

            if (res.status === 201) {
                alert("Data Inserted");
                setProductName("");
                setProductPrice("");
                setProductBarcode("");
                setProductStock("");
                setMainCategory("");
                setSubCategory("");
                navigate('/products');
            }
            else if (res.status === 422) {
                alert("Product is already added with that barcode.");
            }
            else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container-fluid p-5'>
             <h1 className=''>Enter Product Information</h1>
             
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_name" className="form-label fw-bold">Product Name</label>
                <input type="text" onChange={setName} value={productName} className="form-control fs-5" id="product_name" placeholder="Enter Product Name" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_price" className="form-label fw-bold">Product Price</label>
                <input type="number" onChange={setPrice} value={productPrice} className="form-control fs-5" id="product_price" placeholder="Enter Product Price" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode</label>
                <input type="text" onChange={setBarcode} value={productBarcode} className="form-control fs-5" id="product_barcode" placeholder="Enter Product Barcode" maxLength={12} required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_stock" className="form-label fw-bold">Product Stock</label>
                <input type="number" onChange={setStock} value={productStock} className="form-control fs-5" id="product_stock" placeholder="Enter Product Stock" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="main_category" className="form-label fw-bold">Main Category</label>
                <select onChange={setMainCat} value={mainCategory} className="form-select fs-5" id="main_category" required>
                    <option value="">Select Main Category</option>
                    {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="sub_category" className="form-label fw-bold">Sub Category</label>
                <select onChange={setSubCat} value={subCategory} className="form-select fs-5" id="sub_category" required disabled={!mainCategory}>
                    <option value="">Select Sub Category</option>
                    {mainCategory && categories[mainCategory].map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                </select>
            </div>
            <div className='d-flex justify-content-center col-lg-6 col-md-6'>
                <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                <button type="submit" onClick={addProduct} className="btn btn-primary fs-4" disabled={loading}>{loading ? 'Inserting...' : 'Insert'}</button>
            </div>
            <div className="col text-center col-lg-6">
                {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
            </div>
        </div>
    )
}
