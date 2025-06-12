import { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { 
  addBookmark, 
  removeBookmark, 
  isBookmarked 
} from '../services/bookmarkService';
import { useToast } from '../context/ToastContext'; // Optional toast notifications

const BookmarkButton = ({ article, size = 'md', variant = 'icon', showText = false }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast?.() || {}; // Optional toast integration

  // Size variants
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    xl: 'h-8 w-8'
  };

  // Check initial bookmark status
  useEffect(() => {
    setBookmarked(isBookmarked(article.url));
  }, [article.url]);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(article.url);
        setBookmarked(false);
        showToast?.('Bookmark removed', 'success');
      } else {
        await addBookmark(article);
        setBookmarked(true);
        showToast?.('Bookmark added', 'success');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      showToast?.('Failed to update bookmark', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        flex items-center gap-1.5
        ${variant === 'icon' ? 'p-1.5' : 'px-3 py-1.5 rounded-lg'}
        ${variant === 'button' && 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'}
        text-gray-500 dark:text-gray-400
        hover:text-yellow-500 dark:hover:text-yellow-400
        transition-all duration-200
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isLoading ? (
        <span className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-yellow-500 border-t-transparent`} />
      ) : bookmarked ? (
        <BookmarkSolid className={`${sizeClasses[size]} text-yellow-500`} />
      ) : (
        <BookmarkOutline className={sizeClasses[size]} />
      )}
      
      {(variant === 'button' || showText) && (
        <span className="text-sm font-medium">
          {bookmarked ? 'Saved' : 'Save'}
        </span>
      )}
      
      {/* Tooltip for icon-only variant */}
      {variant === 'icon' && (
        <span className="
          absolute -top-9 left-1/2 transform -translate-x-1/2
          px-2 py-1 text-xs font-medium text-white bg-gray-800 dark:bg-gray-700
          rounded whitespace-nowrap opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none
        ">
          {bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;