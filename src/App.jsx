import React from "react";
import InvoicesList from "./pages/InvoicesList";
import Sidebar from "./components/Sidebar";
import InvoiceDetails from "./pages/InvoiceDetails";
import { Route, Routes } from "react-router-dom";
import useStore from "./store/useStore";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <div className={isDarkMode ? "bg-[#141625]" : "bg-white"}>
      <Sidebar />
      <Routes>
        <Route path="/invoice/:id" element={<InvoiceDetails />} />
        <Route path="/" element={<InvoicesList />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {/* <InvoicesList /> */}
    </div>
  );
}

export default App;
