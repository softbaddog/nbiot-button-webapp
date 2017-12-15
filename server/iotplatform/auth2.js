var request = require('request');
var fs = require('fs');
var path = require('path');

var certFile = path.resolve(__dirname, 'ssl/client.crt');
var keyFile = path.resolve(__dirname, 'ssl/client.key');

var apiUrl = {
  login: {
    method: 'POST',
    url: '/iocm/app/sec/v1.1.0/login'
  },
  refreshToken: {
    method: 'POST',
    url: '/iocm/app/sec/v1.1.0/refreshToken'
  },
  logout: {
    method: 'POST',
    url: '/iocm/app/sec/v1.1.0/logout'
  },
  createDevice: {
    method: 'GET',
    url: '/iocm/app/reg/v1.2.0/devices?appId=${appId}'
  },
  queryDevice: {
    method: 'POST',
    url: 'https://server:port/iocm/app/dm/v1.3.0/devices/{deviceId}?appId={appId}'
  },
  deleteDevice: {
    method: 'DELETE',
    url: '/iocm/app/dm/v1.1.0/devices/${deviceId}?appId=${appId}'
  },
  updateDevice: {
    method: 'PUT',
    url: 'https://server:port/iocm/app/dm/v1.2.0/devices/${deviceId}?appId=${appId}'
  },
  subscribe: {
    method: 'POST',
    url: '/iocm/app/sub/v1.2.0/subscribe'
  }
};

var options = {
  method: apiUrl.login.method,
  url: 'https://117.78.47.187:8743' + apiUrl.login.url,
  cert: fs.readFileSync(certFile),
  key: fs.readFileSync(keyFile),
  form :
    {
      'appId':'PcH6DS2vvO4_0ywnlaCF4Hfb01oa',
      'secret': 'PB4lrxotkNR5F0NUdpEfsfcAnDsa'
    },
  strictSSL: false
};

request(options, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(body);
  } else {
    console.log("error: " + error);
    console.log("response.statusCode: " + response.statusCode);
    console.log("response.statusText: " + response.statusText);
  }
});
