import AnalyticsDashboard from "./AnalyticsToolDescription";
import { FeaturesSection } from "./features";
import Hero from "./herosec";
import { LatestEvents } from "./heroSec2";
import SignUpSection from "./heroSec3";
import  EventManagementSection  from "./heroSec4";

export default function LandingPage(){
    return(
        <div>
        <Hero />
        <LatestEvents />
        <FeaturesSection />
        <SignUpSection />
        <EventManagementSection />
        <AnalyticsDashboard />
        </div>
    )
}