'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import EnhancedNotificationPanel from '@/components/reusable/EnhancedNotificationPanel';

interface NavbarProps {
  logo?: string;
  logoText?: string;
  navigationItems?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function Navbar({
  logo = '/logo.svg',
  logoText = '',
  navigationItems = [
    { label: 'Buy', href: '/browse' },
    { label: 'Sell', href: '/sell' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Agents', href: '/agents' },
  ],
  ctaText = 'Sign In',
  ctaHref = '/signin',
  className = ''
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-32 w-32 transition-transform duration-200 group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group ${
                  item.isActive ? 'text-blue-600' : ''
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Notifications for authenticated users */}
            {user && (
              <EnhancedNotificationPanel 
                userType={user.userType}
                showAsDropdown={true}
                className="mr-2"
              />
            )}

            {!user ? (
              <Link
                href={ctaHref}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {ctaText}
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden py-4 border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded ${
                  item.isActive ? 'text-blue-600 bg-blue-50' : ''
                }`}
                onClick={handleMenuClose}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Sign In */}
            {!user && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href={ctaHref}
                  className="block w-full text-left px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-medium"
                  onClick={handleMenuClose}
                >
                  {ctaText}
                </Link>
              </div>
            )}
            
            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-gray-700">
                  Welcome, {user.name || 'User'}
                </div>
                <button
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
