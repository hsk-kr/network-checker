const fs = require('fs');
const LOG_FILENAME = 'log.txt';

const Log = (msg) => {
  fs.appendFile(LOG_FILENAME, `${new Date(Date.now()).toLocaleDateString("en-US", {
    dateStyle: 'full',
    timeStyle: 'medium'
  })}: ${msg}\n`, err => {
    return;
  });
};

module.exports = Log;