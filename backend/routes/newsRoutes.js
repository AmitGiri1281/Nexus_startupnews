const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const router = express.Router();


const parser = new Parser();

router.get('/news', async (req, res) => {
  try {
    const query = req.query.q || "startup";

    const newsapiURL = `${process.env.NEWS_API_URL}?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;
    const gnewsURL = `${process.env.GNEWS_API_URL}?q=${query}&token=${process.env.GNEWS_API_KEY}`;

    const [newsapiRes, gnewsRes] = await Promise.all([
      axios.get(newsapiURL),
      axios.get(gnewsURL),
    ]);

    const rssFeeds = [process.env.TECHCRUNCH_RSS, process.env.YOURSTORY_RSS];
    const rssArticles = [];

    for (const feed of rssFeeds) {
      const parsed = await parser.parseURL(feed);
      parsed.items.forEach(item => rssArticles.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: "RSS"
      }));
    }

    const allArticles = [
      ...newsapiRes.data.articles.map(a => ({ title: a.title, link: a.url, pubDate: a.publishedAt, source: "NewsAPI" })),
      ...gnewsRes.data.articles.map(a => ({ title: a.title, link: a.url, pubDate: a.publishedAt, source: "GNews" })),
      ...rssArticles
    ];

    const uniqueArticles = [...new Map(allArticles.map(a => [a.title, a])).values()]
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.json({ articles: uniqueArticles });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
