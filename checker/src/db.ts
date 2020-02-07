import { MongoClient } from 'mongodb';

const DB_URL: string = 'mongodb://localhost:27017';
const DB_NAME: string = 'ncDB';
const CHKINFO_COLLECTION: string = 'checkinformations';

// call the callback function with error and db.
const connect = async (callback: Function): Promise<void> => {
  try {
    const client: any = await MongoClient.connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const db: any = client.db(DB_NAME);
    callback(null, db);
    client.close();
  } catch (err) {
    callback(err, null);
  }
};

// call the callback function with error and docs.
const findAllChkInfo = async (callback: Function): Promise<void> => {
  connect(async (err, db) => {
    if (err) {
      callback(new Error('failed to connect'), null);
    }
    const chkinfo: any = db.collection(CHKINFO_COLLECTION);

    const docs = await chkinfo.find().toArray();
    callback(null, docs);
  });
};

// if it finish to execute sucessfully,
// call the callback function with 'true' otherwise 'false'.
const setStateOfChkInfo = async (
  _id: string,
  state: boolean,
  callback?: Function
): Promise<void> => {
  connect(async (err, db) => {
    try {
      const chkinfo = db.collection(CHKINFO_COLLECTION);
      await chkinfo.updateOne(
        {
          _id,
        },
        {
          $set: {
            state,
            lastCheckedAt: new Date(Date.now()),
          },
        }
      );

      if (callback) {
        callback(true);
      }
    } catch {
      if (callback) {
        callback(false);
      }
    }
  });
};

export { findAllChkInfo, setStateOfChkInfo };
