import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HomeIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChevronDownIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Transition } from '@headlessui/react';

// Configuration objects
const navItems = [
  { path: '/', icon: HomeIcon, label: 'Home' },
  { path: '/dashboard', icon: Squares2X2Icon, label: 'Dashboard' },
  { path: '/analytics', icon: ChartBarIcon, label: 'Analytics' },
  { path: '/bookmarks', icon: BookmarkIcon, label: 'Bookmarks' },
  
];

const secondaryNavItems = [
  { path: '/about', icon: ShieldCheckIcon, label: 'About Us' },
  { path: '/contact', icon: EnvelopeIcon, label: 'Contact' },
];

// const authNavItems = [
//   { path: '/signin', icon: LoginIcon, label: 'Sign In' },
//   { path: '/signup', icon: UserPlusIcon, label: 'Sign Up' },
// ];


const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.querySelector('input').focus();
    }
  }, [searchOpen]);

  // Toggle functions
  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode]);
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => {
      if (prev) setSearchOpen(false);
      return !prev;
    });
  }, []);
  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen(prev => {
      if (prev) setSearchOpen(false);
      return !prev;
    });
  }, []);
  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => {
      if (!prev) setUserDropdownOpen(false);
      return !prev;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
      setUserDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [logout, navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  // User dropdown items
  const userMenuItems = [
    { path: '/dashboard', icon: UserIcon, label: 'Profile' },
    { path: '/messages', icon: EnvelopeIcon, label: 'Messages', badge: 3 },
    { path: '/notifications', icon: BellIcon, label: 'Notifications', badge: 5 },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
    { path: '/help', icon: QuestionMarkCircleIcon, label: 'Help Center' },
    { action: handleLogout, icon: ArrowLeftOnRectangleIcon, label: 'Sign Out' },
  ];

  // Nav item component to reduce duplication
  const NavItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const classNames = isMobile
      ? `flex items-center px-3 py-3 rounded-md text-base font-medium ${
          isActive ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`
      : `relative flex items-center px-3 py-2 text-sm font-medium group ${
          isActive ? 'text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`;

    return (
      <Link
        to={item.path}
        onClick={isMobile ? toggleMobileMenu : undefined}
        className={classNames}
      >
        <Icon className={`h-${isMobile ? '6' : '5'} w-${isMobile ? '6' : '5'} mr-${isMobile ? '3' : '2'} ${isActive ? 'stroke-2' : ''}`} />
        {item.label}
        {!isMobile && (
          <>
            {isActive && (
              <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
            )}
            {!isActive && (
              <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            )}
          </>
        )}
        {isMobile && isActive && (
          <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
        )}
      </Link>
    );
  };

  // Search component
  const SearchBar = ({ isMobile = false }) => (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`${isMobile ? 'w-full px-4 py-2' : 'w-48 lg:w-64 px-4 py-1.5'} text-sm rounded-${isMobile ? 'lg' : 'full'} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-gray-900'} border-b border-gray-200 dark:border-gray-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
                    <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  Nexus
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search button */}
              <button
                onClick={toggleSearch}
                className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Desktop Search */}
              <div className="hidden md:block relative" ref={searchRef}>
                <SearchBar />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="User menu"
                  >
                    <div className="relative h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                      )}
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                        3
                      </span>
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <Transition
                    show={userDropdownOpen}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {userMenuItems.map((item, index) => (
                          item.path ? (
                            <Link
                              key={index}
                              to={item.path}
                              onClick={() => setUserDropdownOpen(false)}
                              className="group flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                              <div className="flex items-center">
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                              </div>
                              {item.badge && (
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <button
                              key={index}
                              onClick={() => {
                                item.action();
                                setUserDropdownOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  </Transition>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <Transition
          show={searchOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 -translate-y-2"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-2"
        >
          <div className="md:hidden px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" ref={searchRef}>
            <SearchBar isMobile />
          </div>
        </Transition>

        {/* Mobile Menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 -translate-y-2"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-2"
        >
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} isMobile />
              ))}

              {/* Secondary navigation */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {secondaryNavItems.map((item) => (
                  <NavItem key={item.path} item={item} isMobile />
                ))}
              </div>

              {!user && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/signin"
                    onClick={toggleMobileMenu}
                    className="w-full flex items-center justify-center px-4 py-2 mb-2 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </nav>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;