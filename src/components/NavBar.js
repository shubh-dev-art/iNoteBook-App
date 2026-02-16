import React from "react";
import {NavLink, useNavigate} from "react-router-dom";

const NavBar = () => {
    let navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">iNoteBook</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/about">About</NavLink>
                        </li>
                    </ul>
                    {!localStorage.getItem('token')?<form className="d-flex">
                        <NavLink className="btn btn-primary mx-1" to="/login" role="button">Login</NavLink>
                        <NavLink className="btn btn-primary mx-1" to="/signup" role="button">Signup</NavLink>
                    </form> : <button className="btn btn-primary" onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
