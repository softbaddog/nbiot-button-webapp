var express = require('express');
var router = express.Router();

var Devices = require('../models/devices');

var auth = require('./../iotplatform/auth');
var dm = require('./../iotplatform/dm');

// 查询商品数据
router.get('/', (req, res, next) => {
  let pageNo = parseInt(req.query.pageNo);
  let pageSize = parseInt(req.query.pageSize);

  // 执行任何查询都需要检测是否登录，并返回最新access_token
  auth.checkLogin().then((loginInfo) => {
    return dm.getDevicesInfo(loginInfo, pageNo, pageSize);
  }).then((data) => {
    let buttons = [];
    data.devicesInfo.forEach((doc, index) => {
      let services = {};
      doc.services.forEach((service, i) => {
        switch (service.serviceId) {
          case 'Button':
            services.button = service.data;
            break;
          case 'Temperature':
            services.temperature = service.data;
            break;
          case 'Connectivity':
            services.connectivity = service.data;
            break;
          case 'Battery':
            services.battery = service.data;
            break;
          case 'Alarm':
            services.alarm = service.data;
            break;
          default:
            break;
        }
      });

      buttons[index] = {
        deviceId: doc.deviceId,
        createTime: doc.createTime,
        lastModifiedTime: doc.lastModifiedTime,
        deviceInfo: {
          nodeId: doc.deviceInfo.nodeId,
          name: doc.deviceInfo.name,
          status: doc.deviceInfo.status
        },
        services: services
      };
    });
    res.json({
      status: '0',
      msg: '',
      result: {
        count: buttons.length,
        list: buttons
      }
    });
  });
});

module.exports = router;
