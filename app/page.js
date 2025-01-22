import Header from "./components/layouts/header/header";
import Footer from "./components/layouts/footer/footer";
import HeroSection from "./components/layouts/hero/heroSection";
export const metadata = {
  title: "OscarED | Solo para ganadores",
  description: "Foro informativo de peliculas",
  keywords: "ecommerce, peliculas, tienda, tienda online, movies, comprar",
  openGraph: {
    title: "OscarED | Solo para ganadores",
    description: "Foro de peliculas",
    url: "https://ecommerce.vercel.app/",
    siteName: "OscarED",
    images: [{}],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <Footer />
    </>
  );
}
