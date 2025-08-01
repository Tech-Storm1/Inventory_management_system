import React, { useEffect, useState } from 'react';

const TopSell = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/top50forecast');
        if (!response.ok) {
          throw new Error('Failed to fetch top selling products');
        }
        const data = await response.json();
        setTopProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return <div>Loading top selling products...</div>;
  }

  if (error) {
    return <div>Error loading top selling products: {error}</div>;
  }

  return (
    <div>
      <h2>Top 50 Selling Products Demand Forecast</h2>
      {!Array.isArray(topProducts) ? (
        <p>{topProducts.message || 'Unexpected data format received.'}</p>
      ) : topProducts.length === 0 ? (
        <p>No top selling products data available.</p>
      ) : (
        topProducts.map((product, index) => (
          <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h3>{product.productName}</h3>
            <p>Main Category: {product.mainCategory}</p>
            <p>Sub Category: {product.subCategory}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Forecasted Demand</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lower Bound</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Upper Bound</th>
                </tr>
              </thead>
              <tbody>
                {product.forecast.map((day, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{day.ds}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{day.yhat.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{day.yhat_lower.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{day.yhat_upper.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default TopSell;
