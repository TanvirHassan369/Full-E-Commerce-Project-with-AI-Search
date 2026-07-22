import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import { useSelector } from "react-redux";

const Index = () => {
  const { topRatedProducts, newProducts, products } = useSelector(
    (state) => state.product
  );

  const arrivals = newProducts?.length > 0 ? newProducts : products.slice(0, 10);

  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 pt-20">
        <CategoryGrid />
        {arrivals.length > 0 && (
          <ProductSlider title="New Arrivals" products={arrivals} />
        )}
        {topRatedProducts?.length > 0 && (
          <ProductSlider
            title="Top Rated Products"
            products={topRatedProducts}
          />
        )}
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;
