import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorBoundary from "../components/ErrorBoundary";
import DateRangePicker from "../components/DateRangePicker";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { authAxios } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  // Memoized data processing
  const processedData = useMemo(() => {
    if (!analyticsData) return null;
    
    return {
      ...analyticsData,
      topPages: analyticsData.topPages?.slice(0, 5) || [],
      userGrowth: analyticsData.userGrowth?.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString()
      })) || []
    };
  }, [analyticsData]);

  // Fetch data with error boundary and retry logic
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAxios.get("/api/analytics", {
        params: {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString()
        }
      });
      setAnalyticsData(response.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Chart configurations
  const lineChartData = {
    labels: processedData?.userGrowth?.map(item => item.date) || [],
    datasets: [
      {
        label: "User Growth",
        data: processedData?.userGrowth?.map(item => item.count) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: processedData?.topPages?.map(page => page.path) || [],
    datasets: [
      {
        label: "Page Views",
        data: processedData?.topPages?.map(page => page.views) || [],
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        data: [
          processedData?.deviceUsage?.mobile || 0,
          processedData?.deviceUsage?.desktop || 0,
          processedData?.deviceUsage?.tablet || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={fetchAnalytics} 
        className="max-w-4xl mx-auto p-6"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <DateRangePicker 
          value={dateRange} 
          onChange={setDateRange} 
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:col-span-2">
            <MetricCard
              title="Total Users"
              value={processedData?.totalUsers}
              change={processedData?.userGrowthRate}
              icon={<UsersIcon />}
              color="blue"
            />
            <MetricCard
              title="Active Sessions"
              value={processedData?.activeSessions}
              change={processedData?.sessionGrowthRate}
              icon={<ActivityIcon />}
              color="green"
            />
            <MetricCard
              title="Avg. Session"
              value={`${processedData?.avgSessionDuration} mins`}
              change={processedData?.durationChange}
              icon={<ClockIcon />}
              color="purple"
            />
          </div>

          {/* Charts */}
          <ChartCard title="User Growth Over Time">
            <Line data={lineChartData} options={chartOptions} />
          </ChartCard>

          <ChartCard title="Top Pages by Views">
            <Bar data={barChartData} options={chartOptions} />
          </ChartCard>

          <ChartCard title="Traffic Sources" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">
                <Pie data={pieChartData} options={chartOptions} />
              </div>
              <div className="space-y-4">
                <TrafficSourceItem
                  name="Direct"
                  value={processedData?.trafficSources?.direct || 0}
                  total={processedData?.totalVisits || 1}
                  color="bg-blue-500"
                />
                <TrafficSourceItem
                  name="Organic Search"
                  value={processedData?.trafficSources?.organic || 0}
                  total={processedData?.totalVisits || 1}
                  color="bg-green-500"
                />
                <TrafficSourceItem
                  name="Social"
                  value={processedData?.trafficSources?.social || 0}
                  total={processedData?.totalVisits || 1}
                  color="bg-purple-500"
                />
                <TrafficSourceItem
                  name="Referral"
                  value={processedData?.trafficSources?.referral || 0}
                  total={processedData?.totalVisits || 1}
                  color="bg-yellow-500"
                />
              </div>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
};

// Reusable components
const MetricCard = ({ title, value, change, icon, color }) => {
  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↑" : "↓";
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value || 0}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900 text-${color}-600 dark:text-${color}-300`}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <p className={`mt-2 text-sm ${changeColor}`}>
          {changeIcon} {Math.abs(change)}% from last period
        </p>
      )}
    </div>
  );
};

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
    <div className="h-80">{children}</div>
  </div>
);

const TrafficSourceItem = ({ name, value, total, color }) => {
  const percentage = ((value / total) * 100).toFixed(1);
  
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Simple icons (replace with actual icon components if available)
const UsersIcon = () => <span>👥</span>;
const ActivityIcon = () => <span>📈</span>;
const ClockIcon = () => <span>⏱️</span>;

export default Analytics;