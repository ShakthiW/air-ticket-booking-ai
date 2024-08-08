import React from "react";

interface FlightDetailsProps {
  index: number;
  flight: {
    id: number;
    flight_number: string;
    departure_city: string;
    arrival_city: string;
    departure_time: string;
    arrival_time: string;
  };
}

export const FlightDetails = ({ index, flight }: FlightDetailsProps) => {
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        <div className="bg-blue-500 text-white text-center p-4">
          <h2 className="text-xl font-semibold">Flight {flight.id}</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Flight ID:</span>
            <span className="text-lg">{flight.flight_number}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Departure:</span>
            <span className="text-lg">{flight.departure_city}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Arrival:</span>
            <span className="text-lg">{flight.arrival_city}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Departure Time:</span>
            <span className="text-lg">
              {new Date(flight.departure_time).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Arrival Time:</span>
            <span className="text-lg">
              {new Date(flight.arrival_time).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
