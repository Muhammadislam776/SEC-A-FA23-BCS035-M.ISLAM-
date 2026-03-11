const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;