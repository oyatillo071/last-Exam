import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import useStore from "../store/useStore";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
const initialFormState = {
  id: null,
  clientName: "",
  clientEmail: "",
  description: "",
  paymentTerms: 30,
  items: [],
  createdAt: "",
  paymentDue: "",
  status: "pending",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress: { street: "", city: "", postCode: "", country: "" },
};

//  id generat uchun funksiya
const generateId = () =>
  `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// hiisoblashga
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

// togri vaqt formati
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// muddatni xisoblaydiganm
const calculatePaymentDue = (createdAt, paymentTerms) => {
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + Number(paymentTerms));
  return formatDate(dueDate);
};

export default function InvoiceForm({ invoice = null, isOpen, onClose }) {
  const { isDarkMode, addInvoice, updateInvoice } = useStore();
  const [formData, setFormData] = useState(invoice || initialFormState);
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState();

  useEffect(() => {
    setFormData(invoice || initialFormState);
  }, [invoice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  // ozgarishlarni bsohqaruvhcu
  const handleAddressChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  // items ochargarda boshqarish
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    setFormData((prevFormData) => ({ ...prevFormData, items: newItems }));
  };

  // item qoshish
  const handleAddItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [
        ...prevFormData.items,
        { name: "", quantity: 1, price: 0, total: 0 },
      ],
    }));
  };

  // item ochirish
  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prevFormData) => ({ ...prevFormData, items: newItems }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim().length > 4)
      newErrors.clientName =
        "Mijoz nomi kiritilishi shart va kamida 4 ta belgidan iborat bolishi kerak";

    if (!formData.clientEmail.trim().length > 4)
      newErrors.clientEmail =
        "Mijoz emaili kiritilishi shart yoki kamida 4 ta belgidan ioat bolishi kerak";

    if (!/^\S+@\S+\.\S+$/.test(formData.clientEmail))
      newErrors.clientEmail = "Noto'g'ri email formati";

    if (!formData.description.trim().length > 10)
      newErrors.description =
        "Tavsif kiritilishi shart va kamida 10 ta belgidan iborat bolishi kerak";

    if (!formData.paymentTerms || formData.paymentTerms <= 0)
      newErrors.paymentTerms = "To'g'ri to'lov muddatini kiriting";

    if (formData.items.length === 0)
      newErrors.items = "Kamida bitta mahsulot kiritilishi kerak"[
        ("senderAddress", "clientAddress")
      ].forEach((addressType) => {
        Object.keys(formData[addressType]).forEach((field) => {
          if (!formData[addressType][field].trim()) {
            newErrors[`${addressType}_${field}`] = `${
              addressType === "senderAddress" ? "Jo'natuvchi" : "Mijoz"
            } ${
              field === "street"
                ? "ko'chasi"
                : field === "city"
                ? "shahri"
                : field === "postCode"
                ? "pochta indeksi"
                : "mamlakati"
            } kiritilishi shart`;
          }
        });
      });

    formData.items.forEach((item, index) => {
      if (!item.name.trim().length > 2)
        newErrors[`item${index}Name`] =
          "Mahsulot nomi kiritilishi shart va kamida 4 ta belgidan iborat bolishi kerak";
      if (!item.quantity || item.quantity <= 0)
        newErrors[`item${index}Quantity`] = "Miqdor 0 dan katta bo'lishi kerak";
      if (!item.price || item.price <= 0)
        newErrors[`item${index}Price`] = "Narx 0 dan katta bo'lishi kerak";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    if (validateForm()) {
      const invoiceData = {
        ...formData,
        id: formData.id || generateId(),
        paymentDue: calculatePaymentDue(
          formData.createdAt,
          formData.paymentTerms
        ),
        status: isDraft ? "draft" : formData.status || "pending",
        total: calculateTotal(formData.items),
      };

      if (invoice) {
        updateInvoice(invoice.id, invoiceData);
        toast.success("Hisob-faktura muvaffaqiyatli yangilandi");
      } else {
        addInvoice(invoiceData);
        toast.success(
          isDraft ? "Qoralama saqlandi" : "Yangi hisob-faktura yaratildi"
        );
      }
      onClose();
    } else {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className={`w-full md:max-w-[720px] overflow-y-auto ${
            isDarkMode ? "bg-[#141625] text-white" : "bg-white"
          }`}
        >
          <SheetHeader>
            <SheetTitle className={isDarkMode ? "text-white" : "text-black"}>
              {invoice ? `Edit ${formData.id}` : "Add New Invoice"}
            </SheetTitle>
          </SheetHeader>
          <form
            onSubmit={(e) => handleSubmit(e, false)}
            className="space-y-6 mt-6"
          >
            <div className="h-[80vh] py-6 px-2  overflow-y-scroll">
              <div className="space-y-4  ">
                <div>
                  <h3 className="font-extralight text-[#7C5DFA] mb-10">
                    Bill From
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["street", "city", "postCode", "country"].map((field) => (
                      <div
                        key={field}
                        className={`${
                          field == "street" ? "col-span-3" : "col-span-1"
                        }`}
                      >
                        <Label htmlFor={`sender-${field}`}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                          {field == "street" ? " Address" : ""}
                        </Label>
                        <Input
                          id={`sender-${field}`}
                          required
                          value={formData.senderAddress[field]}
                          onChange={(e) =>
                            handleAddressChange(
                              "senderAddress",
                              field,
                              e.target.value
                            )
                          }
                          className={
                            isDarkMode
                              ? "bg-[#1E2139] border-none text-white"
                              : ""
                          }
                        />
                        {errors[`senderAddress_${field}`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`senderAddress_${field}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#7C5DFA] font-light my-10">Bill To</h3>
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      minlength="4"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className={
                        isDarkMode ? "bg-[#1E2139] border-none text-white" : ""
                      }
                    />
                    {errors.clientName && (
                      <p className="text-red-500 text-sm">
                        {errors.clientName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="my-10">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    required
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className={
                      isDarkMode ? "bg-[#1E2139] border-none text-white" : ""
                    }
                  />
                  {errors.clientEmail && (
                    <p className="text-red-500 text-sm">{errors.clientEmail}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4  items-center">
                  <div className="flex flex-col gap-4  ">
                    <Label htmlFor="paymentTerms" className="whitespace-nowrap">
                      Pick a Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            ` justify-between px-6 text-left   font-normal ${
                              isDarkMode ? "bg-[#1E2139] border-none" : "border"
                            }`,
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <h2
                              className={`${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              Pick a date
                            </h2>
                          )}
                          <FaCalendarAlt />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-1">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate);
                            setFormData((prevData) => ({
                              ...prevData,
                              createdAt: formatDate(newDate),
                            }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payments Terms (days)</Label>
                    <Select
                      id="paymentTerms"
                      name="paymentTerms"
                      required
                      type="number"
                      defaultValue="1"
                      value={formData.paymentTerms}
                      onValueChange={(value) => {
                        console.log(value);

                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          paymentTerms: value,
                        }));
                      }}
                      className={
                        isDarkMode
                          ? "bg-[#1E2139] border-none  text-white"
                          : "border shadow-lg"
                      }
                    >
                      <SelectTrigger
                        className={`  ${
                          isDarkMode ? "border-none bg-[#1E2139]" : "border "
                        }`}
                      >
                        <SelectValue placeholder="Payment Terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Days</SelectLabel>
                          <SelectItem value="1">Next 1 day</SelectItem>
                          <SelectItem value="7">Next 7 day</SelectItem>
                          <SelectItem value="14">Next 14 day</SelectItem>
                          <SelectItem value="30">Next 30 day</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {errors.paymentTerms && (
                      <p className="text-red-500 text-sm">
                        {errors.paymentTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 mt-10 md:grid-cols-2 gap-10 ">
                  {["street", "city", "postCode", "country"].map((field) => (
                    <div
                      key={field}
                      className={`${
                        field == "street" ? "col-span-3" : "col-span-1"
                      }`}
                    >
                      <Label htmlFor={`client-${field}`}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {field === "street" ? " Address" : ""}
                      </Label>
                      <Input
                        required
                        id={`client-${field}`}
                        value={formData.clientAddress[field]}
                        onChange={(e) =>
                          handleAddressChange(
                            "clientAddress",
                            field,
                            e.target.value
                          )
                        }
                        className={
                          isDarkMode
                            ? "bg-[#1E2139] border-none md:px-4 p-1 md:py-5 text-white "
                            : ""
                        }
                      />
                      {errors[`clientAddress_${field}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`clientAddress_${field}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={
                    isDarkMode ? "bg-[#1E2139] text-white border-none" : ""
                  }
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              <div className="my-10">
                <h3 className="font-bold mb-2">Mahsulotlar</h3>
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                  >
                    <div>
                      <Label htmlFor={`itemName${index}`}>Nomi</Label>
                      <Input
                        id={`itemName${index}`}
                        minlength="4"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className={
                          isDarkMode
                            ? "bg-[#1E2139] border-none text-white"
                            : ""
                        }
                      />
                      {errors[`item${index}Name`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`item${index}Name`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`itemQuantity${index}`}>Miqdori</Label>
                      <Input
                        id={`itemQuantity${index}`}
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className={
                          isDarkMode
                            ? "bg-[#1E2139] border-none text-white"
                            : ""
                        }
                      />
                      {errors[`item${index}Quantity`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`item${index}Quantity`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`itemPrice${index}`}>Narxi</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`itemPrice${index}`}
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className={
                            isDarkMode
                              ? "bg-[#1E2139] border-none text-white"
                              : ""
                          }
                        />
                        <MdDelete
                          onClick={() => handleRemoveItem(index)}
                          className={`w-8 h-6 `}
                        />
                      </div>
                      {errors[`item${index}Price`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`item${index}Price`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddItem}
                  className={`w-full  hover:opacity-55  py-6 mt-4 ${
                    isDarkMode
                      ? " text-[#888EB0] bg-[#252945] hover:text-black hover:bg-gray-400"
                      : " text-[#7E88C3] bg-[#F9FAFE] hover:text-white hover:bg-gray-600"
                  }`}
                >
                  + Add New Item
                </Button>
                {errors.items && (
                  <p className="text-red-500 text-sm mt-2">{errors.items}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between space-x-4 flex-wrap">
              <Button
                type="button"
                variant="secondary"
                className="rounded-2xl hover:opacity-65 bg-gray-300 p-6"
                onClick={onClose}
              >
                Discard
              </Button>
              <div className="flex gap-4 items-center">
                {!invoice && (
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="p-4 sm:p-6 bg-gray-700 rounded-2xl "
                  >
                    <span className="hidden sm:block"> Add as</span> Draft
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-[#7C5DFA] hover:bg-purple-500 rounded-2xl p-4  md:p-6 "
                >
                  {invoice ? (
                    <span>Save Changes</span>
                  ) : (
                    <span>
                      {" "}
                      Save <span className="hidden sm:block"> & Send</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
