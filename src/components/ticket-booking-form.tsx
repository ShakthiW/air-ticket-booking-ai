// import React from "react";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { Input } from "../../@/components/ui/input";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// const formScema = z.object({
//   name: z.string().nonempty(),
//   email: z.string().email(),
//   phone: z.string().nonempty(),
//   airline: z.string().nonempty(),
//   noAdults: z.number().int().positive(),
//   noChildren: z.number().int().positive(),
//   noInfents: z.number().int().positive(),
//   seatNo: z.string().nonempty(),
//   baggage: z.string().nonempty(),
//   terms: z.boolean(),
// })

// export const TicketBookingForm = () => {
//   const form = useForm<z.infer<typeof formScema>>({
//     resolver: zodResolver(formScema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       airline: "",
//       noAdults: 0,
//       noChildren: 0,
//       noInfents: 0,
//       seatNo: "",
//       baggage: "",
//       terms: false,
//     }
//   })

//   const handleSubmit = (data: z.infer<typeof formScema>) => {
//     console.log(data);
//   }

//   return (
//     // <div>
//     //   <Form {...form}>
//     //     <form onSubmit={form.handleSubmit(handleSubmit)}>
//     //       <FormField control={form.control} name=""/>
//     //     </form>
//     //   </Form>
//     // </div>
//   );
// };
