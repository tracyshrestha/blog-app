import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, LogOut, Home, Moon, Sun } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-2">
              <PenSquare className="h-5 w-5 text-primary-foreground " />
            </div>
            <span className="text-xl font-bold bg-primary bg-clip-text text-transparent">
              Blog App
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-500" />
              )}
            </Button>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="default" size="sm">
                    <Home className=" h-4 w-4" />
                  </Button>
                </Link>
                {/* <Link to="/create">
                  <Button variant="default" size="sm">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Write
                  </Button>
                </Link> */}
                <div className="flex items-center gap-3">
                  {/* <span className="text-sm text-muted-foreground">
                    {user?.name}
                  </span> */}
                  <Button variant="default" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
