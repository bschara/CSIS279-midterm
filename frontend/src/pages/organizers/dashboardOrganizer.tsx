// import React, { useState, useEffect } from "react";
// import OrgNavbar from "../../components/orgNavbar";
// import axios from "axios";
// import "../../style/organizers/organizerDashboard.css";
// import { ethers } from "ethers";
// import MyToken from "../../assets/MyToken.json";

// interface Transaction {
//   from: string;
//   to: string;
//   value: string;
// }

// function DashboardOrganizer() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [totalCollections, setTotalCollections] = useState<number>(0);
//   const [totalTicketsSold, setTotalTicketsSold] = useState<number>(0);
//   const [totalSalesValue, setTotalSalesValue] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
//   const totalPages = Math.ceil(transactions.length / itemsPerPage);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // JSX for pagination controls
//   const paginationControls = (
//     <div className="pagination">
//       <button onClick={prevPage}>Previous</button>
//       <span>
//         Page {currentPage} of {totalPages}
//       </span>
//       <button onClick={nextPage}>Next</button>
//     </div>
//   );

//   // Calculate the total number of pages

//   const orgAddress = sessionStorage.getItem("org_wallet_address");
//   const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
//   const provider = new ethers.providers.JsonRpcProvider(providerUrl);
//   const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
//   const signer = new ethers.Wallet(privateKey, provider);
//   const contractAddress = "0x6EC1d183b8E674f5A08ed5fFfC9530629bD83f89";
//   const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

//   useEffect(() => {
//     const getCollections = async () => {
//       const collections = await contract.getCollectionsByOrganizer(orgAddress);
//       setTotalCollections(collections.length);
//     };

//     const getTransactions = async () => {
//       const response = await axios.get("https://api-sepolia.etherscan.io/api", {
//         params: {
//           module: "account",
//           action: "txlist",
//           address: orgAddress,
//           sort: "desc",
//           apikey: "9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD",
//         },
//       });
//       setTransactions(response.data.result);
//     };

//     const getTotalTicketsSold = async () => {
//       var totalTickets = 0;
//       const collections = await contract.getCollectionsByOrganizer(orgAddress);
//       for (let i = 0; i < collections.length; i++) {
//         totalTickets += collections[i].ticketSold;
//       }
//       setTotalTicketsSold(totalTickets);
//     };

//     const getTotalSalesValue = async () => {
//       var totalSales = 0;
//       const collections = await contract.getCollectionsByOrganizer(orgAddress);
//       console.log(collections);
//       for (let i = 0; i < collections.length; i++) {
//         // let tokenId = collections.tokenIds[0];
//         // let price = await contract.getTicketData(tokenId).ticketPrice;
//         // console.log(price);
//         totalSales += collections[i].ticketSold * 0.1;
//       }
//       setTotalSalesValue(totalSales);
//     };

//     getCollections();
//     getTransactions();
//     getTotalTicketsSold();
//     getTotalSalesValue();
//   }, []);

//   return (
//     <div>
//       <OrgNavbar />
//       <div className="dashboard-wrapper">
//         <div className="statistics">
//           <div className="statistics-item">
//             <h3>Total Collections Created</h3>
//             <p>{totalCollections}</p>
//           </div>
//           <div className="statistics-item">
//             <h3>Total Tickets Sold</h3>
//             <p>{totalTicketsSold}</p>
//           </div>
//           <div className="statistics-item">
//             <h3>Total Sales Value</h3>
//             <p>{totalSalesValue}</p>
//           </div>
//         </div>
//         <h1 className="transaction-title">Recent Transactions</h1>
//         <div className="transactions">
//           <table className="transactions-table">
//             <th>From</th>
//             <th>To</th>
//             <th>Value</th>
//             {currentItems.map((transaction, index) => (
//               <tr key={index}>
//                 <td>{transaction.from}</td>
//                 <td>{transaction.to}</td>
//                 <td>{parseFloat(transaction.value) / 1e18}</td>
//               </tr>
//             ))}
//           </table>
//           {paginationControls}{" "}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardOrganizer;

import React, { useState, useEffect } from "react";
import OrgNavbar from "../../components/orgNavbar";
import axios from "axios";
import "../../style/organizers/organizerDashboard.css";
import { ethers } from "ethers";
import MyToken from "../../assets/MyToken.json";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

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

  // Calculate the total number of pages

  const orgAddress = sessionStorage.getItem("org_wallet_address");
  const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
  const signer = new ethers.Wallet(privateKey, provider);
  const contractAddress = "0x6EC1d183b8E674f5A08ed5fFfC9530629bD83f89";
  const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

  useEffect(() => {
    const getCollections = async () => {
      const collections = await contract.getCollectionsByOrganizer(orgAddress);
      setTotalCollections(collections.length);
    };

    const getTransactions = async () => {
      const response = await axios.get("https://api-sepolia.etherscan.io/api", {
        params: {
          module: "account",
          action: "txlist",
          address: orgAddress,
          sort: "desc",
          apikey: "9HW48FJETSESUMGXS3AFHEDBDD3WDNNAMD",
        },
      });
      setTransactions(response.data.result);
    };

    const getTotalTicketsSold = async () => {
      var totalTickets = 0;
      const collections = await contract.getCollectionsByOrganizer(orgAddress);
      for (let i = 0; i < collections.length; i++) {
        totalTickets += collections[i].ticketSold;
        console.log(totalTickets);
      }
      setTotalTicketsSold(totalTickets);
    };

    const getTotalSalesValue = async () => {
      var totalSales = 0;
      const collectionCount = await contract.getCollectionCounter();
      const collections = await contract.getCollectionsByOrganizer(orgAddress);

      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        var price = 0;
        for (let j = 0; j < collection.tokenIds.length; j++) {
          const tokenId = collection.tokenIds[j];
          const ticketData = await contract.getTicketData(tokenId);
          price = ticketData.ticketPrice / 1e18;
        }

        totalSales += collections[i].ticketSold * price;
      }
      setTotalSalesValue(totalSales);
    };

    getCollections();
    getTransactions();
    getTotalTicketsSold();
    getTotalSalesValue();
  }, []);

  return (
    <div>
      <OrgNavbar />
      <div className="dashboard-wrapper">
        <div className="statistics">
          <div className="statistics-item">
            <h3>Total Collections Created</h3>
            <p>{totalCollections}</p>
          </div>
          <div className="statistics-item">
            <h3>Total Tickets Sold</h3>
            <p>{totalTicketsSold}</p>
          </div>
          <div className="statistics-item">
            <h3>Total Sales Value</h3>
            <p>{totalSalesValue} ETH</p>
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

export default DashboardOrganizer;
