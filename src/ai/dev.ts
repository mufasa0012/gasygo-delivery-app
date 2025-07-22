import { config } from 'dotenv';
config();

import '@/ai/flows/delivery-eta.ts';
import '@/ai/flows/order-intent.ts';
import '@/ai/flows/notify-admin.ts';
