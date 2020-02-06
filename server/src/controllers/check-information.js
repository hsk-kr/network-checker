import { Types } from 'mongoose';
import CheckInformation from '../db/models/check-information.model';
import {
  validationError,
  serverError,
  notFoundError,
} from '../middlewares/errors';
const { ObjectId } = Types;

// APIs for user
export const createMyCheckInformation = async (req, res, next) => {
  try {
    const { alias, address, port } = req.body;

    if (!alias || !address || !port || isNaN(port)) {
      throw validationError(req.body);
    }

    const user_id = req.user._id;
    const newCheckInformation = new CheckInformation({
      user_id,
      alias,
      address,
      port,
    });

    const chkInfo = await newCheckInformation.save();
    res.status(201).json(chkInfo);
  } catch (err) {
    next(err);
  }
};

export const getMyCheckInformation = async (req, res, next) => {
  try {
    const chkInfos = await CheckInformation.find({
      user_id: req.user._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(chkInfos);
  } catch (err) {
    next(err);
  }
};

export const updateMyCheckInformation = async (req, res, next) => {
  const { id } = req.params;
  const { alias, address, port } = req.body;

  try {
    if (!id || !alias || !address || !port || isNaN(port)) {
      throw validationError(req.body);
    }

    const user_id = req.user._id;

    const result = await CheckInformation.updateOne(
      { _id: new ObjectId(id), user_id: new ObjectId(user_id) },
      {
        $set: {
          alias,
          address,
          port,
          state: false,
          updatedAt: Date.now(),
        },
        $unset: {
          lastCheckedAt: null,
        },
      }
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteMyCheckInformation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CheckInformation.deleteOne({
      _id: ObjectId(id),
      user_id: ObjectId(req.user._id),
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// APIs for admin

export const getOneCheckInformation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chkInfo = await CheckInformation.findById(id);

    if (!chkInfo) {
      throw notFoundError();
    }

    return res.status(200).json(chkInfo);
  } catch (err) {
    next(err);
  }
};

export const getCheckInformation = async (req, res, next) => {
  try {
    const count = await CheckInformation.countDocuments();

    // obtain filter options.
    let {
      start = 0,
      end = count,
      sort = '_id',
      order = 'ASC',
      filter,
    } = req.query;

    // context filter
    let contextFilter = {};

    try {
      const { q } = JSON.parse(filter); // text for search

      order = order === 'ASC' ? 1 : -1; // change text to number
      start = Number(start);
      end = Number(end);

      if (q) {
        contextFilter = {
          $or: [
            {
              alias: new RegExp(q, 'gi'),
            },
            {
              address: new RegExp(q, 'gi'),
            },
          ],
        };
      }
      // if q is number, plus searching for ports
      if (!isNaN(q)) {
        contextFilter = {
          ...contextFilter,
          $or: [
            ...contextFilter.$or,
            {
              port: q,
            },
          ],
        };
      }
    } catch (err) {
      console.error(err);
      throw validationError(req.body);
    }

    const chkInfos = await CheckInformation.find()
      .sort({ [sort]: order })
      .skip(start)
      .limit(end - start);

    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.set('X-Total-Count', count);

    res.status(200).json(chkInfos);
  } catch (err) {
    next(err);
  }
};

export const createCheckInformation = async (req, res, next) => {
  try {
    const { user_id, alias, address, port } = req.body;

    if (!user_id || !alias || !address || !port) {
      throw validationError(req.body);
    }

    const chkInfo = new CheckInformation(req.body);
    const newChkInfo = await chkInfo.save();
    res.status(201).json(newChkInfo);
  } catch (err) {
    next(err);
  }
};

export const putCheckInformation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, alias, address, port, updatedAt, createdAt } = req.body;

    if (!user_id || !alias || !address || !port || !updatedAt || !createdAt) {
      throw validationError(req.body);
    }

    const result = await CheckInformation.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: true,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteCheckInformation = async (req, res, next) => {
  try {
    const { id } = req.params;

    let result = null;
    try {
      result = await CheckInformation.findByIdAndDelete(id);
    } catch (err) {
      throw serverError();
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
