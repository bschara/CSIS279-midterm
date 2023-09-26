import { ethers } from "ethers";
import "../style/components/ticket.css";

type TicketProps = {
  name: string;
  place: string;
  date: string;
  ticketPrice: number;
  ticketNumber: ethers.BigNumber;
};

function DisplayTicket({
  name,
  place,
  date,
  ticketPrice,
  ticketNumber,
}: TicketProps) {
  return (
    <div className="ticket">
      <h3>{name}</h3>
      <p>Place: {place}</p>
      <p>Date: {date}</p>
      <p>Ticket Price: {ticketPrice} ETH</p>
      <p>Ticket Number: {ticketNumber.toString()}</p>
    </div>
  );
}

export default DisplayTicket;
