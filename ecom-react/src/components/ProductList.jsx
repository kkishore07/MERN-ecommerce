import React, { useContext } from "react";
import ProductCard from "./ProductCard";
import GlobalContext from "../context/GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const { products, handleAddToCart } = useContext(GlobalContext);
  const handleAddToCartWithToast = async (item) => {
    const result = await handleAddToCart(item);
    if (result?.ok) {
      toast.success("Added to cart!");
      return;
    }
    const reason = result?.reason;
    if (reason === "NOT_AUTHENTICATED") {
      toast.error("Please login to add to cart");
    } else if (reason === "INVALID_PRODUCT_ID") {
      toast.error("Item cannot be added. Invalid product.");
    } else {
      toast.error("Failed to add to cart. Try again.");
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">PRODUCTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {products.map((product) => (
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
            canAdd={Boolean(product._id)}
          />
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default ProductList;
