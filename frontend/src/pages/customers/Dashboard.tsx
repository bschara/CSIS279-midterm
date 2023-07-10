import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import axios from 'axios';
import "../../style/organizers/organizerDashboard.css";
import Cookies from 'js-cookie';

interface Transaction {
  from: string;
  to: string;
  value: string;
}

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const cust_wallet_address = Cookies.get("cust_wallet_address")!;

  useEffect(() => {
    const getTransactions = async () => {
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address: "0x12970E6868f88f6557B76120662c1B3E50A646bf",
          sort: 'desc',
          apikey: '9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD'
        }
      });
      setTransactions(response.data.result);
    }
    getTransactions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="statistics">
          {/* display statistics */}
          <h2>Statistics</h2>
          {/* Add your statistics display components here */}
        </div>
        <div className="transactions">
          <h2>Recent Transactions</h2>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                <p>From: {transaction.from}</p>
                <p>To: {transaction.to}</p>
                <p>Value: {transaction.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
            }
export default Dashboard;
            