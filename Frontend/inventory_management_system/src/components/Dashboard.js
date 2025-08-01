import React, { useEffect, useState } from 'react';
import RealTimeDemand from './RealTimeDemand';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from 'recharts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading product data...</div>;
  }

  if (error) {
    return <div>Error loading product data: {error}</div>;
  }

  // Select 20 random products
  const randomProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 20);

  // Prepare data for charts
  const stockData = randomProducts.map(p => ({
    name: p.ProductName,
    stock: p.ProductStock,
  }));

  const priceData = randomProducts.map(p => ({
    name: p.ProductName,
    price: p.ProductPrice,
  }));

  return (
    <div className="dashboard" style={{ padding: '20px', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
      <h2>Product Stock</h2>
      <BarChart
        width={900}
        height={300}
        data={stockData}
        margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2c2c54" />
        <XAxis dataKey="name" stroke="#ccc" angle={-45} textAnchor="end" interval={0} height={80} />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Bar dataKey="stock" fill="#4caf50" />
      </BarChart>

      <h2 style={{ marginTop: '40px' }}>Product Price</h2>
      <LineChart
        width={900}
        height={300}
        data={priceData}
        margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2c2c54" />
        <XAxis dataKey="name" stroke="#ccc" angle={-45} textAnchor="end" interval={0} height={80} />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#2196f3" activeDot={{ r: 8 }} />
      </LineChart>

      <RealTimeDemand />
    </div>
  );
};

export default Dashboard;
