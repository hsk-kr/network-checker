import fs from 'fs';
const LOG_FILENAME = 'log.txt';

const Log = (msg: string): void => {
  fs.appendFile(
    LOG_FILENAME,
    `${new Date(Date.now()).toLocaleDateString()}: ${msg}\n`,
    () => {
      return;
    }
  );
};

export default Log;
