import React from "react";
import { intersection } from "zod";

interface TicketInformationProps {
    index: number;
    ticket: {
        flightID: string;
        price: number;
        departure_city: string;
        arrival_city: string;
        departure_time: string;
        arrival_time: string;
    };
    flightNo: string;
}

export const TicketInformation = ({index, ticket, flightNo}: TicketInformationProps) => {
  return (
    <div key={index}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        <div className="bg-blue-500 text-white text-center p-4">
          <h2 className="text-xl font-semibold">Ticket Information Flight {flightNo}</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Flight ID:</span>
            <span className="text-lg">{ticket.flightID}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Ticket Price:</span>
            <span className="text-lg">${ticket.price}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Departure City:</span>
            <span className="text-lg">{ticket.departure_city}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Arrival City:</span>
            <span className="text-lg">{ticket.arrival_city}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Departure Time:</span>
            <span className="text-lg">{new Date(ticket.departure_time).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Arrival Time:</span>
            <span className="text-lg">{new Date(ticket.arrival_time).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
