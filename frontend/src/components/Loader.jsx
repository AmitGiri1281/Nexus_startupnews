import { useState, useEffect } from 'react';

const Loader = ({
  size = 'md',
  color = 'blue',
  type = 'spinner',
  fullScreen = false,
  text = 'Loading...',
  textPosition = 'below'
}) => {
  const [progress, setProgress] = useState(0);

  // Progress loader animation
  useEffect(() => {
    if (type === 'progress') {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [type]);

  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 border-2',
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-t-2 border-b-2',
    lg: 'h-16 w-16 border-t-2 border-b-2',
    xl: 'h-20 w-20 border-t-3 border-b-3'
  };

  // Color classes
  const colorClasses = {
    blue: 'border-blue-500 text-blue-500',
    indigo: 'border-indigo-500 text-indigo-500',
    purple: 'border-purple-500 text-purple-500',
    pink: 'border-pink-500 text-pink-500',
    red: 'border-red-500 text-red-500',
    orange: 'border-orange-500 text-orange-500',
    yellow: 'border-yellow-500 text-yellow-500',
    green: 'border-green-500 text-green-500',
    teal: 'border-teal-500 text-teal-500',
    gray: 'border-gray-500 text-gray-500'
  };

  // Loader types
  const loaderTypes = {
    spinner: (
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    ),
    dots: (
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full ${colorClasses[color].replace('border', 'bg')}`}
            style={{ animation: `bounce 1.5s infinite ${i * 0.3}s` }}
          ></div>
        ))}
      </div>
    ),
    progress: (
      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-2 ${colorClasses[color].replace('border', 'bg')}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    ),
    bar: (
      <div className="w-48 space-y-2">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colorClasses[color].replace('border', 'bg')}`}
            style={{
              width: '100%',
              animation: 'progress 1.5s ease-in-out infinite'
            }}
          ></div>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colorClasses[color].replace('border', 'bg')}`}
            style={{
              width: '100%',
              animation: 'progress 1.5s ease-in-out infinite 0.3s'
            }}
          ></div>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colorClasses[color].replace('border', 'bg')}`}
            style={{
              width: '100%',
              animation: 'progress 1.5s ease-in-out infinite 0.6s'
            }}
          ></div>
        </div>
      </div>
    )
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white dark:bg-gray-900 z-50' : 'py-20'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative">
        {loaderTypes[type]}

        {/* Optional text */}
        {text && (
          <div className={`mt-3 text-sm font-medium ${colorClasses[color].split(' ')[1]} ${
            textPosition === 'over' ? 'absolute -top-8 left-1/2 transform -translate-x-1/2' : ''
          }`}>
            {text}
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%) scaleX(0.1); }
          50% { transform: translateX(0) scaleX(0.3); }
          100% { transform: translateX(100%) scaleX(0.1); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
