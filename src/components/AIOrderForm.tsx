'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { interpretOrderAction } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, Package, MapPin, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const initialState = {
  gasProduct: '',
  deliveryAddress: '',
  confirmationMessage: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4 bg-primary hover:bg-primary/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Interpreting...
        </>
      ) : (
        'Submit Order'
      )}
    </Button>
  );
}

export function AIOrderForm() {
  const [state, formAction] = useActionState(interpretOrderAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Textarea
          name="message"
          placeholder="e.g., I need a 12kg propane cylinder delivered to 456 Oak Avenue, Springfield."
          rows={5}
          className="text-base"
          required
        />
        <SubmitButton />
      </form>

      {state?.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.confirmationMessage && !state.error && (
        <Card className="bg-background/80">
          <CardHeader>
             <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle className="text-xl font-semibold">Order Interpreted Successfully</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                    <p className="font-semibold">Gas Product</p>
                    <p className="text-muted-foreground">{state.gasProduct || 'Not specified'}</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p className="text-muted-foreground">{state.deliveryAddress || 'Not specified'}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <MessageSquareQuote className="h-5 w-5 text-muted-foreground mt-1"/>
                <div>
                    <p className="font-semibold">Confirmation Message</p>
                    <p className="text-muted-foreground italic">"{state.confirmationMessage}"</p>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
