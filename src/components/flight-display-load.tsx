"use client"

import React, { useState } from "react";
import { FlightDetails } from "./flight-details";
import { Button } from "./ui/button";

interface Flight {
  id: number;
  destination: string;
  departureTime: string;
}

type FlightData = Flight[];

export const FlightDisplayLoad = ({flightData}: {flightData: FlightData}) => {
  const [currentIndex, setCurrentIndex] = useState(5);

  const handleLoadMore = () => {
    setCurrentIndex(currentIndex + 5);
  };
  return (
    <>
      {flightData.slice(0, currentIndex).map((flight: any, index: any) => (
        <div key={index} className="mb-4">
          <FlightDetails index={index} flight={flight} />
        </div>
      ))}
      {currentIndex < flightData.length && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
    </>
  );
};
