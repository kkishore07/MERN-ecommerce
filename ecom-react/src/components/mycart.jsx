import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

const MyCart = () => {
  const { cartItems, incrementCartItem, decrementCartItem, removeCartItem, checkout } =
    useContext(GlobalContext);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-4">
          My Cart
        </h2>
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-2xl text-gray-500 font-medium">
            Your cart is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 border-b-2 border-gray-200 pb-4">
        My Cart
      </h2>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-lg border border-gray-300 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
            />

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {item.category}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-sm text-gray-700">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
                <p className="text-sm text-gray-400 line-through">
                  ₹{item.originalPrice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                  Quantity
                </p>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      // Handle null productId properly
                      const productId =
                        item.productId !== null && item.productId !== undefined
                          ? Number(item.productId)
                          : "null";
                      decrementCartItem(productId);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-xl font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-lg font-bold bg-gray-50 border-x-2 border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      // Handle null productId properly
                      const productId =
                        item.productId !== null && item.productId !== undefined
                          ? Number(item.productId)
                          : "null";
                      incrementCartItem(productId);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 text-xl font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
                  Subtotal
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>

              <button
                onClick={() => {
                  // Handle null productId by passing it as string "null"
                  const productId =
                    item.productId !== null && item.productId !== undefined
                      ? Number(item.productId)
                      : "null";
                  removeCartItem(productId);
                }}
                className="text-gray-400 hover:text-red-600 text-3xl font-bold ml-2 transition-colors duration-200"
                title="Remove item"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border-2 border-gray-300">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Total Amount
          </p>
          <p className="text-3xl font-bold text-gray-900">₹{getTotalPrice()}</p>
        </div>
        <button
          onClick={checkout}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default MyCart;
