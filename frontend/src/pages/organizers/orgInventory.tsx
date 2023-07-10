import React, { useState, useEffect } from 'react';
import OrgNavbar from '../../components/orgNavbar';
import { ethers } from 'ethers';
import MyToken from "../../assets/MyToken.json";
import "../../style/organizers/orgInventory.css";
import Cookies from 'js-cookie';
import Ticket from "../../components/Ticket";

function OrgInventory() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  interface Ticket {
    name: string;
    place: string;
    date: string;
    ticketPrice: ethers.BigNumber;
    ticketNumber: ethers.BigNumber;
  }

  useEffect(() => {
    async function getTickets() {
      try {
        const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const contractAddress = '0xB214a909db206a1E4b38631379E9b0767cdbcDD7';
        const contract = new ethers.Contract(contractAddress, MyToken.abi, provider);

        const organizerAddress = Cookies.get("org_wallet_address");
        const collectionCount = await contract.getCollectionCounter();
        let tickets: Ticket[] = [];

        for (let i = 0; i < collectionCount; i++) {
          const collection = await contract.getCollection(i);
          console.log(collection);
          for (let j = 0; j < collection.tokenIds.length; j++) {
            const tokenId = collection.tokenIds[j];
            const ticketData = await contract.getTicketData(tokenId);
            console.log(ticketData);
            if (ticketData.organizerAddress === organizerAddress) {
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
      } catch (error) {
        console.error(error);
      }
    }

    getTickets();
  }, []);

  return (
    <div>
      <OrgNavbar />
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
}

export default OrgInventory;
