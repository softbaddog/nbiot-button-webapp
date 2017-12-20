var request = require('request');

var config = require('./config');
var iotApi = require('./api');

loginInfo = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresIn: 0
};

let iotUrl = 'https://' + config.host + ':' + config.port

// 刷新令牌
let refreshToken = () => {
  return new Promise((resolve, reject) => {
      var options = {
        url: iotUrl + iotApi.refreshToken.url,
        method: iotApi.refreshToken.method,
        cert: config.cert,
        key: config.key,
        strictSSL: false,
        json: true,
        body: {
          appId: config.appId,
          secret: config.secret,
          refreshToken: loginInfo.refreshToken
        }
      };
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log('fetchToken:' + JSON.stringify(body));
          resolve({
            result: true,
            loginInfo: {
              accessToken: body.accessToken,
              refreshToken: body.refreshToken,
              tokenType: body.tokenType,
              expiresIn: parseInt(body.expiresIn) * 1000 + Date.now()
            }
          })
        } else {
          reject(response.statusCode, response.statusText);
        }
      });
  })
}

// 获取令牌
let fetchToken = () => {
  return new Promise((resolve, reject) => {
    var options = {
      url: iotUrl + iotApi.fetchToken.url,
      method: iotApi.fetchToken.method,
      cert: config.cert,
      key: config.key,
      form :
        {
          'appId': config.appId,
          'secret': config.secret
        },
      strictSSL: false,
      json: true
    };
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('fetchToken:' + JSON.stringify(body));
        resolve({
          result: true,
          loginInfo: {
            accessToken: body.accessToken,
            refreshToken: body.refreshToken,
            tokenType: body.tokenType,
            expiresIn: parseInt(body.expiresIn) * 1000 + Date.now()
          }
        })
      } else {
        reject(response.statusCode, response.statusText);
      }
    });
  })
}

// 执行任何API前，都需要检查登录
exports.checkLogin = () => {
  return new Promise((resolve, reject) => {
    // 如果access_token有效，且未过期，直接返回成功
    // 否则，需要执行刷新token命令，重新获取access_token
    if (loginInfo.accessToken) {
      if (loginInfo.expiresIn < Date.now) {
        console.log(JSON.stringify(loginInfo));
        resolve({
          result: true,
          loginInfo: loginInfo
        });
      } else {
        return refreshToken();
      }
    } else {
      return fetchToken();
    }
  })
};