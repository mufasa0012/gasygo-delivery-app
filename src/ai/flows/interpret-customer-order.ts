// src/ai/flows/interpret-customer-order.ts
'use server';

/**
 * @fileOverview Interprets customer order messages and extracts relevant information.
 *
 * - interpretCustomerOrder - A function that interprets the customer order message and extracts the gas product and delivery address.
 * - InterpretCustomerOrderInput - The input type for the interpretCustomerOrder function.
 * - InterpretCustomerOrderOutput - The return type for the interpretCustomerOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretCustomerOrderInputSchema = z.object({
  message: z.string().describe('The customer order message including the gas product and delivery address.'),
});
export type InterpretCustomerOrderInput = z.infer<typeof InterpretCustomerOrderInputSchema>;

const InterpretCustomerOrderOutputSchema = z.object({
  gasProduct: z.string().describe('The gas product requested by the customer.'),
  deliveryAddress: z.string().describe('The delivery address provided by the customer.'),
  confirmationMessage: z.string().describe('A confirmation message with the order details'),
});
export type InterpretCustomerOrderOutput = z.infer<typeof InterpretCustomerOrderOutputSchema>;

export async function interpretCustomerOrder(input: InterpretCustomerOrderInput): Promise<InterpretCustomerOrderOutput> {
  return interpretCustomerOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretCustomerOrderPrompt',
  input: {schema: InterpretCustomerOrderInputSchema},
  output: {schema: InterpretCustomerOrderOutputSchema},
  prompt: `You are an AI assistant that interprets customer order messages for gas products and extracts the product and delivery address.

  Message: {{{message}}}
  
  Based on the message, extract the gas product and delivery address. Generate a confirmation message with the extracted information.
  If a delivery address is not provided ask for it in the confirmation message.
  If a gas product is not provided ask for it in the confirmation message.
  Respond in a professional, polite tone, as a customer service agent.
  Make sure the gasProduct and deliveryAddress are valid and non empty strings.
  The confirmationMessage should contain the gasProduct and deliveryAddress if present, and ask for it otherwise.
  `, 
});

const interpretCustomerOrderFlow = ai.defineFlow(
  {
    name: 'interpretCustomerOrderFlow',
    inputSchema: InterpretCustomerOrderInputSchema,
    outputSchema: InterpretCustomerOrderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
