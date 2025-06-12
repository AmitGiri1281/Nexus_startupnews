// // newsService.js
// import axios from 'axios';

// const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
// const BASE_URL = process.env.REACT_APP_NEWS_API_URL;

// if (!API_KEY || !BASE_URL) {
//   console.error('❌ Missing REACT_APP_NEWS_API_KEY or REACT_APP_NEWS_API_URL in .env');
// }

// export const fetchStartupNews = async (params = {}) => {
//   const defaultParams = {
//     q: 'startup',
//     apiKey: API_KEY,
//     language: 'en',
//     sortBy: 'publishedAt',
//     pageSize: 20,
//   };

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: { ...defaultParams, ...params },
//     });
//     return response.data.articles;
//   } catch (error) {
//     console.error("❌ Error fetching startup news:", error.message);
//     return [];
//   }
// };

// export const fetchNewsByCategory = async (category) => {
//   const query = `startup AND (${category})`;
//   return fetchStartupNews({ q: query });
// };

// export const fetchNewsByRegion = async (region) => {
//   let query = 'startup';
//   if (region === 'India') query += ' AND (India OR Indian)';
//   if (region === 'US') query += ' AND (US OR United States OR America)';
  
//   return fetchStartupNews({ q: query });
// };

// src/services/newsService.js
// src/services/newsService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_NEWS_API_URL;
const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

if (!BASE_URL || !API_KEY) {
  console.error('❌ Missing API URL or API Key in .env');
}

export const fetchStartupNews = async (query = 'startup') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('❌ Error fetching news:', error.message);
    throw error;
  }
};

// Add these exports for category and region filtering

export const fetchNewsByCategory = async (category) => {
  const query = `startup AND ${category}`;
  return fetchStartupNews(query);
};

export const fetchNewsByRegion = async (region) => {
  let query = 'startup';
  if (region === 'India') query += ' AND (India OR Indian)';
  if (region === 'US') query += ' AND (US OR United States OR America)';
  return fetchStartupNews(query);
};
