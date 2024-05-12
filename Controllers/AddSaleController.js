const AddSaleModal = require("../Modals/addSaleModal"); // importing the addSaleModal

// calling the addSale event handler function create new sale in the database
const addSale = async (request, response) => {
  const { productname, quantity, price } = request.body; // destructuring the request body to get productname, quantity, price
  try {
    // checking if productname, quantity, price is present or not
    if (!productname || !quantity || !price) {
      return response
        .status(400)
        .json({ error: "please fill the required entries" });
    }
    // creating a new sale in the database
    const author = request.user;
    const newSaleEntry = await AddSaleModal.create({
      productname,
      quantity,
      price,
      author,
    });
    response
      .status(201)
      .json({ message: "Entry done successfully", newSaleEntry });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};
// event handlers for getting top sale
const gettopsales = async (request, response) => {
  try {
    //  creating this function to get the date in  mm-dd-yyyy format
    const getFormatteddate = () => {
      return new Date().toLocaleDateString();
    };
    // applying teh aggregate method on AddSaleModal
    const saledata = await AddSaleModal.aggregate([
      // creating match stage
      { $match: { createdOn: getFormatteddate(), author: request.user._id } },

      // The $addFields stage adds a new field amount to each document,
      { $addFields: { amount: { $multiply: ["$quantity", "$price"] } } },
      // The $sort stage sorts the documents based on the amount field in descending order
      { $sort: { amount: -1 } },
      // The $limit stage limits the number of document to 5 as per the ask of the project
      { $limit: 5 },
    ]);
    if (!saledata) {
      return response
        .status(404)
        .json({ message: "No sales data found today" });
    }
    response.status(200).json({
      message: "sales fetched successfully",
      salecount: saledata.length,
      saledata,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};
// event handler for getting total revenue
const totalrevenue = async (request, response) => {
  try {
    const getFormatteddate = () => {
      return new Date().toLocaleDateString();
    };
    const revenue = await AddSaleModal.aggregate([
      // specifying the "match" stage here
      { $match: { createdOn: getFormatteddate(), author: request.user._id } },
      // using the group stage to calculate the total revenue
      {
        $group: {
          _id: request.user._id,
          totalrevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    if (!revenue) {
      return response.status(404).json({ error: "no revenue available today" });
    }

    return response.status(200).json({ totalrevenue: revenue });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};

module.exports = { addSale, gettopsales, totalrevenue };
