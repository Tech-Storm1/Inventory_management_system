import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: 'linear-gradient(180deg, #43cea2, #185a9d)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>
      <div style={{ marginBottom: '40px', fontWeight: 'bold', fontSize: '1.5rem' }}>
        Genius Co.
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          })}
        >
          <FaTachometerAlt /> DASHBOARD
        </NavLink>
        <NavLink
          to="/products"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          })}
        >
          <FaBoxOpen /> PRODUCTS
        </NavLink>
        <NavLink
          to="/toSell"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          })}
        >
          <FaInfoCircle /> Top Sell Products
        </NavLink>
        <NavLink
          to="/realtimedemand"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          })}
        >
          {/* You can replace this with an appropriate icon */}
          📈 REAL TIME DEMAND
        </NavLink>
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
          })}
        >
          <FaInfoCircle /> ABOUT US
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={async () => {
            if (window.confirm('Are you sure you want to logout?')) {
              try {
                const response = await fetch('http://localhost:3001/logout', {
                  method: 'POST',
                  credentials: 'include',
                });
                if (response.ok) {
                  window.location.href = '/login.html';
                } else {
                  alert('Logout failed');
                }
              } catch (error) {
                alert('Logout failed');
              }
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
