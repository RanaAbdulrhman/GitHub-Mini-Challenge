import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Activity,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  Coffee,
  IceCream,
  Cake,
  Thermometer
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import ForecastChart from '../components/charts/ForecastChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { forecastData, forecastSummary, weatherData } from '../data/mockData';

// Category weather impact predictions
const getCategoryWeatherImpact = (weather, temperature) => {
  const impacts = [];

  if (weather === 'Hot' || temperature >= 35) {
    impacts.push({ category: 'Drinks', item: 'Iced Latte', change: +35, icon: '🧊' });
    impacts.push({ category: 'Drinks', item: 'Lemonade', change: +40, icon: '🍋' });
    impacts.push({ category: 'Sweets', item: 'Ice Cream Scoop', change: +50, icon: '🍨' });
    impacts.push({ category: 'Drinks', item: 'Espresso', change: -20, icon: '☕' });
  } else if (weather === 'Rainy' || weather === 'Cloudy') {
    impacts.push({ category: 'Drinks', item: 'Spanish Latte', change: +25, icon: '☕' });
    impacts.push({ category: 'Drinks', item: 'Hot Chocolate', change: +30, icon: '🍫' });
    impacts.push({ category: 'Sweets', item: 'Tiramisu', change: +15, icon: '🍰' });
    impacts.push({ category: 'Drinks', item: 'Iced Tea', change: -25, icon: '🧊' });
  } else if (weather === 'Mild' || (temperature >= 20 && temperature <= 28)) {
    impacts.push({ category: 'Drinks', item: 'Cappuccino', change: +20, icon: '☕' });
    impacts.push({ category: 'Pastries', item: 'Chocolate Croissant', change: +15, icon: '🥐' });
    impacts.push({ category: 'Cakes', item: 'Pistachio Cake', change: +10, icon: '🎂' });
  } else if (weather === 'Sunny') {
    impacts.push({ category: 'Drinks', item: 'Iced Latte', change: +20, icon: '🧊' });
    impacts.push({ category: 'Sweets', item: 'Fruit Tart', change: +25, icon: '🍓' });
    impacts.push({ category: 'Drinks', item: 'Lemonade', change: +30, icon: '🍋' });
  }

  return impacts;
};

