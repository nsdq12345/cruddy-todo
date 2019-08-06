const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    fs.writeFile(path.join(exports.dataDir, counterString + '.txt'), text, () => {
      callback(err, {id: counterString, text: text});
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var newList = [];
    if (!files.length) {
      callback(err, newList);
    } else {
      for (var i = 0; i < files.length; i++) {
        var index = files[i].indexOf('.');
        var name = files[i].substring(0, index);
        newList.push({id: name, text: name});
      }
      callback(err, newList);
    }
  });
};



exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, data) => {
    if (!data) {
      callback('error file not found', null);
    } else {
      var newObj = {id: id, text: data};
      callback(null, newObj);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt') , (err, data) => {
    if (!data) {
      callback('error id does not exist', null);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, callback);
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), callback);
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
