import Hero from "@/components/Hero";
import KodeAslab from "../components/KodeAslab";
import { FloatingNav } from "../components/ui/floating-navbar";
import About from "@/components/About";
import { Labs } from "@/components/Labs";
import { Requirements } from "@/components/Requirements";
import { TimlineOprec } from "@/components/TimelineOprec";
import Footer from "@/components/Footer";

export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Recruitment",
      link: "#recruitment",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <FloatingNav navItems={navItems} />
      <Hero />
      <About />
      <Labs />
      <Requirements />
      <TimlineOprec />
      <hr className="w-full border-t border-white" />
      <KodeAslab />
      <hr className="w-full border-t border-white" />
      <Footer />
    </div>
  );
}
