import { useContext } from "react";
import GlobalContext from "../context/GlobalContext.jsx";
import ProductCard from "./ProductCard.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const { products, handleAddToCart } = useContext(GlobalContext);
  const topProducts = products.slice(0, 3);
  const handleAddToCartWithToast = async (item) => {
    const ok = await handleAddToCart(item);
    if (ok) {
      toast.success("Added to cart!");
    } else {
      toast.error("Please login to add to cart");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopEasy</h1>
          {/* <p className="text-xl mb-8">
            Discover amazing products at great prices
          </p> */}
          <a
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Top 3 Products */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                _id={product._id || product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                image={product.image}
                category={product.category}
                onAddToCart={handleAddToCartWithToast}
              />
            ))}
                    <ToastContainer position="top-right" autoClose={2000} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
