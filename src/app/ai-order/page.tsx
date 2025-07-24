import { Header } from '@/components/Header';
import { AIOrderForm } from '@/components/AIOrderForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function AIOrderPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Bot className="h-8 w-8 text-primary"/>
            </div>
            <CardTitle className="text-3xl font-bold font-headline mt-4">AI-Powered Ordering</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Simply type your order below, like "I need a 12kg propane refill at 123 Main St", and our AI will handle the rest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIOrderForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
