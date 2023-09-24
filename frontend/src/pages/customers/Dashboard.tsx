import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import "../../style/customers/customerDashboard.css";
import { ethers } from "ethers";
import MyToken from "../../assets/MyToken.json";

interface Transaction {
  from: string;
  to: string;
  value: string;
}

function Dashboard() {
  // const orgAddress = sessionStorage.getItem("org_wallet_address");
  const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
  const signer = new ethers.Wallet(privateKey, provider);
  const contractAddress = "0x6EC1d183b8E674f5A08ed5fFfC9530629bD83f89";
  console.log(contractAddress);
  const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const cust_wallet_address = sessionStorage.getItem("cust_wallet_address")!;
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalCollections, setTotalCollections] = useState(0);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // JSX for pagination controls
  const paginationControls = (
    <div className="pagination">
      <button onClick={prevPage}>Previous</button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={nextPage}>Next</button>
    </div>
  );

  useEffect(() => {
    const getTransactions = async () => {
      const response = await axios.get("https://api-sepolia.etherscan.io/api", {
        params: {
          module: "account",
          action: "txlist",
          address: cust_wallet_address,
          sort: "desc",
          apikey: "9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD",
        },
      });
      setTransactions(response.data.result);
    };

    const getTotalTickets = async () => {
      const collectionCount = await contract.getCollectionCounter();
      var totTickets = 0;
      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        for (let j = 0; j < collection.tokenIds.length; j++) {
          const tokenId = collection.tokenIds[j];
          const owner = await contract.ownerOf(tokenId);
          if (owner === cust_wallet_address) {
            totTickets++;
          }
        }
      }
      setTotalTickets(totTickets);
    };

    const getTotalValue = async () => {
      const collectionCount = await contract.getCollectionCounter();
      var totalVal = 0;
      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        for (let j = 0; j < collection.tokenIds.length; j++) {
          const tokenId = collection.tokenIds[j];
          const owner = await contract.ownerOf(tokenId);
          if (owner === cust_wallet_address) {
            let ticketData = await contract.getTicketData(tokenId);
            let price = ticketData.ticketPrice / 1e18;
            totalVal += price;
          }
        }
      }
      setTotalValue(totalVal);
    };

    const getAllCollections = async () => {
      const collectionCount = await contract.getCollectionCounter();
      var totalColl = 0;
      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        for (let j = 0; j < collection.tokenIds.length; j++) {
          const tokenId = collection.tokenIds[j];
          const owner = await contract.ownerOf(tokenId);
          if (owner === cust_wallet_address) {
            totalColl++;
            break;
          }
        }
      }
      setTotalCollections(totalColl);
    };

    getTotalTickets();
    getTransactions();
    getTotalValue();
    getAllCollections();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="statistics">
          <div className="statistics-item">
            <h3>Total Number Of Collections</h3>
            {<p>{totalCollections}</p>}
          </div>
          <div className="statistics-item">
            <h3>Total Tickets Owned</h3>
            {<p>{totalTickets}</p>}
          </div>
          <div className="statistics-item">
            <h3>Total Tickets Value</h3>
            {<p>{totalValue}</p>}
          </div>
        </div>
        <h1 className="transaction-title">Recent Transactions</h1>
        <div className="transactions">
          <table className="transactions-table">
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            {currentItems.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{parseFloat(transaction.value) / 1e18}</td>
              </tr>
            ))}
          </table>
          {paginationControls}{" "}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
