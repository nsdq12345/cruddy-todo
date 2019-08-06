const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    fs.writeFile(path.join(exports.dataDir, counterString + '.txt'), text, () => {
      callback(err, {id: counterString, text: text, todo: {id: counterString, text: text}});
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, files) => {
//     var newList = [];
//     if (!files.length) {
//       callback(err, newList);
//     } else {
//       for (var i = 0; i < files.length; i++) {
//         var index = files[i].indexOf('.');
//         var name = files[i].substring(0, index);
//         newList.push({id: name, text: name});
//       }
//       callback(err, newList);
//     }
//   });
// };

Promise.promisifyAll(fs);

exports.readAll = (callback) => {
  return fs.readdirAsync(exports.dataDir)
    .then(function(listOfFiles) {
      var readAllArray = [];
      for (var i = 0; i < listOfFiles.length; i++) {
        readAllArray.push(fs.readFileAsync(path.join(exports.dataDir,listOfFiles[i]), 'utf8'))
      }
      var resultArray = [];
      Promise.all(readAllArray).then(function(values) {
        // console.log('VALUES: ' , values);
        for (var y = 0; y < values.length; y++) {
          var tempID = listOfFiles[y].split('.')[0];
          var obj = {
            id: tempID,
            text: values[y]
          }
          console.log(obj);
          resultArray.push(obj);
        }
        callback(null, resultArray);
      })
    })
    .catch(function(err) {
      throw err;
    })
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
