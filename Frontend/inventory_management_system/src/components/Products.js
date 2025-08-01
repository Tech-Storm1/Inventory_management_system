import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export default function Products({ searchQuery }) {
    const location = useLocation();

    useEffect(() => {
        getProducts();
    }, [])

    const [productData, setProductData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getProducts = async () => {
        try {
            const res = await fetch("http://localhost:3001/products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.status === 201) {
                console.log("Data Retrieved.");
                setProductData(data);
                setFilteredData(data);
            }
            else {
                console.log("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const query = searchTerm || searchQuery;
        if (query) {
            const filtered = productData.filter(product =>
                (product.ProductName && product.ProductName.toLowerCase().includes(query.toLowerCase())) ||
                (product.ProductMainCategory && product.ProductMainCategory.toLowerCase().includes(query.toLowerCase())) ||
                (product.ProductSubCategory && product.ProductSubCategory.toLowerCase().includes(query.toLowerCase())) ||
                (product.ProductBarcode && product.ProductBarcode.toString().toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(productData);
        }
    }, [searchTerm, searchQuery, productData]);

    const deleteProduct = async (id) => {
        const response = await fetch(`http://localhost:3001/deleteproduct/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const deletedata = await response.json();
        console.log(deletedata);

        if (response.status === 422 || !deletedata) {
            console.log("Error");
        } else {
            console.log("Product deleted");
            getProducts();
        }
    }

    // Calculate totals for header
    const totalStockValue = productData.reduce((acc, product) => acc + (product.ProductPrice * product.ProductStock), 0);
    const totalProducts = productData.length;
    const lowStockCount = productData.filter(product => product.ProductStock < 10).length;

    return (
        <>
            <div className='container-fluid p-5' style={{ backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh' }}>
                <h1>Inventory</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex gap-5">
                        <div>
                            <h6>Total Stock Value</h6>
                            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>PKR{totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <h6>Total Products</h6>
                            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{totalProducts}</p>
                        </div>
                        <div>
                            <h6>Low Stock</h6>
                            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{lowStockCount}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            placeholder="Search order..."
                            className="form-control"
                            style={{ maxWidth: '250px', backgroundColor: '#1e1e1e', color: '#e0e0e0', border: '1px solid #333' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" style={{ borderColor: '#333', color: '#e0e0e0' }}>Filter</button>
                    </div>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "38rem" }}>
                    <table className="table table-hover" style={{ color: '#e0e0e0' }}>
                        <thead style={{ backgroundColor: '#1e1e1e' }}>
                            <tr>
                                <th scope="col"><input type="checkbox" /></th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Category</th>
                                <th scope="col">SKU</th>
                                <th scope="col">Price</th>
                                <th scope="col">Stock Status</th>
                                <th scope="col">Update</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredData.map((element, id) => (
                                    <tr key={element._id} style={{ backgroundColor: id % 2 === 0 ? '#121212' : '#1a1a1a' }}>
                                        <td><input type="checkbox" /></td>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {/* Placeholder for product image */}
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#333', borderRadius: '5px' }}></div>
                                            {element.ProductName}
                                        </td>
                                        <td>
                                            <div>Main: {element.ProductMainCategory || '-'}</div>
                                            <div>Sub: {element.ProductSubCategory || '-'}</div>
                                        </td>
                                        <td>{element.ProductBarcode}</td>
                                        <td>PKR{element.ProductPrice?.toFixed(2) || '0.00'}</td>
                                        <td>
                                            {element.ProductStock > 0 ? (
                                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{element.ProductStock} items</span>
                                            ) : (
                                                <span style={{ color: '#f44336', fontWeight: 'bold' }}>Out of Stock</span>
                                            )}
                                        </td>
                                        <td><NavLink to={`/updateproduct/${element._id}`} className="btn btn-primary btn-sm">Edit</NavLink></td>
                                        <td><button className="btn btn-danger btn-sm" onClick={() => deleteProduct(element._id)}>Delete</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
