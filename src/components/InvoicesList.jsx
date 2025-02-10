import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { Button } from "@/components/ui/button";
import InvoiceForm from "./InvoiceForm";

export default function InvoicesList() {
  const navigate = useNavigate();
  const { invoices, isDarkMode, selectedFilter, setFilter, addInvoice } =
    useStore();
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    if (selectedFilter == "all") return true;
    return inv.status === selectedFilter;
  });

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#141625] text-white" : "bg-[#f8f8fb]"
      }`}
    >
      <InvoiceForm
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSave={(newInvoice) => {
          addInvoice(newInvoice);
          setIsNewInvoiceOpen(false);
        }}
      />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500">
              There are {filteredInvoices.length} total invoices
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <select
              value={selectedFilter}
              onChange={(e) => setFilter(e.target.value)}
              className={`
                px-4 font-bold rounded-lg  outline-none 
                ${isDarkMode ? " text-white bg-[#141625] " : "bg-transparent"}
              `}
            >
              <option value="all">Filter</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>

            <Button
              onClick={() => setIsNewInvoiceOpen(true)}
              className={`
                p-6  rounded-full font-bold flex items-center gap-2
                ${
                  isDarkMode
                    ? "bg-[#7c5dfa] text-white"
                    : "bg-purple-600 text-white"
                }
              `}
            >
              <span className="h-8 w-8 rounded-full bg-white text-purple-600 flex items-center justify-center">
                +
              </span>
              New <span className="hidden sm:block"> Invoice</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4 fex flex-wrap">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`
                ${isDarkMode ? "bg-[#1e2139]" : "bg-white"}
                p-6 rounded-lg shadow-lg flex items-center justify-between flex-wrap
                cursor-pointer hover:border hover:border-purple-600 transition-all
              `}
              onClick={() => navigate(`/invoice/${invoice.id}`)}
            >
              <div className="flex gap-8 min-w-0.5 items-center flex-wrap">
                <span className="font-bold">#{invoice.id}</span>
                <span className="text-gray-500">Due {invoice.paymentDue}</span>
                <span>{invoice.clientName}</span>
              </div>

              <div className="flex gap-8 items-center min-w-0.5 flex-wrap">
                <span className="text-xl font-bold">
                  £ {invoice.total.toFixed(2)}
                </span>
                <div
                  className={`
                  px-4 py-2 rounded-md flex items-center gap-2 
                  ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : invoice.status === "pending"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
                >
                  <span className="text-2xl">•</span>{" "}
                  {invoice.status.charAt().toUpperCase() +
                    invoice.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
