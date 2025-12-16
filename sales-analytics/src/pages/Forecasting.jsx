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
  Cloud,
  Thermometer,
  Droplets
} from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import ForecastChart from '../components/charts/ForecastChart';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { forecastData, forecastSummary, weatherData, weatherImpactSummary } from '../data/mockData';

const Forecasting = () => {
  const [loading, setLoading] = useState(true);
  const [forecastPeriod, setForecastPeriod] = useState('30');
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showWeatherInfo, setShowWeatherInfo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get forecast weather data
  const forecastWeather = weatherData.filter(w => w.type === 'forecast');

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

  // Find peak and low days
  const peakDays = [...forecastData.forecast]
    .sort((a, b) => b.predicted - a.predicted)
    .slice(0, 3);
  const lowDays = [...forecastData.forecast]
    .sort((a, b) => a.predicted - b.predicted)
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Configuration Panel */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Forecast Period:</span>
              <select
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7">Next 7 Days</option>
                <option value="14">Next 14 Days</option>
                <option value="30">Next 30 Days</option>
                <option value="90">Next 90 Days</option>
              </select>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Generate Forecast
          </button>
        </div>
      </div>

      {/* Weather Forecast Section */}
      <div className="card dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weather-Based Forecast</h3>
          </div>
          <button
            onClick={() => setShowWeatherInfo(!showWeatherInfo)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showWeatherInfo ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Weather Cards - Next 7 Days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          {forecastWeather.slice(0, 7).map((day, idx) => (
            <div
              key={day.date}
              className={`p-3 rounded-xl text-center transition-all ${
                idx === 0
                  ? 'bg-white dark:bg-gray-700 shadow-md ring-2 ring-primary-500'
                  : 'bg-white/50 dark:bg-gray-700/50'
              }`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {idx === 0 ? 'Tomorrow' : day.displayDate}
              </p>
              <p className="text-2xl mb-1">{day.icon}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{day.weather}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Thermometer className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{day.temperature}°C</span>
              </div>
              <p className={`text-xs font-medium mt-1 ${
                day.salesImpact > 0 ? 'text-success-600' : day.salesImpact < 0 ? 'text-danger-600' : 'text-gray-500'
              }`}>
                {day.salesImpact > 0 ? '+' : ''}{day.salesImpact}% sales
              </p>
            </div>
          ))}
        </div>

        {showWeatherInfo && (
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weather Impact on Sales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {weatherImpactSummary.insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{insight.weather}</span>
                    <span className={`text-sm font-bold ${
                      insight.impact.startsWith('+') ? 'text-success-600' :
                      insight.impact.startsWith('-') ? 'text-danger-600' : 'text-gray-500'
                    }`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Forecast Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title="Predicted Sales"
          value={forecastSummary.predictedRevenue}
          icon={TrendingUp}
          suffix=" SAR"
          trend="up"
          trendValue={forecastSummary.expectedGrowth}
          comparisonText="expected growth"
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          loading={loading}
        />
        <KPICard
          title="Expected Growth"
          value={forecastSummary.expectedGrowth}
          icon={Target}
          suffix="%"
          trend="up"
          trendValue={2.3}
          comparisonText="vs last period"
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

      {/* Forecast Chart */}
      <ForecastChart
        historicalData={forecastData.historical.slice(-30)}
        forecastData={forecastData.forecast}
        title="Sales Forecast Visualization"
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
        data={forecastData.forecast}
        columns={forecastColumns}
        title="Daily Forecast Details"
        pageSize={10}
        loading={loading}
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
                  <Badge variant="info">Weather API</Badge>
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

            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <h4 className="font-semibold text-primary-800 dark:text-primary-300 mb-2">About the Forecasting Models</h4>
              <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>
                  <strong>Prophet (Facebook):</strong> Handles seasonality, holidays, and trend changes automatically. Excellent for daily/weekly patterns.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>
                  <strong>LSTM Networks:</strong> Deep learning model that captures complex temporal patterns and long-term dependencies in sales data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>
                  <strong>Weather Integration:</strong> Incorporates weather forecast data to adjust predictions based on temperature, conditions, and their historical impact on sales.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasting;
