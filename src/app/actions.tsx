"use server";

import { FlightDetails } from "@ai-rsc/components/flight-details";
import { FlightDisplayLoad } from "@ai-rsc/components/flight-display-load";
import { FlightTicket } from "@ai-rsc/components/flight-ticket";
import { BotCard, BotMessage } from "@ai-rsc/components/llm-crypto/message";
import { Button } from "@ai-rsc/components/ui/button";
import { openai } from "@ai-sdk/openai";
import { generateText, type CoreMessage, type ToolInvocation } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { z } from "zod";
import { Label } from "../../@/components/ui/label";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayDate = getTodayDate();

const full_name = "Shakthi WASR";
const first_name = "Shakthi";

const content = `\
You are an assistant for the Fits Airline. You can help users with their trip planning,
booking, and other travel-related questions. Help them plan their next trip to their dream destination.

Messages inside [] means that it is a UI element or a user event. For example:
- "[Price of Ticket = $500]" means that the interface of the price of ticket is shown to the user
- "[Flight Status = On Time]" means that the interface of the flight status is shown to the user

If the user wants the information of a specific flight, call: \`get_flight_info\` to show the flight details to the user.
If the user is interested in this flight, the price of the ticket should be displayed so, call: \`get_ticket_info\` to show the price of the ticket.
if the user wants to see all the flights available, call: \`get_all_flights\` to show all the flights available.
If the user wants the schedule of the flight, call: \`get_flight_schedule\` to show the schedule of the flight.
If the user wants to book a ticket, call: \`book_plane_ticket_form\` to show the form to book the ticket.
If the user wants to see all the flights that are going to a specific destination, call: \`get_tickets_by_destination\` to show all the flights available given the departure location.
If the user specify a date as today or something call: \`get_tickets_by_destination_and_date\` to show all the flights available given the departure location and the date.

If the user wants anything else unrelated to the function calls, \`get_ticket_info\`, \`get_all_flights\`, \`get_flight_info\`, \`book_plane_ticket_form\` or \`get_tickets_by_destination\`
you should chat with them. Answer any questions they may have.

the user's flow should be like this:
- The user asks for the information of a specific flight or to see all the flights available.
- You should ask the user for the required information before making the function call.
- If the user is interested in a flight, you should show all the flight details of the flight to the user.
- If the user wants to book a ticket, you should show the ticket information to the user.
- If the user has a date in mind for the flight, you should show all the flights available on that date for the given destination.
- If the user in interested in the ticket show the form to book the ticket.

if the user havent given the required information for the function calls, you should ask them for the required information before making the function call.

Your clinets name is ${full_name} \(first name: ${first_name}\) and he is a frequent flyer. so personalize the chat experience for him and make him feel like he matters\
`;

