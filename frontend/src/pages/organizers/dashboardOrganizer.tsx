import React, { useState, useEffect } from 'react';
import OrgNavbar from '../../components/orgNavbar';
import axios from 'axios';
import "../../style/organizers/organizerDashboard.css";
import { ethers } from 'ethers';
import MyToken from '../../assets/MyToken.json';
import Cookies from 'js-cookie';
import PieChart from '../../components/PieChart';


interface Transaction {
  from: string;
  to: string;
  value: string;
}

function DashboardOrganizer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCollections, setTotalCollections] = useState<number>(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState<number>(0);
  const [totalSalesValue, setTotalSalesValue] = useState<number>(0);

  const orgAddress = Cookies.get("org_wallet_address")
  const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
  const signer = new ethers.Wallet(privateKey, provider);
  const contractAddress = "0xB214a909db206a1E4b38631379E9b0767cdbcDD7";
  const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

  useEffect(() => {
    const getCollections = async () => {
      const collections = await contract.getCollectionsByOrganizer(orgAddress);
      setTotalCollections(collections.length);
    }

    const getTransactions = async () => {
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address: "0x06BD27ab0530ba02Bb7B24e59b34bA68ab829F87",
          sort: 'desc',
          apikey: '9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD'
        }
      });
      setTransactions(response.data.result);
    }

    const getTotalTicketsSold = async () => {
      var totalTickets = 0;
      const collections = await contract.getCollectionsByOrganizer(orgAddress);
      for(let i  =0; i < collections.length; i++) {
           totalTickets += collections[i].ticketSold;
      }
      setTotalTicketsSold(totalTickets);
    }

    const getTotalSalesValue = async () => {
      var totalSales = 0;
      const collections = await contract.getCollectionsByOrganizer(orgAddress);
      for(let i  = 0; i < collections.length; i++) {
        //let price = await contract.getTicketData(collections.tokenIds[0]).ticketPrice
        //console.log(price);
        totalSales += collections[i].ticketSold * 0.1;
      }
      setTotalSalesValue(totalSales);
    }

    getCollections();
    getTransactions();
    getTotalTicketsSold();
    getTotalSalesValue();
  }, []);

  const pieChartData = {
    labels: ['Collections', 'Tickets Sold', 'Sales Value'],
    datasets: [
      {
        data: [totalCollections, totalTicketsSold, totalSalesValue],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };
  return (
    <div>
  <OrgNavbar />
  <div className="dashboard-wrapper">
    <div className="statistics">
      <div className="statistics-item">
        <h3>Total Collections</h3>
        <p>{totalCollections}</p>
      </div>
      <div className="statistics-item">
        <h3>Total Tickets Sold</h3>
        <p>{totalTicketsSold}</p>
      </div>
      <div className="statistics-item">
        <h3>Total Sales Value</h3>
        <p>{totalSalesValue}</p>
      </div>
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

export default DashboardOrganizer;
