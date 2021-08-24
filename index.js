const https = require('https');
const reqTimeout = 30000;
const url = 'https://explain.tensor.ru';

/**
 * Gets a query plan from explain.tensor.ru
 * @param {json} postData
 * @returns {Promise<string>}
 */
module.exports = function explain (postData) {
  return new Promise((resolve, reject) => {
    if (!postData || typeof postData !== 'string') {
      return reject('Invalid arguments');
    }
    const options = {
      port: 443,
      path: '/explain',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(url, options, (res) => {
      let content = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        content += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 302) {
          reject(`Error status code: ${res.statusCode} ${res.statusMessage}`);
        } else if (content.length === 0) {
          reject(`No data from ${url}`);
        } else if (!/Found. Redirecting to (\/archive\/explain\/[0-9A-F]{32}:\d:\d{4}-\d{2}-\d{2})/i.test(content)) {
          reject('Wrong response data');
        } else {
          resolve(`${url}${RegExp.$1}`);
        }
      });
    });

    req.on('error', (e) => {
      reject(`problem with request: ${e.message}`);
    });

    req.setTimeout(reqTimeout, () => {
      req.abort();
      reject('Request timeout');
    });

    req.on('abort', (err) => {
      reject('Request aborted');
    });

    req.write(postData);
    req.end();

  })
}
