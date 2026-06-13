import HeroSection from '../components/sections/HeroSection';
import MarketplaceSection from '../components/sections/MarketplaceSection';
import SharedInboxSection from '../components/sections/SharedInboxSection';
import SocialCommerceSection from '../components/sections/SocialCommerceSection';
import MarketingHubSection from '../components/sections/MarketingHubSection';
import LogisticsSection from '../components/sections/LogisticsSection';
import WhyVertexSection from '../components/sections/WhyVertexSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarketplaceSection />
      <SharedInboxSection />
      <SocialCommerceSection />
      <MarketingHubSection />
      <LogisticsSection />
      <WhyVertexSection />
    </>
  );
}
