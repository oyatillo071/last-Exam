import React from "react";
import InvoicesList from "./components/InvoicesList";
import Sidebar from "./components/Sidebar";
import InvoiceDetails from "./components/InvoiceDetails";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Sidebar />
      <Routes>
        <Route path="/invoice/:id" element={<InvoiceDetails />} />
        <Route path="/" element={<InvoicesList />} />
      </Routes>
      {/* <InvoicesList /> */}
    </div>
  );
}

export default App;
