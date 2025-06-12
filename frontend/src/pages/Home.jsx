import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';
import { useEffect, useState, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { FiAlertTriangle, FiFrown, FiRefreshCw, FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { articles, loading, error, fetchNews } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [sortBy, setSortBy] = useState('publishedAt');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Categories for the filter
  const categories = useMemo(() => [
    'general', 'business', 'entertainment', 
    'health', 'science', 'sports', 'technology'
  ], []);

  // Sort options
  const sortOptions = useMemo(() => [
    { value: 'publishedAt', label: 'Latest' },
    { value: 'relevancy', label: 'Relevant' },
    { value: 'popularity', label: 'Popular' }
  ], []);

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    return articles
      .filter(article => {
        const searchLower = debouncedSearchQuery.toLowerCase();
        return (
          article.title?.toLowerCase().includes(searchLower) ||
          article.description?.toLowerCase().includes(searchLower) ||
          article.content?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'publishedAt') {
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        } else if (sortBy === 'popularity') {
          return (b.popularity || 0) - (a.popularity || 0);
        } else {
          return (a.title || '').localeCompare(b.title || '');
        }
      });
  }, [articles, debouncedSearchQuery, sortBy]);

  const handleRefresh = async () => {
    if (!isMounted) return;
    setIsRefreshing(true);
    try {
      await fetchNews(category);
    } finally {
      if (isMounted) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchNews(category);
    }
  }, [category, isMounted]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center"
      >
        <FiAlertTriangle className="text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-2">
          Error Loading News
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
          {error.message || 'Failed to fetch news articles. Please try again later.'}
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          {isRefreshing ? (
            <FiRefreshCw className="animate-spin mr-2" />
          ) : (
            <FiRefreshCw className="mr-2" />
          )}
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Search and Filters */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search News
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search headlines, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          {/* Results Count */}
          {filteredArticles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                {isRefreshing ? (
                  <FiRefreshCw className="animate-spin mr-1.5" />
                ) : (
                  <FiRefreshCw className="mr-1.5" />
                )}
                Refresh
              </button>
            </motion.div>
          )}

          {/* Articles Grid */}
          <AnimatePresence>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={`${article.url}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <NewsCard 
                      article={article} 
                      className="transition-all hover:scale-[1.02] hover:shadow-lg"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[50vh] flex flex-col items-center justify-center text-center"
              >
                <FiFrown className="text-gray-400 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
                  No articles found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  {searchQuery ? 
                    "No matches for your search. Try different keywords." : 
                    "Try adjusting your filters to find what you're looking for."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Home;