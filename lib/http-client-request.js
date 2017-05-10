'use strict';

const http = require('http');

const method = (process.argv[2] || 'get').toUpperCase();

// fake data
const data = JSON.stringify({
  key: 'value',
});

// we need these headers if we are sending data
const headers = {
  'Content-Type': 'application/json',
  'Content-Length': data.length,
};

// predicate that answers the question "do we need to send data?"
const sendData = ['POST', 'PATCH'].some(e => e === method);

// set up the request, similar-looking to ajax options
const options = {
  hostname: 'httpbin.org',
  port: 80,
  path: '/get',
  method,
};

// if we need to send data, then be sure to include the correct headers
if (sendData) {
  options.headers = headers;
}

// create a new request object and define the callback which will be executed
// when the response is received
const request = http.request(options, (response) => {
  // set a value to accumulate our response
  let data = '';
  response.setEncoding('utf8');
  // handle response errors (as opposed to request errors)
  response.on('error', console.error);
  // pass chunks onto the data accumulation string
  response.on('data', (chunk) => {
    data += chunk;
  });
  // when the response is complete, log the accumulated data string
  response.on('end', () => {
    console.log(data);
  });
});

// handling request errors (as opposed to response errors)
request.on('error', console.error);

// if we are sending data, be sure to actually include the data on the request
if (sendData) {
  request.write(data);
}

// send the request already
request.end();
