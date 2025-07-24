export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'cylinder' | 'accessory';
  hint: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: '12kg Propane Cylinder',
    price: 55.0,
    description: 'Standard 12kg propane cylinder, perfect for residential cooking and heating.',
    image: 'https://placehold.co/600x600',
    category: 'cylinder',
    hint: 'gas cylinder'
  },
  {
    id: 2,
    name: '5kg Butane Cylinder',
    price: 25.0,
    description: 'Compact 5kg butane cylinder, ideal for portable stoves and outdoor use.',
    image: 'https://placehold.co/600x600',
    category: 'cylinder',
    hint: 'gas cylinder'
  },
  {
    id: 3,
    name: '47kg Propane Cylinder',
    price: 150.0,
    description: 'Large capacity 47kg propane cylinder for commercial kitchens and heavy usage.',
    image: 'https://placehold.co/600x600',
    category: 'cylinder',
    hint: 'gas cylinder'
  },
  {
    id: 4,
    name: 'Patio Gas Cylinder',
    price: 45.0,
    description: 'Specially designed for patio heaters and barbecues, ensuring a clean burn.',
    image: 'https://placehold.co/600x600',
    category: 'cylinder',
    hint: 'patio heater'
  },
  {
    id: 5,
    name: 'High-Pressure Regulator',
    price: 15.0,
    description: 'Durable high-pressure regulator for secure and efficient gas flow.',
    image: 'https://placehold.co/600x600',
    category: 'accessory',
    hint: 'gas regulator'
  },
  {
    id: 6,
    name: 'Gas Hose (2m)',
    price: 10.0,
    description: '2-meter reinforced gas hose, compliant with safety standards.',
    image: 'https://placehold.co/600x600',
    category: 'accessory',
    hint: 'gas hose'
  },
  {
    id: 7,
    name: 'Leak Detector Spray',
    price: 8.0,
    description: 'Essential for safety checks, quickly identifies gas leaks.',
    image: 'https://placehold.co/600x600',
    category: 'accessory',
    hint: 'safety equipment'
  },
  {
    id: 8,
    name: 'Cylinder Spanner',
    price: 5.0,
    description: 'A handy tool for securely connecting and disconnecting your gas cylinder.',
    image: 'https://placehold.co/600x600',
    category: 'accessory',
    hint: 'tool'
  },
];
