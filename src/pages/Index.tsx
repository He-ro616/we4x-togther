import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { RecentPosts } from '@/components/home/RecentPosts';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedEvents />
      <RecentPosts />
      <CTASection />
    </Layout>
  );
};

export default Index;
