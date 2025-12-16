import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Package,
  ShoppingBag,
  Filter
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import SalesLineChart from '../components/charts/SalesLineChart';
import BarChart from '../components/charts/BarChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import {
  dashboardKPIs,
  dailySalesData,
  salesByCategory,
  branchRevenue,
  productPerformance,
  categorySalesData
} from '../data/mockData';

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('last30days');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['all', 'Sweets', 'Drinks', 'Pastries', 'Cakes', 'Specials'];

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        revenue: dashboardKPIs.totalRevenue,
        orders: dashboardKPIs.totalOrders,
        avgOrderValue: dashboardKPIs.avgOrderValue,
        growth: dashboardKPIs.trends.revenueChange,
        dailySales: dailySalesData,
        products: productPerformance
      };
    }

    const categoryData = categorySalesData[selectedCategory];
    return {
      revenue: categoryData.totalRevenue,
      orders: categoryData.totalOrders,
      avgOrderValue: categoryData.avgOrderValue,
      growth: categoryData.growth,
      dailySales: categoryData.dailySales,
      products: productPerformance.filter(p => p.category === selectedCategory)
    };
  }, [selectedCategory]);

  const productColumns = [
    { key: 'name', label: 'Product Name' },
    {
      key: 'category',
      label: 'Category',
      render: (value) => <Badge variant="primary">{value}</Badge>
    },
    {
      key: 'salesQty',
      label: 'Sales Qty',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => `${value.toLocaleString()} SAR`
    },
    {
      key: 'profitMargin',
      label: 'Profit Margin',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-success-500 rounded-full"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      )
    },
    {
      key: 'growth',
      label: 'Growth',
      render: (value) => (
        <span className={`flex items-center gap-1 font-medium ${value >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
          {value >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(value)}%
        </span>
      )
    }
  ];

  const branchRevenueData = branchRevenue.map(b => ({
    name: b.name.split(' - ')[0].split(' ')[0],
    value: b.revenue
  }));

  const categoryRevenueData = salesByCategory.map(c => ({
    name: c.name,
    value: c.value
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category Filter Section */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Category Info */}
      {selectedCategory !== 'all' && (
        <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedCategory} Category Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Top Item: <span className="font-medium text-primary-600 dark:text-primary-400">
                  {categorySalesData[selectedCategory]?.topItem}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title={selectedCategory === 'all' ? 'Total Revenue' : `${selectedCategory} Revenue`}
          value={filteredData.revenue}
          icon={DollarSign}
          suffix=" SAR"
          trend={filteredData.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(filteredData.growth)}
          iconBgColor="bg-success-100"
          iconColor="text-success-600"
          loading={loading}
        />
        <KPICard
          title="Total Orders"
          value={filteredData.orders}
          icon={Package}
          trend="up"
          trendValue={8.3}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          loading={loading}
        />
        <KPICard
          title="Avg Order Value"
          value={filteredData.avgOrderValue}
          icon={TrendingUp}
          suffix=" SAR"
          trend="up"
          trendValue={5.2}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-600"
          loading={loading}
        />
        <KPICard
          title="Growth Rate"
          value={filteredData.growth}
          icon={TrendingUp}
          suffix="%"
          trend={filteredData.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(filteredData.growth)}
          comparisonText="vs last month"
          iconBgColor="bg-accent-100"
          iconColor="text-accent-600"
          loading={loading}
        />
      </div>

      {/* Sales Trend Chart */}
      <SalesLineChart
        data={filteredData.dailySales}
        title={selectedCategory === 'all' ? 'Sales Trends (All Categories)' : `${selectedCategory} Sales Trends`}
        loading={loading}
        height={400}
      />

      {/* Revenue Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={categoryRevenueData}
          title="Revenue by Category"
          dataKey="value"
          nameKey="name"
          fill="#0ea5e9"
          layout="vertical"
          loading={loading}
        />
        <BarChart
          data={branchRevenueData}
          title="Revenue by Branch"
          dataKey="value"
          nameKey="name"
          fill="#22c55e"
          layout="vertical"
          loading={loading}
        />
      </div>

      {/* Branch Performance Summary */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branch Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branchRevenue.map((branch, index) => (
            <div
              key={branch.name}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {branch.name.split(' - ')[0]}
                </span>
                <Badge variant={index === 0 ? 'success' : 'default'}>
                  {branch.percentage}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {branch.revenue.toLocaleString()} SAR
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {branch.orders.toLocaleString()} orders
              </p>
              <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${branch.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Performance Table */}
      <DataTable
        data={filteredData.products}
        columns={productColumns}
        title={selectedCategory === 'all' ? 'All Products Performance' : `${selectedCategory} Products`}
        pageSize={10}
        loading={loading}
        emptyMessage={`No products found in ${selectedCategory} category`}
      />
    </div>
  );
};

export default SalesAnalytics;
