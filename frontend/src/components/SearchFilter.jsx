import { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchFilter = () => {
  const { searchQuery, setSearchQuery, category, setCategory, region, setRegion } = useNews();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search startup news..."
            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="funding">Funding</option>
            <option value="ipo">IPOs</option>
            <option value="acquisition">Acquisitions</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="global">Global</option>
            <option value="US">United States</option>
            <option value="India">India</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
