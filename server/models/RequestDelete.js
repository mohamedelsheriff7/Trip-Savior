const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountDeletionRequestSchema = new Schema({
  Username: {
    type: String, 
    required: true,
  },
  role: {
    type: String, 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  responseDate: Date, // Optional: date when the admin responds to the request
}, { collection: 'AccountDeletionRequests' });

const AccountDeletionRequest = mongoose.model('AccountDeletionRequest', accountDeletionRequestSchema);
module.exports = AccountDeletionRequest;