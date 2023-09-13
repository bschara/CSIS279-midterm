import React, { useState } from "react";
import "../../style/organizers/createTicket.css";
import OrgNavbar from "../../components/orgNavbar";
import { ethers } from "ethers";
import MyToken from "../../assets/MyToken.json";

interface EventData {
  name: string;
  date: string;
  location: string;
  ticketPrice: string;
  ticketQuantity: number;
}

interface Props {
  onSubmit: (eventData: EventData) => void;
}

function CreateEvent(props: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [ticketPrice, setTicketPrice] = useState("0.00");
  const [ticketQuantity, setTicketQuantity] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const eventData: EventData = {
      name,
      date,
      location,
      ticketPrice,
      ticketQuantity,
    };
    props.onSubmit(eventData);

    // Connect to the contract using the provider
    const providerUrl = process.env.REACT_APP_ALCHEMY_SEPOLIA_KEY;
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const privateKey = process.env.REACT_APP_ALCHEMY_SECRET_KEY!;
    const signer = new ethers.Wallet(privateKey, provider);
    const contractAddress = "0x6EC1d183b8E674f5A08ed5fFfC9530629bD83f89";
    const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);
    const organizerAddress = sessionStorage.getItem("org_wallet_address");
    console.log(organizerAddress);

    // Call the createCollection function with the input values
    const priceInWei = ethers.utils.parseEther(ticketPrice);
    await contract.createCollection(
      name,
      location,
      date,
      priceInWei,
      ticketQuantity,
      organizerAddress
    );
  };

  return (
    <div>
      <OrgNavbar />
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label>
          Ticket Price:
          <input
            type="text"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
          />
        </label>
        <label>
          Ticket Quantity:
          <input
            type="number"
            value={ticketQuantity}
            onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
          />
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
