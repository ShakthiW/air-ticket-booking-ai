import Image from "next/image";
import React from "react";

interface FlightTicketProps {
  ticketInfor: {
    name: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    flightDate: string;
    boardingTime: string;
    gate: string;
    seat: string;
    passengerName: string;
    vacc: string;
    passengerSeat: string;
  };
}

export const FlightTicket = ({ ticketInfor }: FlightTicketProps) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 w-full max-w-3xl mx-auto">
      <div className="bg-blue-200 text-[#0B2567] p-4 flex justify-between items-center">
        <div className="flex gap-3 justify-center items-center">
          <Image
            src={"/assets/fits_logo.png"}
            width={50}
            height={50}
            alt="Fits Air"
          />
          <h2 className="text-xl font-semibold">Fits Air</h2>
        </div>
        <p className="text-md font-medium">Boarding Pass</p>
      </div>

      <div className="w-[2px] h-full absolute top-0 border-r-2 border-dotted border-black right-[25%]"></div>

      <div className="p-4 text-black">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-start items-center gap-5">
            <div className="bg-gray-200 h-[200px] w-20 flex items-center justify-center">
              <p className="text-gray-500">[Barcode]</p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold uppercase">
                {ticketInfor.name}
              </h3>
              <p className="text-base">
                <span className="font-medium">Flight Number:</span>{" "}
                {ticketInfor.flightNumber}
              </p>
              <p className="text-base">
                <span className="font-medium">DEP - ARR:</span>{" "}
                {ticketInfor.departure} - {ticketInfor.arrival}
              </p>
              <p className="text-base">
                <span className="font-medium">FLIGHT DATE:</span>{" "}
                {ticketInfor.flightDate}
              </p>
              <p className="text-base">
                <span className="font-medium">BOARDING TIME:</span>{" "}
                {ticketInfor.boardingTime}
              </p>
              <div className="flex justify-between mr-3 items-center">
                <p className="text-base">
                  <span className="font-medium">GATE:</span> {ticketInfor.gate}
                </p>
                <p className="text-base">
                  <span className="font-medium">SEAT:</span> {ticketInfor.seat}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center flex flex-col">
              <p className="text-base font-medium uppercase">
                {ticketInfor.name.length > 6
                  ? ticketInfor.name.substring(0, 6)
                  : ticketInfor.name}
                {ticketInfor.name.length > 6 ? "..." : ""}
              </p>
              <p className="text-base">
                <span className="font-medium">VACC:</span> {ticketInfor.vacc}
              </p>
              <p className="text-base">
                <span className="font-medium">SEAT:</span>{" "}
                {ticketInfor.passengerSeat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
