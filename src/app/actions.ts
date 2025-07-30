'use server';

import { getBusinessAdvice } from '@/ai/flows/get-business-advice';

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
