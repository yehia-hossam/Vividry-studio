import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GalleryHero from "@/components/gallery/GalleryHero";
import Marquee from "@/components/sections/Marquee";
import Featured from "@/components/sections/Featured";
import Features from "@/components/sections/Features";
import Story from "@/components/sections/Story";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import Newsletter from "@/components/sections/Newsletter";
import ProductPage from "@/components/shop/ProductPage";
import ProductList from "@/components/shop/ProductList";
import BagDrawer from "@/components/shop/BagDrawer";

/** Page composition — reorder, remove or add sections here. */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <GalleryHero />
        <Marquee />
        <Featured />
        <Features />
        <Story />
        <Reviews />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
      <ProductList />
      <ProductPage />
      <BagDrawer />
    </>
  );
}
