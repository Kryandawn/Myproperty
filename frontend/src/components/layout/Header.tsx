import { theme } from '@/styles/theme';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ backgroundColor: theme.colors.darkBlue, color: theme.colors.lightGray }}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">MyProperty</div>
          <div className="space-x-4">
            <Link to="/properties" className="hover:text-white">Properties</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
