export const orderHistory = {
  currentHistory: [
    {
      id: 1,
      customerName: "Alice Johnson",
      items: [
        {
          name: "The BP.HAM",
          quantity: 2,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Hot",
        },
        {
          name: "XO",
          quantity: 1,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Cold",
        },
      ],
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      notes: "Extra hot, please!",
    },
    {
      id: 2,
      customerName: "Bob Smith",
      items: [
        {
          name: "Heritage",
          quantity: 1,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Hot",
        },
        {
          name: "Posh",
          quantity: 1,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Cold",
        },
      ],
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      notes: "No sugar in the Heritage",
    },
    {
      id: 3,
      customerName: "Charlie Brown",
      items: [
        {
          name: "Flower Power",
          quantity: 3,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Cold",
        },
        {
          name: "Mocha Bird",
          quantity: 2,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Hot",
        },
      ],
      status: "complete",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      completedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      notes: "Birthday order",
    },
  ],
};
