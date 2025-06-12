import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;