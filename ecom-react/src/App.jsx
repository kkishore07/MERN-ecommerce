import React from "react";
import Navbar from "./components/Navbar.jsx";
import ProductList from "./components/ProductList.jsx";
import Footer from "./components/Footer.jsx";
import AddProduct from "./components/AddProduct.jsx";
import MyCart from "./components/mycart.jsx";
import OrderSummary from "./components/ordersummary.jsx";
import { GlobalProvider } from "./context/GlobalContext.jsx";

const App = () => {
  return (
    <GlobalProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="flex-grow py-12 px-4">
          <ProductList />
          {/* <AddProduct />

          <div className="max-w-6xl mx-auto mt-12">
            <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MyCart />
              </div><br/>
              <div>
                <OrderSummary />
              </div>
            </div>
          </div> */}
        </main>
        <Footer />
      </div>
    </GlobalProvider>
  );
};

export default App;
