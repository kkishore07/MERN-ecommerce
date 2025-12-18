import React from "react";
import { useNavigate } from "react-router-dom";

// ProductCard component
// Represents a single product and handles adding it to the cart

const ProductCard = ({
  _id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  category,
  onAddToCart,
  canAdd = true,
}) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({
      _id,
      name,
      price,
      originalPrice,
      image,
      category,
      rating,
      reviews,
      quantity: 1,
    });
  };

  const handleImageClick = () => {
    if (_id) {
      navigate(`/products/${_id}`);
    }
  };

  return (
    <div className="border-2 border-black p-4 rounded-lg shadow-md bg-white">
      <div
        className="w-full h-48 mb-4 overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleImageClick}
      >
        <img src={image} alt={name} className="w-full h-full object-contain" />
      </div>
      <h2 className="text-lg font-semibold text-yellow-600 mb-2">{name}</h2>
      <div className="flex items-center mb-2">
        <span className="text-yellow-500 text-sm">⭐</span>
        <span className="text-sm ml-1">
          {rating} ({reviews} reviews)
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xl font-bold text-yellow-600">Rs. {price}</p>
        <p className="text-sm text-gray-500 line-through">
          Rs. {originalPrice}
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={`w-full border border-gray-300 py-2 rounded transition-colors ${
          canAdd ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
        }`}
      >
        {canAdd ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
};

export default ProductCard;
