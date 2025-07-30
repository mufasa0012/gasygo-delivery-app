'use server';

import { interpretCustomerOrder } from '@/ai/flows/interpret-customer-order';
import { getBusinessAdvice } from '@/ai/flows/get-business-advice';

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

interface AdviceFormState {
  advice: string;
  error?: string;
}

export async function getAdviceAction(
  prevState: AdviceFormState,
  formData: FormData
): Promise<AdviceFormState> {
    const topic = formData.get('topic') as string;

    if (!topic) {
        return { ...prevState, error: 'A topic is required.' };
    }

    try {
        const result = await getBusinessAdvice({ topic });
        return {
            advice: result.advice,
        };
    } catch (e) {
        console.error(e);
        return {
            ...prevState,
            error: 'Failed to get advice from AI. Please try again.',
        };
    }
}
