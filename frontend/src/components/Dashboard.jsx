import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBell } from 'react-icons/fa';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const kpiCards = [
  { title: 'Gross Sales', value: '$22,892', trend: '26%', trendValue: '+1.42k today', trendUp: true },
  { title: 'Average Sales', value: '$8,283', trend: '23%', trendValue: '+0.34k today', trendUp: true },
  { title: 'New Sales', value: '$1,853', trend: '2.4%', trendValue: '+0.45 today', trendUp: false },
  { title: 'Gross Profits', value: '$5,239', trend: '14.4%', trendValue: '+0.5k today', trendUp: true },
];

const stackedAreaData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [5000, 5500, 7000, 6500, 6300, 7000, 8500, 9200, 6300, 9500, 10500, 10800],
      backgroundColor: 'rgba(255, 159, 64, 0.3)',
      borderColor: '#FF9F40',
      fill: true,
      tension: 0.4,
      stack: 'stack1',
      pointRadius: 0,
    },
    {
      label: 'Costs',
      data: [3200, 4100, 4500, 4700, 2900, 4300, 5800, 5600, 3300, 4800, 4700, 5000],
      backgroundColor: 'rgba(160, 215, 231, 0.4)',
      borderColor: '#A0D7E7',
      fill: true,
      tension: 0.4,
      stack: 'stack1',
      pointRadius: 0,
    },
  ],
};

const donutData = {
  labels: ['Today', 'Max'],
  datasets: [
    {
      data: [274, 2300],
      backgroundColor: ['#FF9F40', '#A0D7E7'],
      cutout: '70%',
      borderWidth: 0,
    },
  ],
};

function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontSize: '14px' }}>
      <main className="p-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="search"
            placeholder="Search..."
            className="form-control"
            style={{ maxWidth: '240px', fontSize: '13px' }}
          />
          <div className="d-flex align-items-center gap-2">
            <FaBell style={{ fontSize: '16px', cursor: 'pointer' }} />
            <img
              src="https://randomuser.me/api/portraits/men/33.jpg"
              alt="User"
              style={{ width: '28px', height: '28px', borderRadius: '50%' }}
            />
            <span style={{ fontWeight: '600', fontSize: '13px' }}>Dibbendo</span>
          </div>
        </div>

        {/* Greeting */}
        <h6 style={{ marginBottom: '4px' }}>Morning, Dibbendo!</h6>
        <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
          Here’s what’s happening with your store today.
        </p>

        {/* KPI Cards */}
        <div className="d-flex justify-content-between gap-3 mb-3 flex-wrap">
          {kpiCards.map(({ title, value, trend, trendValue, trendUp }) => (
            <div
              key={title}
              className="border rounded p-2"
              style={{ flex: 1, minWidth: '150px', backgroundColor: '#fff' }}
            >
              <small className="text-muted">{title}</small>
              <h5 className="mb-1" style={{ fontWeight: '700', fontSize: '16px' }}>
                {value}
              </h5>
              <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                <span style={{ color: trendUp ? '#00a86b' : '#de1a1a', fontWeight: '600' }}>
                  {trendUp ? '↗' : '↘'} {trend}
                </span>
                <small className="text-muted">{trendValue}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="d-flex gap-3 mb-3 flex-wrap">
          {/* Stacked Area Chart */}
          <div
            className="border rounded p-2"
            style={{ flex: '1 1 62%', maxWidth: '62%', backgroundColor: '#fff' }}
          >
            <h6 className="mb-2" style={{ fontSize: '13px' }}>
              Revenue vs Costs
            </h6>
            <Line
              data={stackedAreaData}
              options={{
                plugins: {
                  legend: { display: true, position: 'top' },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: {
                    stacked: true,
                    grid: { display: false },
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 18000,
                    grid: { drawBorder: false },
                  },
                },
                elements: {
                  line: { borderWidth: 2 },
                  point: { radius: 0 },
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
              }}
            />
          </div>

          {/* Half Donut Chart */}
          <div
            className="border rounded p-2 d-flex flex-column align-items-center justify-content-center"
            style={{ flex: '1 1 35%', maxWidth: '35%', backgroundColor: '#fff' }}
          >
            <h6 className="mb-2" style={{ fontSize: '13px' }}>
              Unit Solds
            </h6>
            <Doughnut
              data={donutData}
              options={{
                rotation: -90,
                circumference: 180,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="d-flex gap-2 mt-2" style={{ fontSize: '12px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#FF9F40',
                    marginRight: '5px',
                    borderRadius: '2px',
                  }}
                ></span>
                Today 274
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#A0D7E7',
                    marginRight: '5px',
                    borderRadius: '2px',
                  }}
                ></span>
                Max 2300
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="d-flex gap-3 flex-wrap">
          {/* Sales Overview */}
          <div className="border rounded p-3" style={{ flex: 1, minWidth: '300px', backgroundColor: '#fff' }}>
            <h6 className="mb-3" style={{ fontSize: '13px' }}>Sales Overview</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between"><span>Monthly Sales</span><strong>$12,320</strong></div>
              <div className="d-flex justify-content-between"><span>Monthly Profit</span><strong>$4,230</strong></div>
              <div className="d-flex justify-content-between"><span>Daily Sales</span><strong>$850</strong></div>
              <div className="d-flex justify-content-between"><span>Daily Profit</span><strong>$312</strong></div>
            </div>
          </div>

          {/* Purchase Overview */}
          <div className="border rounded p-3" style={{ flex: 1, minWidth: '300px', backgroundColor: '#fff' }}>
            <h6 className="mb-3" style={{ fontSize: '13px' }}>Purchase Overview</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between"><span>No of Purchases</span><strong>124</strong></div>
              <div className="d-flex justify-content-between"><span>Cancel Orders</span><strong>12</strong></div>
              <div className="d-flex justify-content-between"><span>Purchase Amount</span><strong>$9,430</strong></div>
              <div className="d-flex justify-content-between"><span>Returns</span><strong>$340</strong></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
