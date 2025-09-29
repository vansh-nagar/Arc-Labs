import DashboardImage from "@/components/pages/landing-page/dashboard-image";
import GenerateResumeIntro from "@/components/pages/landing-page/generate-resume-into";
import HeroSection from "@/components/pages/landing-page/herosection";
import Navbar from "@/components/pages/landing-page/navbar";



const page = () => {
  return (
    <div className=" flex  flex-col  items-center">
      <Navbar />
      <HeroSection />
      <DashboardImage />
      <GenerateResumeIntro />
    </div>
  );
};

export default page;
