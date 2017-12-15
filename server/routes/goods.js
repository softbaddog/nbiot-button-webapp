var express = require('express');
var router = express.Router();

var Goods = require('../models/goods');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dumall', {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('connected', function () {
  console.log("MongoDB connected success.")
});
db.on('error', function () {
  console.log("MongoDB connected fail.")
});
db.on('disconnected', function () {
  console.log("MongoDB connected disconnected.")
});

// 查询商品数据
router.get('/', function(req, res, next) {
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let priceLevel = req.param("priceLevel") || 'all';
  let sort = parseInt(req.param("sort")) || 1;
  let skip = (page-1) * pageSize;
  let priceGt = 0, priceLte = 0;
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0;priceLte = 100; break;
      case '1': priceGt = 100;priceLte = 500; break;
      case '2': priceGt = 500;priceLte = 1000; break;
      case '3': priceGt = 1000;priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.mssage
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

// 加入购物车
router.post('/addCart', function(req, res, next) {
  var userId = '100000077', productId = req.body.productId;
  var User = require('../models/user');

  User.findOne({
    userId: userId
  }, function(err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    }else{
      if (userDoc) {
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
            item.checked = 1;
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            }else{
              res.json({
                status: '0',
                msg: '',
                result: 'ok'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, function (err, doc) {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            }else{
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err) {
                    res.json({
                      status: '1',
                      msg: err.message
                    })
                  }else{
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'ok'
                    })
                  }
                })
              }
            }
          })
        }

      }
    }
  })

});

module.exports = router;
