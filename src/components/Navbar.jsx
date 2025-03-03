"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if a link should be shown based on user role
  const shouldShowLink = (path) => {
    if (!user) return true; // Show all links when not logged in
    if (path === '/donate') return user.role === 'donor';
    if (path === '/request') return user.role === 'recipient';
    return true; // Show other links for all roles
  };

  return (
    <>
      <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-xl sm:text-2xl font-bold text-primary hover:text-primary-600 transition-colors duration-200"
                aria-label="CareXchange Home"
              >
                CareXchange
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-4 lg:space-x-8">
                {shouldShowLink('/donate') && (
                  <Link
                    href="/donate"
                    className={`${
                      pathname === '/donate'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-700 hover:text-secondary'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out`}
                    aria-current={pathname === '/donate' ? 'page' : undefined}
                  >
                    Donate
                  </Link>
                )}
                {shouldShowLink('/request') && (
                  <Link
                    href="/request"
                    className={`${
                      pathname === '/request'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-700 hover:text-secondary'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out`}
                    aria-current={pathname === '/request' ? 'page' : undefined}
                  >
                    Request
                  </Link>
                )}
                <Link
                  href="/medicines"
                  className={`${
                    pathname === '/medicines'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-700 hover:text-secondary'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out`}
                  aria-current={pathname === '/medicines' ? 'page' : undefined}
                >
                  Medicines
                </Link>
                <Link
                  href="/about"
                  className={`${
                    pathname === '/about'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-700 hover:text-secondary'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out`}
                  aria-current={pathname === '/about' ? 'page' : undefined}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`${
                    pathname === '/contact'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-700 hover:text-secondary'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out`}
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <span>{user.name}</span>
                    <span className="text-xs text-gray-500">({user.role})</span>
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                        {user.role === 'donor' && (
                          <Link
                            href="/donate"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Donate Medicine
                          </Link>
                        )}
                        {user.role === 'recipient' && (
                          <Link
                            href="/request"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Request Medicine
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium ml-3 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors duration-200"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">
                  {isMenuOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {/* Menu icon */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-opacity duration-200`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-opacity duration-200`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="mobile-menu"
        aria-label="Mobile menu"
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="text-xl font-bold text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                CareXchange
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6 space-y-2">
              {shouldShowLink('/donate') && (
                <Link
                  href="/donate"
                  className={`${
                    pathname === '/donate'
                      ? 'bg-primary-50 border-primary text-primary'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-secondary'
                  } group flex items-center px-3 py-2.5 text-base font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate
                </Link>
              )}
              {shouldShowLink('/request') && (
                <Link
                  href="/request"
                  className={`${
                    pathname === '/request'
                      ? 'bg-primary-50 border-primary text-primary'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-secondary'
                  } group flex items-center px-3 py-2.5 text-base font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Request
                </Link>
              )}
              <Link
                href="/medicines"
                className={`${
                  pathname === '/medicines'
                    ? 'bg-primary-50 border-primary text-primary'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-secondary'
                } group flex items-center px-3 py-2.5 text-base font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Medicines
              </Link>
              <Link
                href="/about"
                className={`${
                  pathname === '/about'
                    ? 'bg-primary-50 border-primary text-primary'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-secondary'
                } group flex items-center px-3 py-2.5 text-base font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`${
                  pathname === '/contact'
                    ? 'bg-primary-50 border-primary text-primary'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-secondary'
                } group flex items-center px-3 py-2.5 text-base font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <div className="px-4">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.role}</div>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                {user.role === 'donor' && (
                  <Link
                    href="/donate"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Donate Medicine
                  </Link>
                )}
                {user.role === 'recipient' && (
                  <Link
                    href="/request"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Request Medicine
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}