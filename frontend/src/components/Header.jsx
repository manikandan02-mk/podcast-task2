// src/components/Header.jsx
import React from 'react';
import logoSrc from '../assets/animal_planet_logo.png';
import logoutIcon from '../assets/logout_icon.png';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <img src={logoSrc} alt="Animal Planet" />
        </div>
        <div className="header-right">
          <span className="header-admin">Administrator</span>
          <button className="btn-logout">
            <img src={logoutIcon} alt="" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
