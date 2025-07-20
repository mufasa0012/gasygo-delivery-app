// This file uses server-side code.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for interpreting unstructured order entries.
 *
 * It allows customers to place orders via SMS, WhatsApp, or phone call using natural language.
 * The system uses GenAI to understand the order, extract the gas type, quantity, and delivery address, even if the message is unstructured.
 *
 * @interface OrderIntentInput - Defines the input schema for the order intent flow.
 * @interface OrderIntentOutput - Defines the output schema for the order intent flow.
 * @function interpretOrder - An async function that takes OrderIntentInput and returns a Promise of OrderIntentOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrderIntentInputSchema = z.object({
  orderText: z.string().describe('The unstructured order text from the customer.'),
});
export type OrderIntentInput = z.infer<typeof OrderIntentInputSchema>;

const OrderIntentOutputSchema = z.object({
  gasType: z.string().describe('The type of gas ordered (e.g., K-Gas, Total Gas).'),
  quantity: z.number().describe('The quantity of gas cylinders ordered.'),
  deliveryAddress: z.string().describe('The delivery address for the order.'),
});
export type OrderIntentOutput = z.infer<typeof OrderIntentOutputSchema>;

export async function interpretOrder(input: OrderIntentInput): Promise<OrderIntentOutput> {
  return orderIntentFlow(input);
}

const orderIntentPrompt = ai.definePrompt({
  name: 'orderIntentPrompt',
  input: {schema: OrderIntentInputSchema},
  output: {schema: OrderIntentOutputSchema},
  prompt: `You are an AI assistant that extracts structured information from unstructured order text for gas cylinder refills.

  Analyze the following order text and extract the gas type, quantity, and delivery address. If the delivery address is not explicitly mentioned, ask the user to provide it.

  Order Text: {{{orderText}}}

  Ensure that the gas type corresponds to one of the available gas types: K-Gas, Total Gas, Afrigas, or DrachenGas.
  The quantity should be a number.
  The delivery address should be a valid address.

  Return the extracted information in JSON format.
`,
});

const orderIntentFlow = ai.defineFlow(
  {
    name: 'orderIntentFlow',
    inputSchema: OrderIntentInputSchema,
    outputSchema: OrderIntentOutputSchema,
  },
  async input => {
    const {output} = await orderIntentPrompt(input);
    return output!;
  }
);

