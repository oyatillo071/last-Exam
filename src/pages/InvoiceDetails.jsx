import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InvoiceForm from "../components/InvoiceForm";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice, isDarkMode } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);

  const handleDelete = () => {
    deleteInvoice(id);
    navigate("/");
  };

  const handleStatusChange = (newStatus) => {
    updateInvoice(id, { status: newStatus });
  };

  if (!invoice)
    return <div className="text-center mt-40 text-2xl">Invoice not found</div>;
  return (
    <div
      className={`min-h-screen md:pb-20 md:pl-20 ${
        isDarkMode ? "bg-[#141625] text-white" : "bg-[#f8f8fb]"
      }`}
    >
      <div className="max-w-3xl mx-auto p-6 pb-0 ">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-4 mb-8 text-sm font-bold"
        >
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.342.886L2.114 5.114l4.228 4.228"
              stroke="#9277FF"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Go back
        </button>

        {/* Status Bar */}
        <div
          className={`
          ${isDarkMode ? "bg-[#1e2139]" : "bg-white"} 
          rounded-lg shadow-lg p-6 mb-6 flex flex-wrap gap-4 justify-between items-center
        `}
        >
          <div className="flex items-center gap-4 justify-between w-full sm:w-40">
            <h2 className="text-[#858BB2] ">Status</h2>
            <div
              className={`
              px-4 py-2 rounded-md flex items-center gap-2
              ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-[#FF8F00] bg-opacity-25 text-[#FF8F00]"
              }
            `}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {invoice.status}
            </div>
          </div>

          <div className=" gap-4 flex-wrap hidden sm:flex">
            <Button
              variant="secondary"
              onClick={() => setIsEditMode(true)}
              className={`rounded-3xl   text-white hover:bg-[#313658] bg-[#252945] `}
            >
              Edit
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-3xl" variant="destructive">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent
                className={isDarkMode ? "bg-[#1e2139] text-white" : ""}
              >
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                  Are you sure you want to delete invoice #{id}? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {invoice.status == "pending" && (
              <Button
                onClick={() => handleStatusChange("paid")}
                className="bg-[#7c5dfa] hover:bg-[#6c4feb]"
              >
                Mark as Paid
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div
          className={`
          ${isDarkMode ? "bg-[#1e2139]" : "bg-white"} 
          rounded-lg shadow-lg p-6
        `}
        >
          <div className="flex justify-between flex-wrap gap-8 mb-8">
            <div>
              <h1 className="text-xl font-bold mb-1">#{invoice.id}</h1>
              <p className="">{invoice.description}</p>
            </div>
            <div className="">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-8 mb-8">
            <div>
              <div className="mb-8">
                <p className=" mb-2">Invoice Date</p>
                <p className="font-bold">{invoice.createdAt}</p>
              </div>
              <div>
                <p className=" mb-2">Payment Due</p>
                <p className="font-bold">{invoice.paymentDue}</p>
              </div>
            </div>

            <div>
              <p className=" mb-2">Bill To</p>
              <p className="font-bold mb-2">{invoice.clientName}</p>
              <div className="">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
            </div>
            {invoice.clientEmail.length < 20 && (
              <div>
                <p className=" mb-2">Sent to</p>
                <h2 className="font-bold  whitespace-nowrap break-words">
                  {invoice.clientEmail}
                </h2>
              </div>
            )}
          </div>
          <div
            className={` my-4 ${
              invoice?.clientEmail?.length > 20 ? "block" : "hidden"
            }`}
          >
            <p className=" mb-2">Sent to</p>
            <h2 className="font-bold  whitespace-nowrap text-sm md:text-base break-words">
              {invoice.clientEmail}
            </h2>
          </div>
          {/* Items Table */}
          <div
            className={`
            ${isDarkMode ? "bg-[#252945]" : "bg-gray-100"} 
            rounded-lg p-6
          `}
          >
            <table className="w-full mb-8 text-xs sm:text-base">
              <thead className=" text-left">
                <tr>
                  <th className="py-4">Item Name</th>
                  <th className="text-center">QTY.</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 font-bold">{item.name}</td>
                    <td className="text-center ">{item.quantity}</td>
                    <td className="text-right ">£ {item?.price}</td>
                    <td className="text-right font-bold">
                      £ {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className={`
              ${isDarkMode ? "bg-black" : "bg-[#373b53]"}
              text-white rounded-lg p-6 flex flex-wrap justify-between items-center
            `}
            >
              <span>Amount Due</span>
              <span className="sm:text-2xl text-lg font-bold">
                {invoice.total.toFixed(2)} £
              </span>
            </div>
          </div>
        </div>
        <div
          className={` gap-4 justify-around flex-wrap sm:hidden sticky bottom-0 right-0 items-center content-center  p-4 min-h-24 w-full flex  ${
            isDarkMode ? "bg-[#1E2139]" : "bg-white"
          }`}
        >
          <Button
            variant="secondary"
            onClick={() => setIsEditMode(true)}
            className={`px-8 py-6 bg-[#252945] rounded-3xl text-white`}
          >
            Edit
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button className="px-8 py-6 rounded-3xl" variant="destructive">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent
              className={isDarkMode ? "bg-[#1e2139] text-white" : ""}
            >
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Are you sure you want to delete invoice #{id}? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {invoice.status == "pending" && (
            <Button
              onClick={() => handleStatusChange("paid")}
              className="bg-[#7c5dfa] rounded-3xl hover:bg-[#6c4feb] p-6"
            >
              Paid
            </Button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditMode && (
        <InvoiceForm
          invoice={invoice}
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          onSave={(updatedInvoice) => {
            updateInvoice(id, updatedInvoice);
            setIsEditMode(false);
          }}
        />
      )}
    </div>
  );
}
