// src/pages/Search.jsx
import React, { useState } from "react";

const mockData = [
  "React",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "GraphQL",
  "TypeScript",
  "Redux",
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // For demo, filter mockData by query (case-insensitive)
    const filtered = mockData.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Search</h1>

      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Enter search term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <div>
        {results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((item, index) => (
              <li
                key={index}
                className="p-3 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          query && (
            <p className="text-center text-gray-500">
              No results found for "<strong>{query}</strong>"
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
