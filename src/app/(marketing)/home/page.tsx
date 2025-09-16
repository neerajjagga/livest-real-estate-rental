import HeroSection from "./sections/HeroSection";
import FeatureSection from "./sections/FeatureSection";
import DiscoverSection from "./sections/DiscoverSection";
import CallToActionSection from "./sections/CallToActionSection";

export default function LandingPage() {
    return (
        <div className="">
            <HeroSection />
            <FeatureSection />
            <DiscoverSection />
            <CallToActionSection />
        </div>
    );
}