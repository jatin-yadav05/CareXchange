"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/login"
                className="text-center text-base font-medium text-gray-900 hover:text-secondary transition-colors duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 