const fs = require('fs');
const Handlebars = require('handlebars');
var _ = require('lodash');

async function modelConfiguration(schema) {
  let distversion = '';
  let distdirectory = __dirname;
  const source_dist_user_ts =
    '"use strict";\n' +
    ' ' +
    "var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n" +
    "var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n" +
    'if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n' +
    "else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n" +
    "return c > 3 && r && Object.defineProperty(target, key, r), r;\n" +
    "};\n" +
    "var __metadata = (this && this.__metadata) || function (k, v) {\n" +
    'if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);\n' +
    "};\n" +
    'Object.defineProperty(exports, "__esModule", { value: true });\n' +
    'const repository_1 = require("@loopback/repository");\n' +
    "let {{className}} = class {{className}} extends repository_1.Entity {\n" +
    "constructor(data) {\n" +
    "super(data);\n" +
    "}\n" +
    "};\n" +
    '__decorate([\n' +
    " repository_1.property({\n type: 'object',\n id: true,\nrequired: false,\n" +
    " }),\n" +
    '    __metadata("design:type", Object)\n' +
    '], {{className}}.prototype, "_id", void 0);\n' +
    '{{#each data}}' +
    '__decorate([\n' +
    'repository_1.property({\n' +
    "type: '{{type}}', \n" +
    'required: {{required}},\n' +
    '}),\n' +
    '    __metadata("design:type", {{objtype}})\n' +
    '], User.prototype,"{{name}}", void 0);\n' +
    '{{/each}}' +
    '{{className}} = __decorate([\n' +
    'repository_1.model(),\n' +
    '__metadata("design:paramtypes", [Object])\n' +
    '], {{className}});\n' +
    'exports.{{className}} = {{className}};\n';

  const source =
    "import {Entity, model, property} from '@loopback/repository';\n" +
    ' ' +
    '@model()\n' +
    'export class {{className}} extends Entity {\n ' +
    " @property({\n type: 'object',\n id: true,\nrequired: false,\n" +
    '})\n_id: object;\n' +
    '{{#each data}}@property({\n' +
    "type: '{{type}}', \n" +
    'required: {{required}},\n' +
    '})\n' +
    ' {{name}} :{{type}}; \n' +
    '{{/each}}' +
    'constructor(data?: Partial<{{ className }}>) {\n' +
    'super(data);\n' +
    '}\n' +
    '};\n';
  const sourcedist =
    "import {Entity} from '@loopback/repository';\n" +
    '   ' +
    'export declare class {{className}} extends Entity {\n ' +
    '_id: object;\n' +
    '{{#each data}}\n' +
    ' {{name}} :{{type}}; \n' +
    ' {{/each}}' +
    'constructor(data?: Partial<{{ className }}>);\n' +
    '}\n';

  const template = await Handlebars.compile(source);
  const templatedist = await Handlebars.compile(sourcedist);
  const templatedist_user_ts = await Handlebars.compile(source_dist_user_ts);

  let datafinal = [];
  schema.properties.map(property => {
    let obj = {
      ...property,
      objtype: _.startCase(_.toLower(property.type)),
    };
    datafinal.push(obj);
  });
  dataset = {
    properties: datafinal,
  };
  const contents = template({
    className: 'User',
    data: dataset.properties,
  });
  const contentsdist = templatedist({
    className: 'User',
    data: dataset.properties,
  });
  const contentsdist_user_ts = templatedist_user_ts({
    className: 'User',
    data: dataset.properties,
  });
  fs.writeFileSync(__dirname + '/src/models/user.model.ts', contents, err => {
    if (err) {
      return console.error(`Autsch! Failed to store template: ${err.message}.`);
    }

  });

  fromDir(__dirname, /dist/g, function (filename) {
    datasourcefilefolder = filename
  })

  function fromDir(startPath, filter, callback) {

    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath);
      return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
      if (filter.test(files[i])) {
        callback(files[i]);
      }
    };
  };
  fs.writeFileSync(
    __dirname + '/' + datasourcefilefolder + '/src/models/user.model.d.ts',
    contentsdist,
    err => {
      if (err) {
        return console.error(
          `Autsch! Failed to store template: ${err.message}.`,
        );
      }
    },
  );
  fs.writeFileSync(
    __dirname + '/' + datasourcefilefolder + '/src/models/user.model.js',
    contentsdist_user_ts,
    err => {
      if (err) {
        return console.error(
          `Autsch! Failed to store template: ${err.message}.`,
        );
      }
    },
  );

}
module.exports = {
  modelConfiguration: modelConfiguration,
};

