import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { getBookmarks } from '../services/bookmarkService';

const Bookmarks = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => {
    setBookmarkedArticles(getBookmarks());
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Bookmarked Articles</h1>
      
      {bookmarkedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map((article, index) => (
            <NewsCard key={`bookmark-${index}`} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white">No bookmarks yet</h2>
          <p className="text-gray-600 dark:text-gray-300">Save articles to view them here</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;