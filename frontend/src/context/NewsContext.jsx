// src/context/NewsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchStartupNews, fetchNewsByCategory, fetchNewsByRegion } from '../services/newsService';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('startup');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('global');

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (category !== 'all') {
        data = await fetchNewsByCategory(category);
      } else if (region !== 'global') {
        data = await fetchNewsByRegion(region);
      } else {
        data = await fetchStartupNews(searchQuery);
      }
      setArticles(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [searchQuery, category, region]);

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        category,
        setCategory,
        region,
        setRegion,
        fetchNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
