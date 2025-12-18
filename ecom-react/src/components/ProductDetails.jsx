import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useContext(GlobalContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border p-6 rounded shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-contain mb-6 rounded"
        />
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">Category: {product.category}</p>
        <p className="text-2xl font-semibold text-green-600 mb-4">
          ₹{product.price}
        </p>
        {product.originalPrice && (
          <p className="text-gray-500 line-through mb-4">
            ₹{product.originalPrice}
          </p>
        )}
        <p className="text-gray-700 mb-2">Rating: {product.rating} ⭐</p>
        <p className="text-gray-700">Reviews: {product.reviews}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
