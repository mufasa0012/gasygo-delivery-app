import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
    </div>
  );
}
