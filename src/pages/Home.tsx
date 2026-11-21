import Hero from '../components/sections/Hero';
import BotolanAtAGlance from '../components/home/BotolanAtAGlance';
import ServicesSection from '../components/home/ServicesSection';
import DiscoverBotolan from '../components/home/DiscoverBotolan';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import HelpCta from '../components/home/HelpCta';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description={`Community-run portal for the ${siteConfig.name}, ${siteConfig.province}. Find public services, government offices, contacts, and official information.`}
        keywords={`${siteConfig.shortName}, ${siteConfig.province}, local government, public services, civic services`}
      />
      <main className="flex-grow">
        <Hero />
        <BotolanAtAGlance />
        <ServicesSection />
        <DiscoverBotolan />
        <GovernmentActivitySection title="Government" />
        <HelpCta />
      </main>
    </>
  );
};

export default Home;
