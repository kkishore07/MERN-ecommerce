import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { getUserFromToken } from "../utils/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const user = getUserFromToken(token);
        if (!user?.id && !user?._id) {
          navigate("/login");
          return;
        }
        const userId = user.id || user._id;
        const res = await fetch(`${API_URL}/orders/find/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          setOrders([]);
        }
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-2xl text-gray-500 font-medium">
            No orders yet. Go to cart and checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = (order.products || []).reduce(
              (sum, p) => sum + (p.quantity || 0),
              0
            );
            const date = order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "";
            return (
              <div
                key={order._id}
                className="border p-4 rounded shadow-md bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Order #{order._id?.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-600">{date}</p>
                    <p className="text-sm text-gray-700">
                      Items: {itemCount} • Status: {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
