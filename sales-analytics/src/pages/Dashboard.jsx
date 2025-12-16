import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
        <KPICard
          title="Total Orders"
          value={dashboardKPIs.totalOrders}
          icon={ShoppingCart}
          trend={dashboardKPIs.trends.ordersChange >= 0 ? 'up' : 'down'}
          trendValue={dashboardKPIs.trends.ordersChange}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          loading={loading}
        />
        <KPICard
          title="Avg Order Value"
          value={dashboardKPIs.avgOrderValue}
          icon={TrendingUp}
          suffix=" SAR"
          trend={dashboardKPIs.trends.avgOrderChange >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(dashboardKPIs.trends.avgOrderChange)}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-600"
          loading={loading}
        />
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
