const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TeamModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  contact: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  t1: {
    type: Number,
    required: true,
  },

  t2: {
    type: Number,
    required: true,
  },

  h1: {
    type: Number,
    required: true,
  },

  h2: {
    type: Number,
    required: true,
  },

  d1: {
    type: Number,
    required: true,
  },

  d2: {
    type: Number,
    required: true,
  },

  d3: {
    type: Number,
    required: true,
  },

  d4: {
    type: Number,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  t1: doc.t1,
  t2: doc.t2,
  h1: doc.h1,
  h2: doc.h2,
  d1: doc.d1,
  d2: doc.d2,
  d3: doc.d3,
  d4: doc.d4,
});

TeamSchema.statics.findByOwner = (ownerId) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TeamModel.find(search).select('name contact t1 t2 h1 h2 d1 d2 d3 d4'
  ).lean();
};

TeamSchema.statics.findByName = (name) => {
  const search = {
    name,
  };

  return TeamModel.find(search).select('name owner').lean();
};

TeamSchema.statics.updateByName = (name, newValues, callback) => {
  const search = {
    name,
  };

  return TeamModel.updateOne(search, newValues, callback);
};

TeamSchema.statics.deleteByName = (name) => {
  const search = {
    name,
  };

  return TeamModel.deleteOne(search);
}

TeamSchema.statics.findAll = () => {

  return TeamModel.find().select('name contact t1 t2 h1 h2 d1 d2 d3 d4'
  ).lean();
};

TeamModel = mongoose.model('Team', TeamSchema);

module.exports.TeamModel = TeamModel;
module.exports.TeamSchema = TeamSchema;
