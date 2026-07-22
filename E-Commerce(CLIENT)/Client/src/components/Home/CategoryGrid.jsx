import { Link } from "react-router-dom";
import { categories } from "../../data/products";
import { ArrowRight } from "lucide-react";

const CategoryGrid = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">Browse</p>
        <h2 className="text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover our wide range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group relative overflow-hidden rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: "0 4px 24px hsla(240,12%,3%,0.5)" }}
          >
            {/* Image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white drop-shadow">
                {category.name}
              </span>
              <span className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight className="w-3 h-3 text-white" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
