import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import "../../style/customers/customerDashboard.css";

interface Transaction {
  from: string;
  to: string;
  value: string;
}

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const cust_wallet_address = sessionStorage.getItem("cust_wallet_address")!;

  useEffect(() => {
    const getTransactions = async () => {
      const response = await axios.get("https://api.etherscan.io/api", {
        params: {
          module: "account",
          action: "txlist",
          address: "0x12970E6868f88f6557B76120662c1B3E50A646bf",
          sort: "desc",
          apikey: "9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD",
        },
      });
      setTransactions(response.data.result);
    };
    getTransactions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="statistics">
          <div className="statistics-item">
            <h3>Total Number Of Collections</h3>
            {/* <p>{totalCollections}</p> */}
          </div>
          <div className="statistics-item">
            <h3>Total Tickets Owned</h3>
            {/* <p>{totalTicketsSold}</p> */}
          </div>
          <div className="statistics-item">
            <h3>Total Tickets Value</h3>
            {/* <p>{totalSalesValue}</p> */}
          </div>
        </div>
        <h1 className="transaction-title">Recent Transactions</h1>
        <div className="transactions">
          <table className="transactions-table">
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{transaction.value}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
