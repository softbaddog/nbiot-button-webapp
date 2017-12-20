var request = require('request');
var config = require('config');
var iotApi = require('api');
var loginInfo = require('auth');

let deviceInfo = {
  manufacturerId: 'Huawei',
  manufacturerName: 'Huawei',
  deviceType: 'OneButton',
  model: 'IOTBTN-001',
  protocolType: 'CoAP'
}

// 注册一个新设备
exports.registerDevice = (nodeId) => {
  return new Promise((resovle, reject) => {
      var options = {
        method: iotApi.registerDevice.method,
        url: iotUrl + iotApi.registerDevice.url,
        cert: config.cert,
        key: config.key,
        headers: {
          'app_key': config.appId,
          'Authorization': loginInfo.tokenType + ' ' + loginInfo.accessToken
        },
        qs: {
          'nodeId': nodeId
        },
        strictSSL: false,
        json: true
    };
    request(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        resolve({
          result: true,
          deviceInfo: {
            deviceId: body.deviceId,
            verifyCode: body.verifyCode,
            timeout: body.timeout,
            psk: body.psk
          }
        });
      } else {
        reject(res.statusCode, res.statusText);
      }
    });
  })
}

// 删除一个设备
exports.deleteDevice = (deviceId) => {
  return new Promise((resolve, reject) => {
      var options = {
        method: iotApi.deleteDevice.method,
        url: iotUrl + iotApi.deleteDevice.url + '/' + deviceId,
        cert: config.cert,
        key: config.key,
        headers: {
          'app_key': config.appId,
          'Authorization': loginInfo.tokenType + ' ' + loginInfo.accessToken
        },
        strictSSL: false,
        json: true
    };
    request(options, (error, res, body) => {
      if (!error && res.statusCode === 204) {
        resolve({
          result: true
        });
      } else {
        reject(res.statusCode, res.statusText);
      }
    });
  })
}

// 更新一个设备
exports.updateDevice = (deviceId, name) => {
  return new Promise((resolve, reject) => {
      var options = {
        method: iotApi.updateDevice.method,
        url: iotUrl + iotApi.updateDevice.url + '/' + deviceId,
        cert: config.cert,
        key: config.key,
        headers: {
          'app_key': config.appId,
          'Authorization': loginInfo.tokenType + ' ' + loginInfo.accessToken
        },
        body: {
          name: name,
          manufacturerId: deviceInfo.manufacturerId,
          manufacturerName: deviceInfo.manufacturerName,
          deviceType: deviceInfo.deviceType,
          model: deviceInfo.model,
          protocolType: deviceInfo.protocolType
        },
        strictSSL: false,
        json: true
    };
    request(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        resolve({
          result: true,
          totalCount: body.totalCount,
          dataHistorty: body.deviceDataHistoryDTOs
        });
      } else {
        reject(res.statusCode, res.statusText);
      }
    });
  })
}

// 获取设备历史记录
exports.getDataHistorty = (deviceId, pageNo, pageSize) => {
  return new Promise((resovle, reject) => {
      var options = {
        method: iotApi.queryDataHistory.method,
        url: iotUrl + iotApi.queryDataHistory.url,
        cert: config.cert,
        key: config.key,
        headers: {
          'app_key': config.appId,
          'Authorization': loginInfo.tokenType + ' ' + loginInfo.accessToken
        },
        qs: {
          'deviceId': deviceId,
          'gatewayId': deviceId,
          'pageNo': pageNo,
          'pageSize': pageSize
        },
        strictSSL: false,
        json: true
    };
    request(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        resolve({
          result: true,
          totalCount: body.totalCount,
          dataHistorty: body.deviceDataHistoryDTOs
        });
      } else {
        reject(res.statusCode, res.statusText);
      }
    });
  })
}

// 获取多个设备数据
exports.getDevicesInfo = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    var options = {
      url: iotUrl + apiUrl.queryDevice.url,
      method: apiUrl.queryDevice.method,
      cert: config.cert,
      key: config.key,
      headers: {
        'app_key': config.appId,
        'Authorization': loginInfo.tokenType + ' ' + loginInfo.accessToken
      },
      qs: {
        'pageNo': pageNo,
        'pageSize': pageSize
      },
      strictSSL: false,
      json: true
    };

    request(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        resolve({
          result: true,
          totalCount: body.totalCount,
          devicesInfo: body.devices
        });
      } else {
        reject(res.statusCode, res.statusText);
      }
    });
  })
}