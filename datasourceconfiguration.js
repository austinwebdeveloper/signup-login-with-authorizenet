'use strict';
const fs = require('fs');
const path = require('path');
const datasourcefile = __dirname + '/src/datasources/mongo.datasource.json';
let datasourcefilefolder;

const datasourcefile1 = __dirname + '/dist8/src/datasources/mongo.datasource.json';
const datasourcefile2 = __dirname + '/dist10/src/datasources/mongo.datasource.json';

async function datasourceset(configuration) {
  var databaseJson;
  // await fs.readFile(datasourcefile, function(data) {
  //   databaseJson = data;
  // });
  // let data = JSON.parse(databaseJson);
  // data.mongo = configuration;
  // console.log('in datasource');

  fs.writeFile(datasourcefile, JSON.stringify(configuration), function (err) {
    if (err) console.log('eror in writing file:');
    fs.writeFile(datasourcefile1, JSON.stringify(configuration), function (err, result) {
      if (err) console.log('eror in writing file:');
	  fs.writeFile(datasourcefile2, JSON.stringify(configuration), function (err, result) {
      if (err) console.log('eror in writing file:');
    })
    })
    console.log('no eror in config');
  });
}
module.exports = {
  datasourceset: datasourceset,
};
