import { useLocation, useNavigate } from 'react-router-dom';
import BookmarkButton from '../components/BookmarkButton';
import { format } from 'date-fns';

const ArticleDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  if (!state?.article) {
    navigate('/');
    return null;
  }

  const { article } = state;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
          }}
        />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            {article.title}
          </h1>
          <BookmarkButton article={article} />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>{article.source?.name}</span>
          <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy - h:mm a')}</span>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">{article.description}</p>
          {article.content && (
            <p className="text-gray-700 dark:text-gray-300">
              {article.content.replace(/\[\+\d+ chars\]/g, '')}
            </p>
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Read Full Article
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;