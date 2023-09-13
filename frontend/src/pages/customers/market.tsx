import React, { useState, useEffect } from "react";
import { ethers, BigNumberish } from "ethers";
import MyToken from "../../assets/MyToken.json";
import Navbar from "../../components/Navbar";
import "../../style/customers/market.css";
import SOTicket from "../../components/SOTicket";

interface Collection {
  name: string;
  tokenIds: number[];
  ticketSold: number;
  ticketCount: number;
}

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
const contractAddress = "0x6EC1d183b8E674f5A08ed5fFfC9530629bD83f89";
const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

//function to transfer ticket
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [soldOutCollections, setSoldOutCollections] = useState<Collection[]>(
    []
  );
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [soldoutTickets, setSoldOutTickets] = useState<TicketData[]>([]);

  useEffect(() => {
    async function getCollections() {
      const collectionCount = await contract.getCollectionCounter();

      let collections: Collection[] = [];
      let tickets: TicketData[] = [];
      let soldOutCollections: Collection[] = [];
      let soldOutTickets: TicketData[] = [];
      for (let i = 0; i < collectionCount; i++) {
        const collection = await contract.getCollection(i);
        console.log(collection.ticketCount);
        console.log(
          "ticket count " +
            collection.ticketCount +
            "ticket sold " +
            collection.ticketSold
        );
        const tokenId = collection.tokenIds[0];
        const ticketData = await contract.getTicketData(tokenId);
        const ticket: TicketData = {
          name: ticketData[0],
          place: ticketData[1],
          date: ticketData[2],
          ticketPrice: ticketData[3],
          ticketNumber: ticketData[4],
          tokenId: tokenId,
        };
        if (
          parseInt(collection.ticketSold) >= parseInt(collection.ticketCount)
        ) {
          soldOutCollections.push({
            name: collection.name,
            tokenIds: [tokenId],
            ticketSold: collection.ticketSold,
            ticketCount: collection.ticketCount,
          });
          soldOutTickets.push(ticket);
        } else {
          collections.push({
            name: collection.name,
            tokenIds: [tokenId],
            ticketSold: collection.ticketSold,
            ticketCount: collection.ticketCount,
          });
          tickets.push(ticket);
        }
      }
      setCollections(collections);
      setTickets(tickets);
      setSoldOutCollections(soldOutCollections);
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