const Forecasting = () => {
  const [loading, setLoading] = useState(true);
  const [showModelInfo, setShowModelInfo] = useState(false);

  // Date range state - default to today + 30 days
  const today = new Date();
  const defaultEndDate = new Date(today);
  defaultEndDate.setDate(today.getDate() + 30);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(defaultEndDate));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate days between dates for display
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter forecast data based on date range
  const filteredForecastData = forecastData.forecast.filter(item => {
    const itemDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  });

  // Get forecast weather data
  const forecastWeather = weatherData.filter(w => w.type === 'forecast');
  const tomorrowWeather = forecastWeather[0];
  const categoryImpacts = tomorrowWeather ? getCategoryWeatherImpact(tomorrowWeather.weather, tomorrowWeather.temperature) : [];

  const forecastColumns = [
    {
      key: 'displayDate',
      label: 'Date',
      render: (value, row) => (
        <div>
          <span className="font-medium">{value}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
            {row.dayName}
          </span>
        </div>
      )
    },
    {
      key: 'predicted',
      label: 'Predicted Sales',
      render: (value) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {value.toLocaleString()} SAR
        </span>
      )
    },
    {
      key: 'lowerBound',
      label: 'Lower Bound',
      render: (value) => `${value.toLocaleString()} SAR`
    },
    {
      key: 'upperBound',
      label: 'Upper Bound',
      render: (value) => `${value.toLocaleString()} SAR`
    },
    {
      key: 'confidence',
      label: 'Confidence',
      render: (value) => <Badge variant="success">{value}%</Badge>
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value) => value ? (
        <span className="text-warning-600 dark:text-warning-400 text-sm flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {value}
        </span>
      ) : '-'
    }
  ];

  // Find peak and low days from filtered data
  const peakDays = [...filteredForecastData]
    .sort((a, b) => b.predicted - a.predicted)
    .slice(0, 3);
  const lowDays = [...filteredForecastData]
    .sort((a, b) => a.predicted - b.predicted)
    .slice(0, 3);

  // Calculate summary for filtered period
  const filteredSummary = {
    predictedRevenue: filteredForecastData.reduce((sum, d) => sum + d.predicted, 0),
    avgDaily: filteredForecastData.length > 0
      ? Math.round(filteredForecastData.reduce((sum, d) => sum + d.predicted, 0) / filteredForecastData.length)
      : 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Configuration Panel - Date Range Picker */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Forecast Period:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Start:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">End:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
                {calculateDays()} days
              </span>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Generate Forecast
          </button>
        </div>
      </div>

      {/* Forecast Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title="Predicted Sales"
          value={filteredSummary.predictedRevenue}
          icon={TrendingUp}
          suffix=" SAR"
          trend="up"
          trendValue={forecastSummary.expectedGrowth}
          comparisonText={`${calculateDays()} day forecast`}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          loading={loading}
        />
        <KPICard
          title="Avg Daily Sales"
          value={filteredSummary.avgDaily}
          icon={Target}
          suffix=" SAR"
          trend="up"
          trendValue={5.2}
          comparisonText="per day average"
          iconBgColor="bg-success-100"
          iconColor="text-success-600"
          loading={loading}
        />
        <KPICard
          title="Model Accuracy"
          value={forecastSummary.modelAccuracy}
          icon={Activity}
          suffix="%"
          trend="up"
          trendValue={1.2}
          comparisonText="improvement"
          iconBgColor="bg-warning-100"
          iconColor="text-warning-600"
          loading={loading}
        />
        <KPICard
          title="MAPE"
          value={forecastSummary.mape}
          icon={Target}
          suffix="%"
          trend="down"
          trendValue={0.8}
          comparisonText="error rate"
          iconBgColor="bg-info-100"
          iconColor="text-info-600"
          loading={loading}
        />
      </div>

      {/* Category Forecast Based on Weather - Tomorrow's Predictions */}
      {tomorrowWeather && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tomorrow's Category Forecast
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="text-2xl">{tomorrowWeather.icon}</span>
              <span>{tomorrowWeather.weather}</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span>{tomorrowWeather.temperature}°C</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryImpacts.map((impact, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  impact.change > 0
                    ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                    : 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{impact.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{impact.item}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{impact.category}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  impact.change > 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {impact.change > 0 ? '+' : ''}{impact.change}% expected
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Based on weather conditions, adjust your inventory and promotions accordingly.
          </p>
        </div>
      )}

      {/* Forecast Chart */}
      <ForecastChart
        historicalData={forecastData.historical.slice(-30)}
        forecastData={filteredForecastData}
        title={`Sales Forecast (${startDate} to ${endDate})`}
        loading={loading}
        height={450}
      />

      {/* Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Days */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <TrendingUp className="w-5 h-5 text-success-500" />
            Peak Demand Days
          </h3>
          <div className="space-y-3">
            {peakDays.map((day, idx) => {
              const weatherForDay = forecastWeather.find(w => w.date === day.date);
              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success-500 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{day.displayDate}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{day.dayName}</p>
                    </div>
                    {weatherForDay && (
                      <span className="text-lg" title={weatherForDay.weather}>{weatherForDay.icon}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success-600 dark:text-success-400">
                      {day.predicted.toLocaleString()} SAR
                    </p>
                    {day.notes && (
                      <p className="text-xs text-warning-600 dark:text-warning-400">{day.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Recommendation:</strong> Ensure adequate staffing and inventory for these high-demand days.
            </p>
          </div>
        </div>

        {/* Low Days */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <AlertCircle className="w-5 h-5 text-warning-500" />
            Low Demand Days
          </h3>
          <div className="space-y-3">
            {lowDays.map((day, idx) => {
              const weatherForDay = forecastWeather.find(w => w.date === day.date);
              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning-500 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{day.displayDate}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{day.dayName}</p>
                    </div>
                    {weatherForDay && (
                      <span className="text-lg" title={weatherForDay.weather}>{weatherForDay.icon}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-warning-600 dark:text-warning-400">
                      {day.predicted.toLocaleString()} SAR
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Recommendation:</strong> Consider promotions or special offers to boost sales on these days.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Forecast Table */}
      <DataTable
        data={filteredForecastData}
        columns={forecastColumns}
        title={`Daily Forecast Details (${filteredForecastData.length} days)`}
        pageSize={10}
        loading={loading}
        emptyMessage="No forecast data available for the selected date range"
      />

      {/* Model Information */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <button
          onClick={() => setShowModelInfo(!showModelInfo)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Information</h3>
          </div>
          {showModelInfo ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showModelInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Models Used</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {forecastSummary.modelsUsed.map(model => (
                    <Badge key={model} variant="primary">{model}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Training Period</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {forecastSummary.trainingPeriod}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Confidence Level</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {forecastSummary.confidence}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {new Date(forecastSummary.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasting;
