const { findAllChkInfo } = require('./db');
const networkChecker = require('./network-checker');
const Log = require('./log');

// setting variables
let socketCount = 10;
let timeout = 1000;
let delay = 10000;

const argv = process.argv.slice(2);

// Parse arguments and set up setting variables.
for (let i = 0; i < argv; i += 2) {
  const name = argv[i];
  if (i + 1 >= argv.length) {
    console.error("you must've called pair arguments.");
    return;
  }

  let value = argv[i + 1];
  if (isNaN(value)) {
    console.error("value must've been number.");
    continue;
  }
  value = Number(value);

  switch (name) {
    case 'socket-count':
      socketCount = value;
      break;
    case 'timeout':
      timeout = value;
      break;
    case 'delay':
      delay = value;
      break;
  }
}

let waiting = false;
// This must be called only once.
const check = () => {
  waiting = false;
  findAllChkInfo((err, docs) => {
    networkChecker(socketCount, timeout, docs, () => {
      if (!waiting) {
        waiting = true;
        Log('It\'s been finished checking all of connections.');
        Log(`It's going to restart after ${delay}`);

        setTimeout(check, delay);
      }
    });
  });
};

check();