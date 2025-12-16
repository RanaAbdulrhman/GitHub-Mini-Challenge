import { useState, useEffect } from 'react';
import {
  Star,
  HelpCircle,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Filter
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import ScatterPlotChart from '../components/charts/ScatterPlotChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import {
  menuItems,
  menuEngineeringSummary,
  recommendations
} from '../data/mockData';

const MenuEngineering = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClassification, setSelectedClassification] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = [...new Set(menuItems.map(item => item.category))];
  const classifications = ['Star', 'Puzzle', 'Plowhorse', 'Dog'];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const classMatch = selectedClassification === 'all' || item.classification === selectedClassification;
    return categoryMatch && classMatch;
  });

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Puzzle': return <HelpCircle className="w-4 h-4" />;
      case 'Plowhorse': return <TrendingDown className="w-4 h-4" />;
      case 'Dog': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getClassificationVariant = (classification) => {
    switch (classification) {
      case 'Star': return 'star';
      case 'Puzzle': return 'puzzle';
      case 'Plowhorse': return 'plowhorse';
      case 'Dog': return 'dog';
      default: return 'default';
    }
  };

  const getActionText = (classification) => {
    switch (classification) {
      case 'Star': return 'Keep & Promote';
      case 'Puzzle': return 'Increase Visibility';
      case 'Plowhorse': return 'Reduce Costs';
      case 'Dog': return 'Consider Removal';
      default: return '-';
    }
  };

  const columns = [
    { key: 'name', label: 'Menu Item' },
    {
      key: 'category',
      label: 'Category',
      render: (value) => <Badge variant="primary">{value}</Badge>
    },
    {
      key: 'classification',
      label: 'Class',
      render: (value) => (
        <Badge variant={getClassificationVariant(value)}>
          <span className="flex items-center gap-1">
            {getClassificationIcon(value)}
            {value}
          </span>
        </Badge>
      )
    },
    {
      key: 'popularity',
      label: 'Sales',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'profitability',
      label: 'Profit %',
      render: (value) => `${value}%`
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value) => `${value.toLocaleString()} SAR`
    },
    {
      key: 'classification',
      label: 'Action',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getActionText(value)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-success-50 to-white dark:from-success-900/20 dark:to-gray-800 border-success-200 dark:border-success-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-700 dark:text-success-400 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Stars
              </p>
              <p className="text-3xl font-bold text-success-800 dark:text-success-300 mt-1">
                {menuEngineeringSummary.stars}
              </p>
              <p className="text-xs text-success-600 dark:text-success-500 mt-1">Keep & Promote</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-info-50 to-white dark:from-info-900/20 dark:to-gray-800 border-info-200 dark:border-info-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-info-700 dark:text-info-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Puzzles
              </p>
              <p className="text-3xl font-bold text-info-800 dark:text-info-300 mt-1">
                {menuEngineeringSummary.puzzles}
              </p>
              <p className="text-xs text-info-600 dark:text-info-500 mt-1">Increase Popularity</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-warning-50 to-white dark:from-warning-900/20 dark:to-gray-800 border-warning-200 dark:border-warning-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-700 dark:text-warning-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Plowhorses
              </p>
              <p className="text-3xl font-bold text-warning-800 dark:text-warning-300 mt-1">
                {menuEngineeringSummary.plowhorses}
              </p>
              <p className="text-xs text-warning-600 dark:text-warning-500 mt-1">Reduce Costs</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-danger-50 to-white dark:from-danger-900/20 dark:to-gray-800 border-danger-200 dark:border-danger-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-danger-700 dark:text-danger-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Dogs
              </p>
              <p className="text-3xl font-bold text-danger-800 dark:text-danger-300 mt-1">
                {menuEngineeringSummary.dogs}
              </p>
              <p className="text-xs text-danger-600 dark:text-danger-500 mt-1">Remove or Redesign</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <ScatterPlotChart
        data={menuItems}
        avgPopularity={menuEngineeringSummary.avgPopularity}
        avgProfitability={menuEngineeringSummary.avgProfitability}
        title="Menu Engineering Matrix"
        loading={loading}
      />

      {/* Filters */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter Items</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Classifications</option>
              {classifications.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <DataTable
        data={filteredItems}
        columns={columns}
        title="Menu Items by Classification"
        pageSize={10}
        loading={loading}
      />

      {/* Strategic Recommendations */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-warning-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategic Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stars */}
          <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-xl border border-success-200 dark:border-success-800">
            <h4 className="flex items-center gap-2 font-semibold text-success-800 dark:text-success-300 mb-3">
              <Star className="w-4 h-4" />
              Stars - High Performers
            </h4>
            <ul className="space-y-2">
              {recommendations.stars.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-success-700 dark:text-success-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success-500 shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Puzzles */}
          <div className="p-4 bg-info-50 dark:bg-info-900/20 rounded-xl border border-info-200 dark:border-info-800">
            <h4 className="flex items-center gap-2 font-semibold text-info-800 dark:text-info-300 mb-3">
              <HelpCircle className="w-4 h-4" />
              Puzzles - Hidden Gems
            </h4>
            <ul className="space-y-2">
              {recommendations.puzzles.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-info-700 dark:text-info-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-info-500 shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Plowhorses */}
          <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-xl border border-warning-200 dark:border-warning-800">
            <h4 className="flex items-center gap-2 font-semibold text-warning-800 dark:text-warning-300 mb-3">
              <TrendingDown className="w-4 h-4" />
              Plowhorses - Volume Drivers
            </h4>
            <ul className="space-y-2">
              {recommendations.plowhorses.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-warning-700 dark:text-warning-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning-500 shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Dogs */}
          <div className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-xl border border-danger-200 dark:border-danger-800">
            <h4 className="flex items-center gap-2 font-semibold text-danger-800 dark:text-danger-300 mb-3">
              <AlertTriangle className="w-4 h-4" />
              Dogs - Underperformers
            </h4>
            <ul className="space-y-2">
              {recommendations.dogs.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-danger-700 dark:text-danger-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-danger-500 shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEngineering;
