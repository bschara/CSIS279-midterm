import { useState } from "react";
import { ethers, BigNumberish } from "ethers";
import Cookies from "js-cookie";

interface TicketProps {
  name: string;
  place: string;
  date: string;
  ticketPrice: BigNumberish;
  ticketNumber: BigNumberish;
  tokenId: number;
}

function SOTicket({
  name,
  place,
  date,
  ticketPrice,
  ticketNumber,
  tokenId,
}: TicketProps) {
  const [purchased, setPurchased] = useState(false);

  return (
    <div className="ticket">
      <h3>{name}</h3>
      <p>Place: {place}</p>
      <p>Date: {date}</p>
      <p>Ticket Price: {ethers.utils.formatEther(ticketPrice)} ETH</p>
      <p>Ticket Number: {ticketNumber.toString()}</p>
      {!purchased && <label>Sold Out </label>}
    </div>
  );
}

export default SOTicket;
