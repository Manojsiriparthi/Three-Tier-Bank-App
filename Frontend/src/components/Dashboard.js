import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-options">
        <button>Savings Account</button>
        <button>Current Account</button>
        <button>Business Account</button>
        <button>Credit Card</button>
        <button>Debit Card</button>
      </div>
    </div>
  );
};

export default Dashboard;

