import DashboardImage from "@/components/pages/landing-page/dashboard-image";
import GenerateResumeIntro from "@/components/pages/landing-page/generate-resume-into";
import HeroSection from "@/components/pages/landing-page/herosection";
import Navbar from "@/components/pages/landing-page/navbar";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const page = () => {
  return (
    <div className="  w-full relative overflow-hidden    ">
      <ScrollProgress  className="z-[100]" />
      <Navbar />
      <HeroSection />
      <DashboardImage />
      <GenerateResumeIntro />
    </div>
  );
};

export default page;
