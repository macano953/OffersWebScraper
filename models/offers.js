var mongoose = require('mongoose');
var offerSchema = mongoose.Schema({
    title: String,
    price: String,
    category: String,
    other_prices: String,
    seller: String,
    link: String,
    availability: String,
    image: String,
    more_info: String,
    date: { type: Date, default: Date.now}
});

offerSchema.methods.speak = function () {
  var greeting = this.title
    ? "@ " + this.price
    : "I don't have a title";
}

module.exports = mongoose.model('offers', offerSchema);