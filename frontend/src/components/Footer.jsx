import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaRss, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const socialLinks = [
    { 
      icon: <FaGithub />, 
      url: 'https://github.com/yourusername',
      name: 'GitHub'
    },
    { 
      icon: <FaTwitter />, 
      url: 'https://twitter.com/yourhandle',
      name: 'Twitter'
    },
    { 
      icon: <FaLinkedin />, 
      url: 'https://linkedin.com/in/yourprofile',
      name: 'LinkedIn'
    },
    { 
      icon: <FaRss />, 
      url: '/rss',
      name: 'RSS Feed'
    },
  ];

  const footerLinks = [
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
    { name: 'Contact Us', url: '/contact' },
    { name: 'About', url: '/about' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your API here:
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Subscription failed');

      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (err) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Startup News Aggregator</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Curating the most relevant startup news for entrepreneurs and innovators.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors duration-300 text-xl"
                  whileHover={{ y: -2 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-white">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href={link.url}
                    className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-white">Categories</h4>
            <ul className="space-y-2">
              {['Funding', 'Product', 'Growth', 'Technology', 'AI', 'VC'].map((category, index) => (
                <li key={index}>
                  <motion.a 
                    href={`/category/${category.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {category}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-white">Subscribe</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get the latest startup news delivered to your inbox.
            </p>
            
            <AnimatePresence>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm"
                >
                  Thank you for subscribing! You'll receive our next update.
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-4 py-2 w-full rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </>
                      ) : 'Join'}
                    </button>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 dark:text-red-400 text-xs"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Startup News Aggregator. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {footerLinks.map((link, index) => (
              <motion.a 
                key={index}
                href={link.url}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white text-sm transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors duration-300 text-sm"
            whileHover={{ y: -2 }}
          >
            Back to top <FaArrowUp className="ml-1" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;