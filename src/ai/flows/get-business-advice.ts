// src/ai/flows/get-business-advice.ts
'use server';

/**
 * @fileOverview Generates business advice for the GasyGo admin.
 *
 * - getBusinessAdvice - A function that generates a short, actionable business tip.
 * - GetBusinessAdviceInput - The input type for the getBusinessAdvice function.
 * - GetBusinessAdviceOutput - The return type for the getBusinessAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetBusinessAdviceInputSchema = z.object({
  topic: z.string().describe('The business topic for which advice is needed. e.g., "Business Growth", "Customer Retention"'),
});
export type GetBusinessAdviceInput = z.infer<typeof GetBusinessAdviceInputSchema>;

const GetBusinessAdviceOutputSchema = z.object({
  advice: z.string().describe('A short, actionable piece of advice.'),
});
export type GetBusinessAdviceOutput = z.infer<typeof GetBusinessAdviceOutputSchema>;

export async function getBusinessAdvice(input: GetBusinessAdviceInput): Promise<GetBusinessAdviceOutput> {
  return getBusinessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getBusinessAdvicePrompt',
  input: {schema: GetBusinessAdviceInputSchema},
  output: {schema: GetBusinessAdviceOutputSchema},
  prompt: `You are an expert business coach for a gas delivery startup called GasyGo.

Topic: {{{topic}}}

Provide one short, actionable piece of advice for the user on the given topic. The advice should be highly relevant to a small but growing gas delivery business in Nairobi. Keep it concise and practical.
  `,
});

const getBusinessAdviceFlow = ai.defineFlow(
  {
    name: 'getBusinessAdviceFlow',
    inputSchema: GetBusinessAdviceInputSchema,
    outputSchema: GetBusinessAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
