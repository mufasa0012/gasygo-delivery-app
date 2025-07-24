'use server';

import { interpretCustomerOrder } from '@/ai/flows/interpret-customer-order';

interface FormState {
  gasProduct: string;
  deliveryAddress: string;
  confirmationMessage: string;
  error?: string;
}

export async function interpretOrderAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const message = formData.get('message') as string;

  if (!message || message.trim().length < 10) {
    return {
      ...prevState,
      error: 'Please provide a more detailed order message.',
    };
  }

  try {
    const result = await interpretCustomerOrder({ message });
    return {
      gasProduct: result.gasProduct,
      deliveryAddress: result.deliveryAddress,
      confirmationMessage: result.confirmationMessage,
    };
  } catch (e) {
    console.error(e);
    return {
      ...prevState,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
