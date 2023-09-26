import React, { useState, useEffect } from "react";
import { ethers, BigNumberish } from "ethers";
import MyToken from "../../assets/MyToken.json";
import Navbar from "../../components/Navbar";
import "../../style/customers/market.css";
import SOTicket from "../../components/SOTicket";

interface TicketData {
  name: string;
  place: string;
  date: string;
  ticketPrice: BigNumberish;
  ticketNumber: BigNumberish;
  tokenId: number;
}

interface TicketProps extends TicketData {
  tokenId: number;
}

const ownerAddress = process.env.REACT_APP_OWNER_WALLET;
const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
const signer = new ethers.Wallet(privateKey, provider);
const contractAddress = "0x49c8f1D45B501cF549175D3c5E060b9a7bBED546";
const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

async function transferTicket(
  tokenId: number,
  to: string,
  feePercentage: number
) {
  const cust_secret_key = sessionStorage.getItem("cust_secret_key")!;
  const customerAddress = new ethers.Wallet(cust_secret_key, provider);
  const ticketData = await contract.getTicketData(tokenId);
  const ticketPrice = ticketData[3]._hex;
  const ticketPriceInWei = ethers.BigNumber.from(ticketPrice);
  console.log(ticketPriceInWei);
  const value = ticketPriceInWei;
  const paymentTransaction = await customerAddress.sendTransaction({
    to: ownerAddress,
    value: value,
  });
  await paymentTransaction.wait();
  const transaction = await contract.transferTicket(
    tokenId,
    to,
    feePercentage,
    {
      value: value,
    }
  );

  console.log(transaction.hash);
  const receipt = await transaction.wait();
  console.log(receipt);
}

function TicketForSale({
  name,
  place,
  date,
  ticketPrice,
  ticketNumber,
  tokenId,
}: TicketProps) {
  const [purchased, setPurchased] = useState(false);
  const cust_wallet_address = sessionStorage.getItem("cust_wallet_address")!;

  return (
    <div className="ticket">
      <h3>{name}</h3>
      <p>Place: {place}</p>
      <p>Date: {date}</p>
      <p>Ticket Price: {ethers.utils.formatEther(ticketPrice)} ETH</p>
      <p>Ticket Number: {ticketNumber.toString()}</p>
      {!purchased && (
        <button onClick={() => transferTicket(tokenId, cust_wallet_address, 2)}>
          Purchase
        </button>
      )}
    </div>
  );
}

function Market() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [soldoutTickets, setSoldOutTickets] = useState<TicketData[]>([]);

  useEffect(() => {
    async function getCollections() {
      const collectionCount = await contract.getCollectionCounter();
      let tickets: TicketData[] = [];
      let soldOutTickets: TicketData[] = [];

      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        for (let j = 0; j < collection.ticketCount; j++) {
          const tokenId = collection.tokenIds[j];
          const ticketData = await contract.getTicketData(tokenId);
          const ticket: TicketData = {
            name: ticketData[0],
            place: ticketData[1],
            date: ticketData[2],
            ticketPrice: ticketData[3],
            ticketNumber: ticketData[4],
            tokenId: tokenId,
          };
          if (ticketData.isSold === false) {
            tickets.push(ticket);
            console.log(tickets);
          } else {
            soldOutTickets.push(ticket);
          }
        }
      }
      setTickets(tickets);
      setSoldOutTickets(soldOutTickets);
    }
    getCollections();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="market">
        {soldoutTickets.map((ticket) => (
          <SOTicket
            name={ticket.name}
            place={ticket.place}
            date={ticket.date}
            ticketPrice={ticket.ticketPrice}
            ticketNumber={ticket.ticketNumber}
            tokenId={ticket.tokenId}
          />
        ))}
        {tickets.map((ticket) => (
          <TicketForSale
            name={ticket.name}
            place={ticket.place}
            date={ticket.date}
            ticketPrice={ticket.ticketPrice}
            ticketNumber={ticket.ticketNumber}
            tokenId={ticket.tokenId}
          />
        ))}
      </div>
    </div>
  );
}

export default Market;
