var mongoose = require('mongoose'),
  async = require('async'),
  cheerio = require('cheerio'),
  request = require('request'),
  http = require('http');

var Offers = mongoose.model('offers');
exports.findAllOffers = function (req, res) {
  var object = [];
  Offers.find(function (err, offers) {
    if (err) return console.error(err);
    async.each(offers, function (item, done) {
      object.push({
        Title: item.title,
        Price: item.price,
        other_prices: item.other_prices,
        category: item.category,
        Seller: item.seller,
        date: item.date
      });
    }, function (err) {
      if (err) return console.err(err)
    });
    res.jsonp(object);
  });
};

exports.findCategory = function (req, res) {
  var object = [];
  Offers.find({ category: req.url.replace('/', '') }, function (err, offers) {
    if (err) return console.error(err);
    async.each(offers, function (item, done) {
      object.push({
        Title: item.title,
        Price: item.price,
        other_prices: item.other_prices,
        Seller: item.seller,
        date: item.date
      });
    }, function (err) {
      if (err) return console.err(err)
    });
    res.send(object);
  });
};

exports.loadAll = function (req, res) {
  var url = 'http://blog.ofertitas.es/';
  var $;
  var Offers = mongoose.model('offers');
  async.waterfall([
    function (callback) {
      request(url, function (err, res, body) {
        if (!err && res.statusCode == 200)
          $ = cheerio.load(body);
        callback(null, body);
      })
    },
    function (arg1, callback) {
      var offer_book = [];
      $("#primary #content article").each(function (index) {
        var extracted_offer = new Offers({
          title: $(this).find($('header .entry-title a')).text(),
          price: $(this).find($('.entry-content p a')).eq(1).text(),
          category: $(this).attr('class'),
          other_prices: $(this).find($('.entry-content ul li')).eq(1).text() + $(this).find($('.entry-content ul li')).eq(2).text(),
          seller: "String",
          link: $(this).find($('.entry-content p a')).attr('href'),
          availability: "String",
          more_info: $(this).find($('.entry-content')).children().last().find($('a')).attr('href')
        });
        Offers.find({ title: extracted_offer.title }, function (err, item) {
          if (err) return console.error(err);
          else {
            if (item.length > 0) callback(null, 'offers are up to date!');
            else {
              extracted_offer.save(function (err) {
                if (err) return console.error(err);
                callback(null, 'offers updated!');
              });
            }
          }
        });
      });
    }
  ], function (err, result) {
    if (err) console.log(err);
    else {
      res.status(200).send(result);
    }
  });     
  /*BBDD connection
  var offer = new Offers({
    title: $('#primary #content article header .entry-title a').attr('title'),
    price: "49.4€",
    other_prices: "49.4€, 49.4€",
    category: "computing",
    seller: "Amazon"
  });
  offer.save(function (err) {
    if (err) throw err;
    res.send('offers updated!');
  });*/
};