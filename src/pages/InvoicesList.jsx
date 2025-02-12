import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { Button } from "@/components/ui/button";
import InvoiceForm from "../components/InvoiceForm";
import { SlArrowRight } from "react-icons/sl";
import EmptyImg from "../assets/empty-img.png";
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
      className={`min-h-screen md:pl-20 ${
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
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500">
              There are {filteredInvoices.length} total invoices
            </p>
          </div>

          <div className="flex flex-wrap justify-between w-full md:w-[50%]  gap-4 items-center">
            <select
              value={selectedFilter}
              onChange={(e) => setFilter(e.target.value)}
              className={`
                px-4 font-bold rounded-lg outline-none cursor-pointer
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
                md:p-6 rounded-full hover:bg-purple-500 font-bold flex items-center gap-2
                ${
                  isDarkMode
                    ? "bg-[#7c5dfa] text-white "
                    : "bg-purple-600 text-white "
                }
              `}
            >
              <span className="md:h-8 md:w-8 h-6 w-6 rounded-full bg-white text-purple-600 flex items-center justify-center">
                +
              </span>
              New <span className="hidden sm:block"> Invoice</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4 fex flex-wrap">
          {filteredInvoices.length <= 0 && (
            <div className="flex flex-col items-center justify-center text-center mt-[102px]">
              <img
                className="mb-[40px] md:mb-[64px] max-w-[241px] w-[100%] max-h-[200px] h-[100%] "
                src={EmptyImg}
                alt="empty logo"
              />
              <h1 className="text-[20px] text-[#0C0E16] mb-[24px] font-bold animate-slide-down dark:text-white">
                There is nothing here
              </h1>
              <p className="text-[#888EB0] text-[12px] animate-slide-down dark:text-[#DFE3FA]">
                Create an invoice by clicking the <br />
                <span className="font-bold"> New</span> button and get started
              </p>
            </div>
          )}
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`
                ${isDarkMode ? "bg-[#1e2139]" : "bg-white"}
                 p-6 rounded-lg text-left shadow-lg  flex items-center justify-between relative flex-wrap
                cursor-pointer hover:border hover:border-purple-600 md:pr-10 transition-all
              `}
              onClick={() => navigate(`/invoice/${invoice.id}`)}
            >
              <div className="flex gap-4 text-left min-w-0.5 items-center flex-col sm:flex-row ">
                <span className="font-bold text-lg md:text-xl text-left">
                  #{invoice.id}
                </span>
                <span className="text-gray-500">Due {invoice.paymentDue}</span>
                <span className="hidden sm:block">{invoice.clientName}</span>
                <span className="text-xl sm:hidden  font-bold">
                  £ {invoice.total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-8 items-center min-w-0.5 sm:flex-row flex-col">
                <span className="text-xl hidden sm:block font-bold">
                  £ {invoice.total.toFixed(2)}
                </span>
                <span className="sm:hidden">{invoice.clientName}</span>
                <div
                  className={`
                  px-4 py-2 w-28 rounded-md flex items-center gap-2 
                  ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : invoice.status == "pending"
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
              <SlArrowRight className="absolute md:block hidden  top-[40%] right-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
