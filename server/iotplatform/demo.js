var auth = require('./auth');

auth.checkLogin().then(() => {
	console.log('do something.');
})