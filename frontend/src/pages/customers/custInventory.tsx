import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ethers } from "ethers";
import MyToken from "../../assets/MyToken.json";
import "../../style/customers/custInventory.css";
import Cookies from 'js-cookie';
import Ticket from "../../components/Ticket";

interface Ticket {
  name: string;
  place: string;
  date: string;
  ticketPrice: ethers.BigNumber;
  ticketNumber: ethers.BigNumber;
}

function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function getTickets() {
      const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const walletAddress = Cookies.get("cust_wallet_address");
      const contractAddress = "0xB214a909db206a1E4b38631379E9b0767cdbcDD7";
      const contract = new ethers.Contract(contractAddress, MyToken.abi, provider);

      const collectionCount = await contract.getCollectionCounter();
      let tickets: Ticket[] = [];

      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        for (let j = 0; j < collection.tokenIds.length; j++) {
          const tokenId = collection.tokenIds[j];
          const owner = await contract.ownerOf(tokenId);
          if (owner === walletAddress) {
            const ticketData = await contract.getTicketData(tokenId);
            tickets.push({
              name: ticketData.name,
              place: ticketData.place,
              date: ticketData.date,
              ticketPrice: ticketData.ticketPrice,
              ticketNumber: ticketData.ticketNumber,
            });
          }
        }
      }

      setTickets(tickets);
    }

    getTickets();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="ticket-container">
      {tickets.map((ticket) => (
        <Ticket
          name={ticket.name}
          place={ticket.place}
          date={ticket.date}
          ticketPrice={ticket.ticketPrice}
          ticketNumber={ticket.ticketNumber}
        />
      ))}
    </div>
    </div>
  );
};

export default MyTickets;
