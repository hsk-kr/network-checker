const mongoose = require('mongoose');
const CheckInformation = require("../../db/models/CheckInformation");
const { ObjectId } = mongoose.Types;

/*
  APIs for user
*/

exports.createMyCheckInformation = (req, res) => {
  const { alias, address, port } = req.body;

  if (!alias || !address || !port || isNaN(port)) {
    return res.status(400).json({
      message: "Check the url and parameters"
    });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  const user_id = req.user._id;
  const newCheckInformation = new CheckInformation({
    user_id,
    alias,
    address,
    port
  });

  newCheckInformation
    .save()
    .then((checkInformation) => {
      res.status(201).json({
        message: "OK",
        checkInformation
      })
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    });
}

exports.getMyCheckInformation = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  CheckInformation
    .find({
      user_id: req.user._id
    })
    .sort({
      createAt: 1
    })
    .exec((err, checkInformation) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: 'There is a problem in the server. please do try again later.'
        });
      }

      return res.status(200).json({
        message: 'Success',
        checkInformation
      });
    });
}

exports.updateMyCheckInformation = (req, res) => {
  const { id } = req.params;
  const { alias, address, port } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: "Not authorized"
    });
  } else if (
    !id || !alias || !address || !port || isNaN(port)
  ) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }


  const user_id = req.user._id;

  CheckInformation
    .updateOne(
      {
        _id: new ObjectId(id),
        user_id: new ObjectId(user_id)
      },
      {
        $set: {
          alias,
          address,
          port,
          state: false,
          updatedAt: Date.now()
        },
        $unset: {
          lastCheckedAt: null
        }
      },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Server Error"
          });
        }

        return res.status(200).json({
          message: 'Success',
          result
        });
      }
    );
}

exports.deleteMyCheckInformation = (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: "Not authorized"
    });
  } else if (!id) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }

  CheckInformation.deleteOne({
    _id: ObjectId(id),
    user_id: ObjectId(req.user._id)
  }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Server Error"
      });
    }

    return res.status(500).json({
      message: 'Success',
      result
    });
  });
};

/*
  APIs for admin
*/

exports.getOneCheckInformation = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: "Check the url"
    });
  }

  CheckInformation.findById(
    req.params.id,
    (err, checkInformation) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Server Error"
        });
      } else if (!checkInformation) {
        return res.status(404).json({
          message: "doesn't exist"
        });
      }

      return res.status(200).json(checkInformation);
    });
};

exports.getCheckInformation = (req, res) => {
  CheckInformation.countDocuments((err, count) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    }

    let { start, end, sort, order, filter } = req.query;
    let findOptions = {};
    if (!start) {
      start = 0;
    }
    if (!end) {
      end = count;
    }
    if (!sort) {
      sort = "_id";
    }
    if (!order) {
      order = "ASC";
    }
    if (filter) {
      try {
        const filterOptions = JSON.parse(filter);
        if (filterOptions.q) {
          findOptions = {
            ...findOptions,
            $or: [
              {
                alias: new RegExp(filterOptions.q, "gi")
              },
              {
                address: new RegExp(filterOptions.q, "gi")
              }
            ]
          };

          if (!isNaN(filterOptions.q)) {
            findOptions = {
              ...findOptions,
              $or: [
                ...findOptions.$or,
                {
                  port: filterOptions.q
                }
              ]
            };
          }
        }
      } catch (e) {
        findOptions = {};
      }
    }
    order = order === 'ASC' ? 1 : -1;

    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.set('X-Total-Count', count);

    CheckInformation
      .find(findOptions)
      .sort({ [sort]: order })
      .skip(Number(start))
      .limit(Number(end) - Number(start))
      .exec((err, checkInformation) => {
        if (err) {
          console.error(err);
          return res.status(401).json({
            message: "Not authorized"
          });
        }

        return res.status(200).json(checkInformation);
      });
  });
};

exports.createCheckInformation = (req, res) => {
  if (
    !req.body.user_id || !req.body.alias ||
    !req.body.address || !req.body.port
  ) {
    return res.status(400).json({
      message: "Check the url and parameters"
    });
  }

  const newCheckInformation = new CheckInformation(req.body);
  newCheckInformation
    .save()
    .then((checkInformation) => {
      res.status(201).json(checkInformation)
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    });
}

exports.putCheckInformation = (req, res) => {
  if (
    !req.params.id || !req.body.user_id ||
    !req.body.alias || !req.body.address ||
    !req.body.port || !req.body.updatedAt ||
    !req.body.createdAt
  ) {
    return res.status(400).json({
      message: "Check the url and parameters"
    });
  }

  CheckInformation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      useFindAndModify: true
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: 'There is a problem in the server. please do try again later.'
        });
      } else if (!result) {
        return res.status(401).json({
          message: "This checkInformation doesn't exist"
        });
      }

      return res.status(200).json(result);
    }
  );
};

exports.deleteCheckInformation = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: "Check the url"
    });
  }

  CheckInformation.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    } else if (!result) {
      return res.status(401).json({
        message: "This checkInformation doesn't exist"
      });
    }

    return res.status(200).json(result);
  })
};