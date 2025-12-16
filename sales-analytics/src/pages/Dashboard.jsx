import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Award,
  Coffee,
  Star
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import SalesLineChart from '../components/charts/SalesLineChart';
import DonutChart from '../components/charts/DonutChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import DataTable from '../components/ui/DataTable';
import {
  dashboardKPIs,
  dailySalesData,
  salesByCategory,
  orderTypes,
  topProducts,
  bottomProducts,
  peakHoursData
} from '../data/mockData';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get top selling product and category
  const topProduct = topProducts[0];
  const topCategory = salesByCategory[0];

  const topProductColumns = [
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'sales',
      label: 'Sales',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => `${value.toLocaleString()} SAR`
    },
    {
      key: 'growth',
      label: 'Growth',
      render: (value) => (
        <span className={`flex items-center gap-1 ${value >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
          {value >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(value)}%
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards - Different from Sales Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Revenue */}
        <KPICard
          title="Total Revenue"
          value={dashboardKPIs.totalRevenue}
          icon={DollarSign}
          prefix=""
          suffix=" SAR"
          trend={dashboardKPIs.trends.revenueChange >= 0 ? 'up' : 'down'}
          trendValue={dashboardKPIs.trends.revenueChange}
          iconBgColor="bg-success-100"
          iconColor="text-success-600"
          loading={loading}
        />

        {/* Top Selling Product - Custom Card */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Selling Product</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{topProduct.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{topProduct.sales} sold</span>
                  <span className={`flex items-center gap-1 text-sm font-medium ${topProduct.growth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {topProduct.growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(topProduct.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-xl">
                <Award className="w-6 h-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          )}
        </div>

        {/* Top Category - Custom Card */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Category</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{topCategory.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{topCategory.value.toLocaleString()} SAR</span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {topCategory.percentage}% of sales
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <Star className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          )}
        </div>

        {/* Total Customers */}
        <KPICard
          title="Total Customers"
          value={dashboardKPIs.totalCustomers}
          icon={Users}
          trend={dashboardKPIs.trends.customersChange >= 0 ? 'up' : 'down'}
          trendValue={dashboardKPIs.trends.customersChange}
          iconBgColor="bg-accent-100"
          iconColor="text-accent-600"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesLineChart
            data={dailySalesData}
            title="Daily Sales Performance (Past 30 Days)"
            loading={loading}
          />
        </div>
        <div>
          <DonutChart
            data={salesByCategory}
            title="Sales by Category"
            loading={loading}
          />
        </div>
      </div>

      {/* Order Types & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <DonutChart
            data={orderTypes}
            title="Order Types"
            innerRadius={50}
            outerRadius={80}
            height={280}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-2">
          <HeatmapChart
            data={peakHoursData}
            title="Peak Hours Heatmap"
            loading={loading}
          />
        </div>
      </div>

      {/* Products Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          data={topProducts}
          columns={topProductColumns}
          title="Top 5 Selling Products"
          searchable={false}
          pagination={false}
          loading={loading}
        />
        <DataTable
          data={bottomProducts}
          columns={topProductColumns}
          title="Bottom 5 Products"
          searchable={false}
          pagination={false}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
