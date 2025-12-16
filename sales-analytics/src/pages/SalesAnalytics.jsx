import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import FilterBar from '../components/ui/FilterBar';
import SalesLineChart from '../components/charts/SalesLineChart';
import BarChart from '../components/charts/BarChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import {
  dashboardKPIs,
  dailySalesData,
  salesByCategory,
  branchRevenue,
  productPerformance
} from '../data/mockData';

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30days');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const branches = [
    { value: 'main', label: 'Main Branch - Riyadh' },
    { value: 'mall', label: 'Mall Branch' },
    { value: 'airport', label: 'Airport Branch' },
    { value: 'university', label: 'University Branch' }
  ];

  const categories = [
    'Meals',
    'Beverages',
    'Desserts',
    'Appetizers',
    'Sides',
    'Specials'
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

  // Prepare branch revenue data for bar chart
  const branchRevenueData = branchRevenue.map(b => ({
    name: b.name.split(' - ')[0].split(' ')[0],
    value: b.revenue
  }));

  // Prepare category revenue data for bar chart
  const categoryRevenueData = salesByCategory.map(c => ({
    name: c.name,
    value: c.value
  }));

  const handleExport = () => {
    alert('Exporting sales data...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Bar */}
      <FilterBar
        onDateRangeChange={setDateRange}
        onExport={handleExport}
        branches={branches}
        categories={categories}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title="Total Revenue"
          value={dashboardKPIs.totalRevenue}
          icon={DollarSign}
          suffix=" SAR"
          trend="up"
          trendValue={12.5}
          iconBgColor="bg-success-100"
          iconColor="text-success-600"
          loading={loading}
        />
        <KPICard
          title="Average Daily Sales"
          value={Math.round(dashboardKPIs.totalRevenue / 30)}
          icon={TrendingUp}
          suffix=" SAR"
          trend="up"
          trendValue={8.3}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          loading={loading}
        />
        <KPICard
          title="Total Products Sold"
          value={8234}
          icon={Package}
          trend="up"
          trendValue={15.2}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-600"
          loading={loading}
        />
        <KPICard
          title="Revenue Growth"
          value={12.5}
          icon={TrendingUp}
          suffix="%"
          trend="up"
          trendValue={3.2}
          comparisonText="vs last period"
          iconBgColor="bg-accent-100"
          iconColor="text-accent-600"
          loading={loading}
        />
      </div>

      {/* Sales Trend */}
      <SalesLineChart
        data={dailySalesData}
        title="Sales Trends"
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
        data={productPerformance}
        columns={productColumns}
        title="Product Performance"
        pageSize={10}
        loading={loading}
      />
    </div>
  );
};

export default SalesAnalytics;
