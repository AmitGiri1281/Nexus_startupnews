const API_KEY = process.env.NEWS_API_KEY;

export const fetchNews = async (params = {}) => {
  const queryString = new URLSearchParams({
    apiKey: API_KEY,
    language: 'en',
    pageSize: 30,
    ...params
  }).toString();

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error('News API Error:', error);
    throw error;
  }
};