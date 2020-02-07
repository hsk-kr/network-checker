import { findAllChkInfo } from './db';
import networkChecker from './network-checker';
import Log from './log';

// setting variables
let socketCount: number = 10;
let timeout: number = 1000;
let delay: number = 10000;

const argv: Array<string> = process.argv.slice(2);

// Parse arguments and set up setting variables.
for (let i: number = 0; i < argv.length; i += 2) {
  const name: string = argv[i];
  if (i + 1 >= argv.length) {
    console.error("you must've called pair arguments.");
    process.exit(1);
  }

  let value: number = 0;
  try {
    value = Number(argv[i + 1]);
  } catch {
    console.error("value must've been number.");
    continue;
  }

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

let waiting: boolean = false;

// This must be called only once.
const check = () => {
  waiting = false;
  findAllChkInfo((err, docs) => {
    networkChecker(socketCount, timeout, docs, () => {
      if (!waiting) {
        waiting = true;
        Log("It's been finished checking all of connections.");
        Log(`It's going to restart after ${delay}`);

        setTimeout(check, delay);
      }
    });
  });
};

check();
