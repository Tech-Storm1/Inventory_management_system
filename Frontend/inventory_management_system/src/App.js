import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';
import InsertProduct from './components/InsertProduct'
import UpdateProduct from './components/UpdateProduct';
import About from './components/About';
import Register from './components/Register';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import RealTimeDemand from './components/RealTimeDemand';
import TopSell from './components/TopSell';

const PrivateRoute = ({ user, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login.html" />;
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/current_user', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Router>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '220px' }}>
          <Routes>
            <Route path="/login.html" element={<></>} />
            <Route path="/signup.html" element={<></>} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute user={user} loading={loading} />}>
              <Route exact path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products searchQuery={searchQuery} />} />
              <Route path="/insertproduct" element={<InsertProduct />} />
              <Route path="/updateproduct/:id" element={<UpdateProduct />} />
              <Route path="/realtimedemand" element={<RealTimeDemand />} />
              <Route path="/toSell" element={<TopSell />} />
              <Route path="/about" element={<About />} />
            </Route>
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login.html"} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
