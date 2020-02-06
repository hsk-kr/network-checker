import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowerCase: true,
    minlength: 4,
    maxlength: 20,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);
