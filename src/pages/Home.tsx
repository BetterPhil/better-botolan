import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
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
        <ServicesSection />
        <GovernmentActivitySection />
      </main>
    </>
  );
};

export default Home;
