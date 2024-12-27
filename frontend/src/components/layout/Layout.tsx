import Header from './Header';
import { Toaster } from '@/components/ui/toaster';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building2 },
    ...(isAuthenticated ? [{ path: '/properties/create', label: 'Create Listing', icon: PlusCircle }] : []),
  ];

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar - Desktop only */}
          <aside className="hidden md:block md:col-span-3 space-y-4">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                          location.pathname === item.path
                            ? 'bg-steel-blue text-white'
                            : 'text-dark-gray hover:bg-light-blue/10'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
          
          {/* Main content */}
          <main className="md:col-span-9">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
