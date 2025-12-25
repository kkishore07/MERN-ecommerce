import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { isTokenValid } from "../utils/auth";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(
    () => parseInt(sessionStorage.getItem("cartCount")) || 0
  );
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(sessionStorage.getItem("cartItems")) || []
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) setProducts(await response.json());
      } catch (error) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart from backend on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/cart`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const result = await response.json();
          // Backend returns cart object with products array, or just empty array
          const updatedCart = result.cart?.products || result.cart || [];
          setCartItems(updatedCart);
          const newCount = updatedCart.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setCartCount(newCount);
          sessionStorage.setItem("cartCount", newCount.toString());
          sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }
      } catch (error) {
        // Use stored cart if backend is unavailable
      }
    };
    fetchCart();
  }, []);

  // Helper for cart API calls
  const updateCart = async (url, method = "GET", body = null) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body && { body: JSON.stringify(body) }),
      });
      if (response.ok) {
        const result = await response.json();
        // Backend returns cart object with products array, or just empty array
        const updatedCart = result.cart?.products || result.cart || [];
        setCartItems(updatedCart);
        const newCount = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(newCount);
        sessionStorage.setItem("cartCount", newCount.toString());
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Cart update failed:",
          response.status,
          response.statusText,
          errorData
        );
        return null;
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      return null;
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("[ADD TO CART] Token exists:", !!token);
      console.log("[ADD TO CART] Token valid:", isTokenValid(token));
      
      if (!token || !isTokenValid(token)) {
        sessionStorage.removeItem("token");
        sessionStorage.setItem("isLoggedin", "false");
        navigate("/login");
        return { ok: false, reason: "NOT_AUTHENTICATED" };
      }

      if (!item || !item._id) {
        console.log("[ADD TO CART] Invalid product:", item);
        return { ok: false, reason: "INVALID_PRODUCT_ID" };
      }

      console.log("[ADD TO CART] Attempting to add:", {
        productId: item._id,
        name: item.name,
        price: item.price
      });

      const updated = await updateCart(`${API_URL}/cart`, "POST", {
        productId: item._id,
        quantity: item.quantity ?? 1,
        name: item.name,
        price: item.price,
        image: item.image,
        originalPrice: item.originalPrice,
        category: item.category,
        rating: item.rating,
        reviews: item.reviews,
      });

      if (updated) {
        console.log("[ADD TO CART] Success!");
        return { ok: true };
      }
      console.log("[ADD TO CART] API returned null");
      return { ok: false, reason: "API_ERROR" };
    } catch (e) {
      console.error("[ADD TO CART] Exception:", e?.message || e);
      return { ok: false, reason: "UNKNOWN" };
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const result = await response.json();
        setProducts([...products, result.product]);
      }
    } catch {}
  };

  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        const result = await response.json();
        setProducts(
          products.map((p) =>
            p._id === productId || p.id === productId ? result.product : p
          )
        );
        return true;
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
    return false;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(
          products.filter((p) => p._id !== productId && p.id !== productId)
        );
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    return false;
  };

  const incrementCartItem = async (itemId) => {
    // Use current state for immediate update (optimistic update)
    try {
      // Find item in current cart state
      const item = cartItems.find((cartItem) => {
        if (itemId === null || itemId === "null") {
          return (
            cartItem.productId === null || cartItem.productId === undefined
          );
        }
        return (
          cartItem.productId === itemId ||
          Number(cartItem.productId) === Number(itemId)
        );
      });

      if (item) {
        // Handle null productId by passing as string "null"
        let productIdParam;
        if (itemId === null || itemId === undefined) {
          productIdParam = "null";
        } else if (isNaN(itemId)) {
          productIdParam = itemId;
        } else {
          productIdParam = itemId.toString();
        }

        // Optimistic update - update UI immediately
        const updatedCart = cartItems.map((cartItem) => {
          const matches =
            itemId === null || itemId === "null"
              ? cartItem.productId === null || cartItem.productId === undefined
              : cartItem.productId === itemId ||
                Number(cartItem.productId) === Number(itemId);

          if (matches) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });

        setCartItems(updatedCart);
        const newCount = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(newCount);
        sessionStorage.setItem("cartCount", newCount.toString());
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));

        // Then sync with backend
        await updateCart(`${API_URL}/cart/${productIdParam}`, "PUT", {
          quantity: item.quantity + 1,
        });
      }
    } catch (error) {
      console.error("Error incrementing cart item:", error);
      // Revert on error by fetching latest cart
      const response = await fetch(`${API_URL}/cart`);
      if (response.ok) {
        const result = await response.json();
        const updatedCart = result.cart || [];
        setCartItems(updatedCart);
        const newCount = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(newCount);
      }
    }
  };

  const decrementCartItem = async (itemId) => {
    // Use current state for immediate update (optimistic update)
    try {
      // Find item in current cart state
      const item = cartItems.find((cartItem) => {
        if (itemId === null || itemId === "null") {
          return (
            cartItem.productId === null || cartItem.productId === undefined
          );
        }
        return (
          cartItem.productId === itemId ||
          Number(cartItem.productId) === Number(itemId)
        );
      });

      if (item && item.quantity > 1) {
        // Handle null productId by passing as string "null"
        let productIdParam;
        if (itemId === null || itemId === undefined) {
          productIdParam = "null";
        } else if (isNaN(itemId)) {
          productIdParam = itemId;
        } else {
          productIdParam = itemId.toString();
        }

        // Optimistic update - update UI immediately
        const updatedCart = cartItems.map((cartItem) => {
          const matches =
            itemId === null || itemId === "null"
              ? cartItem.productId === null || cartItem.productId === undefined
              : cartItem.productId === itemId ||
                Number(cartItem.productId) === Number(itemId);

          if (matches) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
          return cartItem;
        });

        setCartItems(updatedCart);
        const newCount = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(newCount);
        sessionStorage.setItem("cartCount", newCount.toString());
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));

        // Then sync with backend
        await updateCart(`${API_URL}/cart/${productIdParam}`, "PUT", {
          quantity: item.quantity - 1,
        });
      }
    } catch (error) {
      console.error("Error decrementing cart item:", error);
      // Revert on error by fetching latest cart
      const response = await fetch(`${API_URL}/cart`);
      if (response.ok) {
        const result = await response.json();
        const updatedCart = result.cart || [];
        setCartItems(updatedCart);
        const newCount = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(newCount);
      }
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      // Handle null/undefined productId - pass as string "null" if needed
      let productIdParam;
      if (itemId === null || itemId === undefined) {
        productIdParam = "null";
      } else if (isNaN(itemId)) {
        // If it's already a string like "null", use it directly
        productIdParam = itemId;
      } else {
        productIdParam = itemId.toString();
      }
      await updateCart(`${API_URL}/cart/${productIdParam}`, "DELETE");
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  // Checkout: create order from current server cart, then clear cart and go to orders
  const checkout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return false;
      }

      // Fetch authoritative cart from backend (includes populated products)
      const cartRes = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.ok) return false;
      const cartData = await cartRes.json();
      const cart = cartData.cart;
      if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
        return false;
      }

      // Build order payload
      const products = cart.products
        .filter((p) => p?.product?._id && p.quantity > 0)
        .map((p) => ({ productId: p.product._id, quantity: p.quantity }));

      if (products.length === 0) return false;

      const totalAmount = cart.products.reduce((sum, p) => {
        const price = p?.product?.price ?? 0;
        return sum + price * (p.quantity ?? 0);
      }, 0);

      // Create order
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products, totalAmount }),
      });

      if (!orderRes.ok) return false;

      // Clear cart by removing each product
      for (const p of products) {
        try {
          await fetch(`${API_URL}/cart/${p.productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          // Best-effort; continue
        }
      }

      // Reset local cart state
      setCartItems([]);
      setCartCount(0);
      sessionStorage.setItem("cartCount", "0");
      sessionStorage.setItem("cartItems", JSON.stringify([]));

      navigate("/orders");
      return true;
    } catch (e) {
      console.error("Checkout failed:", e);
      return false;
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        cartCount,
        setCartCount,
        cartItems,
        setCartItems,
        products,
        setProducts,
        handleAddToCart,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        checkout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalProvider };
