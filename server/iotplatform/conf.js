var fs = require('fs');
var path = require('path');

const certFile = path.resolve(__dirname, 'ssl/client.crt');
const keyFile = path.resolve(__dirname, 'ssl/client.key');

module.exports = {
	host: '117.78.47.187',
	port: '8743',
  server: 'https://117.78.47.187:8743',
	appId: 'PcH6DS2vvO4_0ywnlaCF4Hfb01oa',
	secret: 'PB4lrxotkNR5F0NUdpEfsfcAnDsa',
	cert: fs.readFileSync(certFile),
	key: fs.readFileSync(keyFile),
};
