import React, { useEffect, useState } from 'react';

const RealTimeDemand = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/forecast');
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        const data = await response.json();
        setForecastData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) {
    return <div>Loading forecast data...</div>;
  }

  if (error) {
    return <div>Error loading forecast data: {error}</div>;
  }

  return (
    <div>
      <h2>Real-Time Product Demand Forecast</h2>
      {forecastData.length === 0 ? (
        <p>No forecast data available.</p>
      ) : (
        forecastData.map(product => (
          <div key={product.productId} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h3>{product.productName}</h3>
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
                {product.forecast.map((day, index) => (
                  <tr key={index}>
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

export default RealTimeDemand;
