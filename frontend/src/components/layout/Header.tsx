import { theme } from '@/styles/theme';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: theme.colors.darkBlue, color: theme.colors.lightGray }}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">MyProperty</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/properties" className="hover:text-white transition-colors">
              Properties
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/properties/create" className="hover:text-white transition-colors">
                  Create Listing
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="text-light-gray hover:text-white hover:bg-steel-blue transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-dark-blue text-light-gray w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/properties" 
                    className="hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Properties
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/properties/create" 
                        className="hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Create Listing
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-light-gray hover:text-white hover:bg-steel-blue transition-colors"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
