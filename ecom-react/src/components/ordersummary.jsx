import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

const OrderSummary = () => {
  const { cartItems } = useContext(GlobalContext);

  const getTotalCost = () => {
    return cartItems.reduce(
      (total, item) => total + item.originalPrice * item.quantity,
      0
    );
  };

  const getTotalDiscount = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.originalPrice - item.price) * item.quantity,
      0
    );
  };

  const getFinalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300">
      <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-3">
        Order Summary
      </h3>

      <div className="space-y-5">
        <div className="flex justify-between items-center pb-5 border-b border-gray-200">
          <span className="text-gray-600 font-medium text-base">
            Total Cost
          </span>
          <span className="text-lg font-semibold text-gray-900">
            ₹{getTotalCost()}
          </span>
        </div>

        <div className="flex justify-between items-center pb-5 border-b border-gray-200">
          <span className="text-gray-600 font-medium text-base">Discount</span>
          <span className="text-lg font-semibold text-gray-700">
            - ₹{getTotalDiscount()}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <span className="text-xl font-bold text-gray-900">Final Price</span>
          <span className="text-2xl font-bold text-gray-900">
            ₹{getFinalPrice()}
          </span>
        </div>
      </div>

      <button className="w-full mt-8 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-semibold text-lg shadow-md">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
