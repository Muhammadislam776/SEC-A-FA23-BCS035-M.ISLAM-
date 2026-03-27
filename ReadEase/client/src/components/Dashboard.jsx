import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Book, Users, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  const pieData = {
    labels: ['Available', 'Borrowed'],
    datasets: [{
      data: [stats?.availableCopies || 0, stats?.borrowedBooks || 0],
      backgroundColor: ['#2563eb', '#ef4444'],
      hoverBackgroundColor: ['#1d4ed8', '#dc2626'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Borrowings',
      data: stats?.trends || [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(37, 99, 235, 0.7)',
      borderRadius: 10,
    }],
  };

  const statCards = [
    { label: 'Total Books', value: stats?.totalBooks || 0, icon: <Book size={24} />, color: 'primary' },
    { label: 'Total Members', value: stats?.totalMembers || 0, icon: <Users size={24} />, color: 'success' },
    { label: 'Active Loans', value: stats?.borrowedBooks || 0, icon: <Activity size={24} />, color: 'warning' },
    { label: 'Reservations', value: 0, icon: <Clock size={24} />, color: 'info' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
    >
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold mb-1">Library <span className="text-primary">Insights</span></h1>
          <p className="text-muted mb-0">Monitor your library activity in real-time</p>
        </div>
        <button className="btn btn-outline-primary rounded-pill px-4" onClick={fetchStats}>Refresh Data</button>
      </div>
      
      <div className="row g-4 mb-5">
        {statCards.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <motion.div 
              whileHover={{ y: -5 }}
              className="card p-4 border-0 glass shadow-sm h-100 rounded-4"
            >
              <div className="d-flex align-items-center mb-3">
                <div className={`p-3 rounded-circle bg-${stat.color} bg-opacity-10 text-${stat.color} me-3`}>
                  {stat.icon}
                </div>
                <h6 className="text-muted fw-bold mb-0">{stat.label}</h6>
              </div>
              <h2 className="fw-bold mb-0">{stat.value.toLocaleString()}</h2>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card p-4 border-0 glass h-100 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-4">Inventory Overview</h5>
            <div style={{ height: '320px' }} className="d-flex justify-content-center align-items-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card p-4 border-0 glass h-100 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-4">Borrowing Trends</h5>
            <div style={{ height: '320px' }}>
              <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
