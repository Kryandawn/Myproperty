import React from 'react';
import { theme } from '../../styles/theme';

const Header = () => {
  return (
    <header style={{ backgroundColor: theme.colors.darkBlue, color: theme.colors.lightGray }}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">MyProperty</div>
          <div className="space-x-4">
            <a href="/properties" className="hover:text-white">Properties</a>
            <a href="/login" className="hover:text-white">Login</a>
            <a href="/register" className="hover:text-white">Register</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
