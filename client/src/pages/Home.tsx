import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { References } from "@/components/References";
import { Services } from "@/components/Services";
import { Reviews } from "@/components/Reviews";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <References />
      <Services />
      <Reviews />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
