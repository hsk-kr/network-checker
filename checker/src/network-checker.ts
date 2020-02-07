import net from 'net';
import Log from './log';
import { setStateOfChkInfo } from './db';

const getNewClient = (timeout: number): void => {
  // returns new socket with events.
  const createNewSocket = (): net.Socket => {
    let socket: net.Socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on('connect', (): void => {
      success();
    });

    socket.on('timeout', (): void => {
      fail();
    });

    socket.on('error', (): void => {
      fail();
    });

    socket.on('close', (): void => {});

    return socket;
  };

  let socket: any = createNewSocket();

  // connect to a next session.
  const connect = () => {
    if (!socket.customObject) {
      return;
    }

    if (socket.customObject.list.length > 0) {
      const chkinfo: any = socket.customObject.list.pop();

      const customObject: object = {
        list: socket.customObject.list,
        chkinfo,
        callback: socket.customObject.callback,
      };

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
    const chkinfo: any = socket.customObject.chkinfo;

    Log(`${chkinfo.address}:${chkinfo.port} success to connect.`);
    socket.destroy();
    setStateOfChkInfo(chkinfo._id, true);
    connect();
  };

  // when it's fail to connect
  const fail = () => {
    const chkinfo: any = socket.customObject.chkinfo;

    Log(`${chkinfo.address}:${chkinfo.port} fail to connect.`);
    socket.destroy();
    setStateOfChkInfo(chkinfo._id, false);
    connect();
  };

  return socket;
};

// when it finish connecting all of connections, It calls the callback.
const startChecking = (
  socketCount: number,
  timeout: number,
  checkList: Array<any>,
  callback: Function
) => {
  const sockets: Array<any> = [];

  for (let i = 0; i < socketCount; i++) {
    if (checkList.length > 0) {
      sockets.push(getNewClient(timeout));

      const chkinfo = checkList.pop();

      sockets[i].customObject = {
        list: checkList,
        chkinfo,
        callback: callback,
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

export default startChecking;
