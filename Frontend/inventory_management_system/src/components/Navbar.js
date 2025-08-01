import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(props) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to products page with search query as URL param
    navigate(`/products?search=${encodeURIComponent(props.searchQuery)}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-danger">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active text-white fs-4" aria-current="page" to="/">{props.title}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white fs-4" aria-current="page" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white fs-4" aria-current="page" to="/about">About</Link>
              </li>
            </ul>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary fs-5" type="submit">Search</button>
            </form>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {props.user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-white fs-5">Welcome, {props.user.username}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light ms-2" onClick={props.onLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white fs-5" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white fs-5" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
