'use server';

/**
 * @fileOverview Estimates the delivery time for an order using GenAI, considering traffic and driver availability.
 *
 * - estimateDeliveryTime - A function that estimates the delivery time.
 * - EstimateDeliveryTimeInput - The input type for the estimateDeliveryTime function.
 * - EstimateDeliveryTimeOutput - The return type for the estimateDeliveryTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateDeliveryTimeInputSchema = z.object({
  orderId: z.string().describe('The ID of the order.'),
  customerAddress: z.string().describe('The delivery address of the customer.'),
  deliveryDriverAvailability: z.string().describe('Availability of delivery drivers.'),
  currentTrafficConditions: z.string().describe('Current traffic conditions.'),
});

export type EstimateDeliveryTimeInput = z.infer<typeof EstimateDeliveryTimeInputSchema>;

const EstimateDeliveryTimeOutputSchema = z.object({
  estimatedDeliveryTime: z.string().describe('The estimated delivery time for the order.'),
});

export type EstimateDeliveryTimeOutput = z.infer<typeof EstimateDeliveryTimeOutputSchema>;

export async function estimateDeliveryTime(input: EstimateDeliveryTimeInput): Promise<EstimateDeliveryTimeOutput> {
  return estimateDeliveryTimeFlow(input);
}

const estimateDeliveryTimePrompt = ai.definePrompt({
  name: 'estimateDeliveryTimePrompt',
  input: {schema: EstimateDeliveryTimeInputSchema},
  output: {schema: EstimateDeliveryTimeOutputSchema},
  prompt: `You are an expert delivery time estimator.

  Given the following information, estimate the delivery time for the order.

  Order ID: {{{orderId}}}
  Customer Address: {{{customerAddress}}}
  Delivery Driver Availability: {{{deliveryDriverAvailability}}}
  Current Traffic Conditions: {{{currentTrafficConditions}}}

  Provide the estimated delivery time in minutes.
  `,
});

const estimateDeliveryTimeFlow = ai.defineFlow(
  {
    name: 'estimateDeliveryTimeFlow',
    inputSchema: EstimateDeliveryTimeInputSchema,
    outputSchema: EstimateDeliveryTimeOutputSchema,
  },
  async input => {
    const {output} = await estimateDeliveryTimePrompt(input);
    return output!;
  }
);
