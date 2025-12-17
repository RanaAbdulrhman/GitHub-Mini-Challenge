import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Filter,
  ShoppingBag,
  Package,
  Award,
  Star
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import SalesAreaChart from '../components/charts/SalesAreaChart';
import DonutChart from '../components/charts/DonutChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import BarChart from '../components/charts/BarChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import {
  dashboardKPIs,
  dailySalesData,
  salesByCategory,
  orderTypes,
  topProducts,
  bottomProducts,
  peakHoursData,
  branchRevenue,
  productPerformance,
  categorySalesData
} from '../data/mockData';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get top selling product and category
  const topProduct = topProducts[0];
  const topCategory = salesByCategory[0];

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
        {/* Total Revenue */}
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

      {/* Sales Trend Chart - Area Chart */}
      <SalesAreaChart
        data={filteredData.dailySales}
        title={selectedCategory === 'all' ? 'Daily Sales Performance (Past 30 Days)' : `${selectedCategory} Sales Performance`}
        loading={loading}
        height={400}
      />

      {/* Charts Row - Category & Order Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <DonutChart
            data={salesByCategory}
            title="Sales by Category"
            loading={loading}
          />
        </div>
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
        <div>
          <BarChart
            data={categoryRevenueData}
            title="Revenue by Category"
            dataKey="value"
            nameKey="name"
            fill="#0ea5e9"
            layout="vertical"
            loading={loading}
          />
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <HeatmapChart
        data={peakHoursData}
        title="Peak Hours Heatmap"
        loading={loading}
      />

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

      {/* All Products Performance Table */}
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

export default Dashboard;
