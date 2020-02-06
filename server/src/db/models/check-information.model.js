import mongoose, { Schema } from 'mongoose';

const checkInformation = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  alias: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  port: {
    type: Number,
    required: true,
    min: 0,
    max: 65535,
  },
  state: {
    type: Boolean,
    default: false,
  },
  lastCheckedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('checkInformation', checkInformation);
