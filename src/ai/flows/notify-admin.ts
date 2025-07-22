'use server';
/**
 * @fileOverview A Genkit flow and tool for notifying an administrator about a completed order.
 *
 * - notifyAdminOnDelivery - A function that generates a notification message and "sends" it.
 * - NotifyAdminInput - The input type for the notifyAdminOnDelivery function.
 * - NotifyAdminOutput - The return type for the notifyAdminOnDelivery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NotifyAdminInputSchema = z.object({
  orderId: z.string().describe('The ID of the order that has been delivered.'),
});
export type NotifyAdminInput = z.infer<typeof NotifyAdminInputSchema>;

const NotifyAdminOutputSchema = z.object({
  message: z.string().describe('The notification message that was sent to the admin.'),
});
export type NotifyAdminOutput = z.infer<typeof NotifyAdminOutputSchema>;

// This tool simulates sending an SMS. In a real application, this would
// integrate with a service like Twilio. For now, it just logs to the console.
const sendAdminNotification = ai.defineTool(
  {
    name: 'sendAdminNotification',
    description: 'Sends a notification message to the administrator.',
    inputSchema: z.object({
      message: z.string().describe('The content of the notification message.'),
    }),
    outputSchema: z.void(),
  },
  async (input) => {
    console.log(`[Admin Notification Sent]: ${input.message}`);
    // In a real app, you would add your SMS sending logic here.
    // e.g., await twilio.messages.create({ body: input.message, from: '...', to: '...' });
  }
);


export async function notifyAdminOnDelivery(input: NotifyAdminInput): Promise<NotifyAdminOutput> {
  return notifyAdminFlow(input);
}

const prompt = ai.definePrompt({
  name: 'notifyAdminPrompt',
  input: { schema: NotifyAdminInputSchema },
  tools: [sendAdminNotification],
  prompt: `The order with ID {{{orderId}}} has just been successfully delivered and confirmed by the customer.
  
  Generate a brief, friendly notification message for the admin.
  
  Then, use the sendAdminNotification tool to send this message.`,
});

const notifyAdminFlow = ai.defineFlow(
  {
    name: 'notifyAdminFlow',
    inputSchema: NotifyAdminInputSchema,
    outputSchema: NotifyAdminOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const notificationMessage = response.choices[0].message.toolCalls?.[0]?.args.message || `Order ${input.orderId} delivered.`;
    
    return { message: notificationMessage };
  }
);
