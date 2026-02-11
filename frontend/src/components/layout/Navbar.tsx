import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getUser, isAuthenticated, getUserRole, logout } from "@/lib/auth";
import { UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import logo from '/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  const user = getUser();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HealthVillage Logo" className="h-14 w-14 rounded-lg" />
          <span className="text-xl font-semibold text-foreground">HealthVillage</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "nav-link text-sm",
                isActive(link.href) && "nav-link-active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center gap-3">
          {!authenticated ? (
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Profile"
              >
                <UserCircle className="h-6 w-6 text-primary" />
                <span className="sr-only">Profile</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50">
                  <Link
                    to={userRole === 'admin' ? '/admin/dashboard' : userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-muted/30 text-foreground"
                    onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-3 w-full hover:bg-muted/30 text-foreground"
                    onClick={() => { logout(); window.location.href = '/'; }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "nav-link py-2 text-base",
                  isActive(link.href) && "nav-link-active"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              {!authenticated ? (
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
              ) : (
                <div className="relative w-full">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/70 transition-colors w-full justify-center"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Profile"
                  >
                    <UserCircle className="h-6 w-6 text-primary" />
                    <span className="sr-only">Profile</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50">
                      <Link
                        to={userRole === 'admin' ? '/admin/dashboard' : userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-muted/30 text-foreground"
                        onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <button
                        className="flex items-center gap-2 px-4 py-3 w-full hover:bg-muted/30 text-foreground"
                        onClick={() => { logout(); window.location.href = '/'; }}
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
