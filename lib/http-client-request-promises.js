'use strict';

const http = require('http');

const method = (process.argv[2] || 'get').toUpperCase();

const data = JSON.stringify({
  key: 'value',
});

const headers = {
  'Content-Type': 'application/json',
  'Content-Length': data.length,
};

const sendData = ['POST', 'PATCH'].some(e => e === method);

const options = {
  hostname: 'httpbin.org',
  port: 80,
  path: '/get',
  method,
};

if (sendData) {
  options.headers = headers;
}

// use a Promise, this time without a wrapper function
// note that you still must initialize a new instance in order to use a Promise
// chain. This is because each Promise's executor is a unique snowflake
new Promise((resolve, reject) => {
  const request = http.request(options, (response) => {
    let data = '';
    response.setEncoding('utf8');
    // on error, reject instead of console.error
    response.on('error', reject);
    response.on('data', (chunk) => {
      data += chunk;
    });
    // on end, resolve instead of using console.log
    response.on('end', () => {
      resolve(data);
    });
  });

  // reject here as well, so we can colocate our error handling code
  request.on('error', reject);

  if (sendData) {
    request.write(data);
  }

  // finally, send the request
  request.end();
}).then(console.log).catch(console.error);
