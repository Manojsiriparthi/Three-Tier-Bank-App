import React from 'react';

const HomePage = () => {
  return (
    <div className="home-container">
      <nav className="nav-bar">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/register">Registration</a>
        <a href="/withdraw">Withdraw</a>
        <a href="/deposit">Deposit</a>
        <a href="/transfer">Transfer</a>
      </nav>

      <h1 className="bank-name">MANOJ FIRST BANK</h1>

      <p className="inspirational-message">
        At Manoj First Bank, your financial journey is our priority.<br />
        We believe in empowering you to achieve your dreams, big or small.<br />
        With trust, integrity, and innovation, we're here to help you grow.
      </p>

      <img src="https://nu10.co/wp-content/uploads/2024/01/fintech-img.png" alt="Bank" className="bank-image" />
    </div>
  );
};

export default HomePage;

