const net = require('net');
const Log = require("./log");
const { setStateOfChkInfo } = require('./db');


const getNewClient = (timeout) => {
  // returns new socket with events.
  const createNewSocket = () => {
    let socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      success();
    });

    socket.on('timeout', () => {
      fail();
    });

    socket.on('error', (err) => {
      fail();
    });

    socket.on('close', () => {
    });

    return socket;
  }

  let socket = createNewSocket();

  // connect to a next session.
  const connect = () => {
    if (!socket.customObject) {
      return;
    }

    if (socket.customObject.list.length > 0) {
      const chkinfo = socket.customObject.list.pop();

      const customObject = {
        list: socket.customObject.list,
        chkinfo,
        callback: socket.customObject.callback
      }

      socket = createNewSocket();
      socket.customObject = customObject;

      socket.connect({
        host: chkinfo.address,
        port: chkinfo.port,
      });
    } else {
      socket.customObject.callback();
    }
  };

  // when it's success to connect
  const success = () => {
    const chkinfo = socket.customObject.chkinfo;

    Log(`${chkinfo.address}:${chkinfo.port} success to connect.`);
    socket.destroy();
    setStateOfChkInfo(chkinfo._id, true);
    connect();
  };

  // when it's fail to connect
  const fail = () => {
    const chkinfo = socket.customObject.chkinfo;

    Log(`${chkinfo.address}:${chkinfo.port} fail to connect.`);
    socket.destroy();
    setStateOfChkInfo(chkinfo._id, false);
    connect();
  };

  return socket;
}

// when it finish connecting all of connections, It calls the callback.
const startChecking = (socketCount, timeout, checkList, callback) => {
  const sockets = [];

  for (let i = 0; i < socketCount; i++) {
    if (checkList.length > 0) {
      sockets.push(getNewClient(timeout));

      const chkinfo = checkList.pop();

      sockets[i].customObject = {
        list: checkList,
        chkinfo,
        callback: callback
      };

      sockets[i].connect({
        host: chkinfo.address,
        port: chkinfo.port,
      });
    } else {
      break;
    }
  }
};

module.exports = startChecking;