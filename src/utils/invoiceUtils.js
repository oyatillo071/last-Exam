export const createNewInvoice = (formData) => {
  return {
    ...formData,
    id: `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    paymentDue: new Date(
      Date.now() + formData.paymentTerms * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    total: calculateTotal(formData.items),
  };
};

export const updateExistingInvoice = (invoice, formData) => {
  return {
    ...invoice,
    ...formData,
    paymentDue: new Date(
      Date.now() + formData.paymentTerms * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    total: calculateTotal(formData.items),
  };
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

export const updateItem = (items, index, updates) => {
  return items.map((item, i) => {
    if (i === index) {
      const quantity = Number(updates.quantity || item.quantity);
      const price = Number(updates.price || item.price);
      return {
        ...item,
        ...updates,
        total: quantity * price,
      };
    }
    return item;
  });
};

export const addItem = (items) => {
  return [...items, { name: "", quantity: 1, price: 0, total: 0 }];
};

export const removeItem = (items, index) => {
  return items.filter((value, i) => i !== index);
};
