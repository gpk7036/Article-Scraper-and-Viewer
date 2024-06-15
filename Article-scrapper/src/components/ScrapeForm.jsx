import React, { useState, useEffect } from 'react';
import '../App.css';

const SkeletonArticle = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
  </div>
);

export const ScrapeForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://article-scraper-and-viewer.onrender.com/scrape`, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: searchQuery }),
      });
      console.log('Response from server:', response);
      // if (response.ok) {
        const data = await response.json();
        console.log("data...");
        setArticles(data.slice(0, 5));
      // } else {
      //   console.error('Failed to fetch articles');
      // }
    } catch (error) {
      console.log('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <header className="App-header text-white bg-gray-800 w-full py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold ml-4">Medium Search</h1>
        <div className="mr-4">
          {loading && <span className="text-xs text-gray-400">Loading Time: {timer} seconds</span>}
        </div>
      </header>
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <SkeletonArticle key={index} />
            ))}
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