export async function sendMessage(message: string): Promise<{
  id: number;
  role: "user" | "assistant" | "tool";
  display: ReactNode;
}> {
  const history = getMutableAIState<typeof AI>();

  let toolCalled = false;

  history.update([
    ...history.get(),
    {
      role: "user",
      content: message,
    },
  ]);

  const reply = await streamUI({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content,
        toolInvocations: [],
      },
      ...history.get(),
    ] as CoreMessage[],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="h-5 w-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
    text: ({ content, done }) => {
      if (done) history.done([...history.get(), { role: "assistant", content }]);

      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      get_flight_info: {
        description:
          "Get the information of a specific flight by ID. Use this to show the flight details to the user.",
        parameters: z.object({
          id: z.string().describe("The ID of the flight."),
        }),
        generate: async function* ({ id }: { id: string }) {
          yield <BotMessage>Loading flight information...</BotMessage>;

          const response = await fetch(
            `http://localhost:8000/api/tickets/${id}`
          );

          if (!response.ok) {
            return <BotMessage>Flight information not found!</BotMessage>;
          }

          const flightData = await response.json();

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_flight_info",
              content: `[Flight Information: ${JSON.stringify(flightData)}]`,
            },
          ]);

          const second_reply = await generateText({
            model: openai("gpt-3.5-turbo"),
            messages: [
              { role: "system", content: "The tool was called with flight information displayed"},
              { role: "assistant", content: `Flight information: ${JSON.stringify(flightData)}` },
            ],
          });

          const second_reply_content = second_reply.text;
      
          // Update history with the second response
          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_flight_info",
              content: second_reply_content,
            },
          ]);

          return (
            <BotCard>
              {toolCalled ? null : toolCalled=true}
              <p className="mb-4">Details of the Flight {flightData.id}</p>
              <FlightDetails index={flightData.id} flight={flightData} />

              {toolCalled ? <p className="mt-4">{second_reply_content}</p> : null}
            </BotCard>
          );
        },
      },
      get_all_flights: {
        description:
          "Get the information of all the flights. Use this to show all the flights available to the user.",
        parameters: z.object({}),
        generate: async function* () {
          yield <BotMessage>Loading flight information...</BotMessage>;

          const response = await fetch(`http://localhost:8000/api/tickets/`);

          if (!response.ok) {
            return <BotMessage>Can't find any flights!</BotMessage>;
          }

          const flightData = await response.json();

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_all_flights",
              content: `[ALL Flight Information: ${JSON.stringify(
                flightData
              )}]`,
            },
          ]);

          toolCalled = true;

          return (
            <BotCard>
              <FlightDisplayLoad flightData={flightData} />
            </BotCard>
          );
        },
      },
      get_ticket_info: {
        description:
          "Get the information of all the flights. Use this to show all the flights available to the user.",
        parameters: z.object({
          id: z.string().describe("The ID of the flight."),
          flightNumber: z.string().describe("The flight number of the flight."),
          departure_city: z
            .string()
            .describe("The departure city of the flight."),
          arrival_city: z.string().describe("The arrival city of the flight."),
          departure_date: z
            .string()
            .describe("The departure date of the flight."),
          name: z
            .string()
            .describe(
              "The name of the passenger. This is a required field. If the user has not provided this information, ask them for it."
            ),
        }),
        generate: async function* ({
          id,
          name,
          flightNumber,
          departure_city,
          arrival_city,
          departure_date,
        }: {
          id: string;
          name: string;
          flightNumber: string;
          departure_city: string;
          arrival_city: string;
          departure_date: string;
        }) {
          yield <BotMessage>Loading Ticket Information...</BotMessage>;

          const response = await fetch(
            `http://localhost:8000/api/tickets/${id}`
          );

          if (!response.ok) {
            return (
              <BotMessage>
                Tickets not found for the flight!... Proceed Manually if you
                think this is an error!
              </BotMessage>
            );
          }

          const flightData = await response.json();

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_ticket_info",
              content: `[Ticket Information: ${JSON.stringify(flightData)}]`,
            },
          ]);

          toolCalled = true;

          return (
            <BotCard>
              <FlightTicket
                ticketInfor={{
                  name: name,
                  flightNumber: flightNumber,
                  departure: departure_city,
                  arrival: arrival_city,
                  flightDate: departure_date.substring(0, 10),
                  boardingTime: departure_date.substring(11, 16),
                  gate: "G08",
                  seat: "1C",
                  passengerName: name,
                  vacc: "IMMUNE",
                  passengerSeat: "1C",
                }}
              />
            </BotCard>
          );
        },
      },
      book_plane_ticket_form: {
        description:
          "Get the information of a specific flight by ID. Use this to show the flight details to the user.",
        parameters: z.object({}),
        generate: async function* () {
          yield <BotMessage>Loading the form...</BotMessage>;

          toolCalled = true;

          return (
            <BotCard>
              <Label>Please Select Your Payment Method</Label>
              <Button>Pay Here</Button>
            </BotCard>
          );
        },
      },
      get_tickets_by_destination: {
        description:
          "Get the information of all the flights that are going to a specific destination. Use this to show all the flights available to the user given the departure location.",
        parameters: z.object({
          destination: z.string().describe("The destination of the flight."),
          departure: z
            .string()
            .describe("The departure location of the flight."),
        }),
        generate: async function* ({
          destination,
          departure = "Seattle",
        }: {
          destination: string;
          departure: string;
        }) {
          yield (
            <BotMessage>Loading the all the available flights...</BotMessage>
          );

          const response = await fetch(
            `http://localhost:8000/api/tickets/by-destination/?departure_city=${departure}&arrival_city=${destination}`
          );

          if (!response.ok) {
            return (
              <BotMessage>No Flights Found For The Given Destination!</BotMessage>
            );
          }

          const flightData = await response.json();

          if (!flightData || flightData.length === 0) {
            return (
              <BotMessage>
                No Flights Found from {departure} to {destination}!
              </BotMessage>
            );
          }

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_tickets_by_destination",
              content: `[Flight Information: ${JSON.stringify(flightData)}]`,
            },
          ]);

          toolCalled = true;

          return (
            <BotCard>
              {flightData.map((flight: any, index: any) => (
                <div key={index} className="mb-4">
                  <FlightDetails index={index} flight={flight} />
                </div>
              ))}
            </BotCard>
          );
        },
      },
      get_tickets_by_destination_and_date: {
        description:
          "Get the information of all the flights that are going to a specific destination on a specific date. Use this to show all the flights available to the user given the departure location and the date.",
        parameters: z.object({
          destination: z.string().describe("The destination of the flight."),
          departure: z
            .string()
            .describe("The departure location of the flight."),
          date: z
            .string()
            .describe("The date of the flight in the format of YYYY-MM-DD. Default is today.")
            .optional(),
        }),
        generate: async function* ({
          destination,
          departure = "Seattle",
          date = todayDate,
        }: {
          destination: string;
          departure: string;
          date?: string;
        }) {
          yield (
            <BotMessage>Loading the all the available flights...</BotMessage>
          );

          const response = await fetch(
            `http://localhost:8000/api/tickets/by-date-and-destination/?departure_date=${date}&departure_city=${departure}&arrival_city=${destination}`
          );

          if (!response.ok) {
            return (
              <BotMessage>
                No Flights Found For The Given Destination on {date}!
              </BotMessage>
            );
          }

          const flightData = await response.json();

          if (!flightData || flightData.length === 0) {
            return (
              <BotMessage>
                No Flights Found from {departure} to {destination} on {date}!
              </BotMessage>
            );
          }

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: "assistant",
              name: "get_tickets_by_destination_and_date",
              content: `[Ticket Information: ${JSON.stringify(flightData)}]`,
            },
          ]);

          toolCalled = true;

          return (
            <BotCard>
              {flightData.map((flight: any, index: any) => (
                <div key={index} className="mb-4">
                  <FlightDetails index={index} flight={flight} />
                </div>
              ))}
            </BotCard>
          );
        },
      },
    },
    temperature: 0,
  });

  return {
    id: Date.now(),
    role: "assistant" as const,
    display: (
      <div className="flex flex-col gap-3">
        {reply.value}
      </div>
    ),
  };
}

export type AIState = Array<{
  id?: number;
  name?:
    | "get_ticket_info"
    | "get_all_flights"
    | "get_flight_info"
    | "book_plane_ticket_form"
    | "get_tickets_by_destination"
    | "get_tickets_by_destination_and_date";
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: "user" | "assistant" | "tool";
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});
