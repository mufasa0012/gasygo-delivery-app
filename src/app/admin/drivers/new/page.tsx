
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewDriverPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Add New Driver</h1>
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Enter the details for the new driver.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g., John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="e.g., +254712345678" />
            </div>
            <Button className="w-full">Add Driver</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
