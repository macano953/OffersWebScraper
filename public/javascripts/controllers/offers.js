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
        link: item.link,
        availability: item.availability,
        image: item.image,
        more_info: item.more_info,
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
        link: item.link,
        availability: item.availability,
        image: item.image,
        more_info: item.more_info,
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
      $("#primary #content article").each(function (index) {
        var categories = [];
        var all_categories = $(this).attr('class').split(' ');
        all_categories.forEach(function (element, index) {
          if (element.indexOf('category') === 0 || element.indexOf('tag') === 0) { categories.push(element); }
          else { }
        }, this);
        var extracted_offer = new Offers({
          title: $(this).find($('header .entry-title a')).text(),
          price: $(this).find($('.entry-content .tienda .preciohoy a strong')).text(),
          category: categories,
          other_prices: $(this).find($('.entry-content ul li')).eq(1).text() + $(this).find($('.entry-content ul li')).eq(2).text(),
          seller: "String",
          link: $(this).find($('.entry-content p a')).attr('href'),
          availability: "String",
          image: $(this).find($('.entry-content p')).find("img").attr('src'),
          more_info: $(this).find($('.entry-content')).children().last().find($('a')).attr('href')
        });
        Offers.find({ title: extracted_offer.title }, function (err, item) {
          if (err) return console.error(err);
          else {
            if (item.length > 0) callback(null, 'uptodate');
            else {
              extracted_offer.save(function (err) {
                if (err) return console.error(err);
                callback(null, 'updated');
              });
            }
          }
        });
      });
    }
  ], function (err, result) {
    if (err) console.log(err);
    else {
      res.render(result);
    }
  });
};