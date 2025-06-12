import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const NewsCard = ({ article, variant = 'default', showBookmark = true }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { darkMode } = useTheme?.() || { darkMode: false };

  // Memoized values to prevent unnecessary recalculations
  const fallbackImage = useMemo(() => (
    darkMode 
      ? 'https://via.placeholder.com/400x200/2d3748/ffffff?text=No+Image'
      : 'https://via.placeholder.com/400x200/f3f4f6/4b5563?text=No+Image'
  ), [darkMode]);

  const imageUrl = useMemo(() => (
    imageError ? fallbackImage : article.urlToImage || fallbackImage
  ), [imageError, article.urlToImage, fallbackImage]);

  // Card variants configuration
  const variantsConfig = useMemo(() => ({
    card: {
      default: 'flex flex-col h-full',
      horizontal: 'flex flex-col md:flex-row h-full group',
      compact: 'flex flex-col h-full'
    },
    imageContainer: {
      default: 'w-full aspect-video', // 16:9 ratio
      horizontal: 'w-full md:w-2/5 aspect-video md:aspect-auto md:h-full',
      compact: 'w-full aspect-video'
    },
    contentContainer: {
      default: 'p-4 flex flex-col flex-1',
      horizontal: 'p-4 md:w-3/5 flex flex-col flex-1',
      compact: 'p-3 flex flex-col flex-1'
    }
  }), []);

  // Format date once
  const formattedDate = useMemo(() => (
    format(new Date(article.publishedAt), 'MMM d, yyyy')
  ), [article.publishedAt]);

  return (
    <article 
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
        hover:shadow-lg transition-all duration-300
        ${variantsConfig.card[variant]}
      `}
      aria-labelledby={`article-title-${article.title.replace(/\s+/g, '-')}`}
    >
      {/* Image with lazy loading and proper aspect ratio */}
      <div className={`
        relative overflow-hidden ${variantsConfig.imageContainer[variant]}
        bg-gray-100 dark:bg-gray-700
        ${variant === 'horizontal' ? 'md:group-hover:scale-105 transition-transform duration-300' : ''}
      `}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600" />
        )}
        <img 
          src={imageUrl}
          alt={article.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
          decoding="async"
          width={400}
          height={200}
        />
        {variant === 'horizontal' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className={variantsConfig.contentContainer[variant]}>
        <div className="flex justify-between items-start gap-2">
          <h3 
            id={`article-title-${article.title.replace(/\s+/g, '-')}`}
            className={`
              font-semibold text-gray-800 dark:text-white mb-2
              ${variant === 'compact' ? 'text-sm line-clamp-2' : 'text-lg line-clamp-2'}
            `}
          >
            {article.title}
          </h3>
          {showBookmark && (
            <BookmarkButton 
              article={article} 
              size={variant === 'compact' ? 'sm' : 'md'}
              className="flex-shrink-0"
            />
          )}
        </div>
        
        {variant !== 'compact' && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
            {article.description || 'No description available'}
          </p>
        )}

        {/* Meta information */}
        <div className={`
          flex justify-between items-center text-xs mt-auto
          ${variant === 'compact' ? 'pt-2 border-t border-gray-100 dark:border-gray-700' : ''}
          text-gray-500 dark:text-gray-400
        `}>
          <span className="truncate max-w-[50%]" title={article.source?.name || 'Unknown source'}>
            {article.source?.name || 'Unknown source'}
          </span>
          <time dateTime={article.publishedAt}>
            {formattedDate}
          </time>
        </div>
        
        {/* Actions */}
        <div className="mt-3 flex justify-between items-center">
          <Link
            to={`/article/${encodeURIComponent(article.title)}`}
            state={{ article }}
            className={`
              text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300
              ${variant === 'compact' ? 'text-xs' : 'text-sm'} font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded
            `}
            aria-label={`Read more about ${article.title}`}
          >
            Read More
          </Link>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-1
              text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300
              ${variant === 'compact' ? 'text-xs' : 'text-sm'}
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded
            `}
            aria-label="Open original source"
          >
            Source <FiExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;