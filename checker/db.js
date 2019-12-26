const MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'ncDB';
const CHKINFO_COLLECTION = 'checkinformations';

// call the callback function with error and db.
const connect = (callback) => {
  MongoClient.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, (err, client) => {
    if (err) {
      return callback(err, null);
    }

    const db = client.db(DB_NAME);
    callback(null, db);
    client.close();
  });
};

// call the callback function with error and docs.
const findAllChkInfo = (callback) => {
  connect((err, db) => {
    if (err) {
      callback(new Error("failed to connect"), null);
    }

    const chkinfo = db.collection(CHKINFO_COLLECTION);

    chkinfo.find({}).toArray((err, docs) => {
      callback(err, docs);
    });
  });
};

// if it finish to execute sucessfully, 
// call the callback function with 'true' otherwise 'false'.
const setStateOfChkInfo = (_id, state, callback) => {
  connect((err, db) => {
    if (err) {
      if (callback) {
        callback(false);
      }
    }

    const chkinfo = db.collection(CHKINFO_COLLECTION);

    chkinfo.updateOne(
      {
        _id
      },
      {
        $set: {
          state,
          lastCheckedAt: new Date(Date.now())
        }
      },
      (err) => {
        if (err) {
          if (callback) {
            callback(false);
          }
        }

        if (callback) {
          callback(true);
        }
      }
    );
  })
};

module.exports = {
  connect,
  findAllChkInfo,
  setStateOfChkInfo
};