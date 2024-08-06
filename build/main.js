require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/cookie/index.js":
/*!**************************************!*\
  !*** ./node_modules/cookie/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var dec = opt.decode || decode;

  var index = 0
  while (index < str.length) {
    var eqIdx = str.indexOf('=', index)

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    var endIdx = str.indexOf(';', index)

    if (endIdx === -1) {
      endIdx = str.length
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1
      continue
    }

    var key = str.slice(index, eqIdx).trim()

    // only assign once
    if (undefined === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim()

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1)
      }

      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString()
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.partitioned) {
    str += '; Partitioned'
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase()
      : opt.priority

    switch (priority) {
      case 'low':
        str += '; Priority=Low'
        break
      case 'medium':
        str += '; Priority=Medium'
        break
      case 'high':
        str += '; Priority=High'
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * URL-encode value.
 *
 * @param {string} val
 * @returns {string}
 */

function encode (val) {
  return encodeURIComponent(val)
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]' ||
    val instanceof Date
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ "./nuxt.config.ts":
/*!************************!*\
  !*** ./nuxt.config.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// https://nuxt.com/docs/api/configuration/nuxt-config
/* harmony default export */ __webpack_exports__["default"] = (defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    '@/assets/css/main.css',
  ]
}));

/***/ }),

/***/ "./server/config/index.js":
/*!********************************!*\
  !*** ./server/config/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

if (false) {}
const loaded = {};
const load = name => {
  name = name || 'config';
  if (loaded.hasOwnProperty(name)) {
    return loaded[name];
  } else {
    try {
      items.load = load;
      loaded[name] = items;
      return loaded[name];
    } catch (e) {
      if (e.toString().startsWith('SyntaxError')) {
        console.error('app:config ' + e.toString());
      } else {
        console.error('app:config Configuration file not available for `' + "development" + '` environtment. Please create `' + "development" + '.' + name + '.json` in `config` directory !');
      }
      process.exit(1);
    }
  }
};
let config = load() || {};
module.exports = config;

/***/ }),

/***/ "./server/controllers/authController.js":
/*!**********************************************!*\
  !*** ./server/controllers/authController.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const config = __webpack_require__(/*! ../config */ "./server/config/index.js").load();
const {
  check,
  validationResult
} = __webpack_require__(/*! express-validator */ "express-validator");
const md5 = __webpack_require__(/*! md5 */ "md5");
module.exports = {
  validate: () => {
    return [check('name', 'Name is required').not().isEmpty(), check('email', 'Email is required').not().isEmpty(), check('password', 'State name is required').not().isEmpty(), check('phone', 'Phone is required').not().isEmpty()];
  },
  login: async (req, res) => {
    res.status(400).json({
      success: false,
      message: 'email or password is not correct'
    });
  }
};

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const path = __webpack_require__(/*! path */ "path");
const express = __webpack_require__(/*! express */ "express");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const cors = __webpack_require__(/*! cors */ "cors");
const {
  Nuxt,
  Builder
} = __webpack_require__(/*! nuxt */ "nuxt");
__webpack_require__(/*! dotenv */ "dotenv").config();
global.__SERVERDIR = path.join(process.cwd(), __dirname);
const config = __webpack_require__(/*! ./config */ "./server/config/index.js").load();
config.host = process.env.HOST || '127.0.0.1';
if (!config.port) {
  config.port = process.env.PORT || 8000;
}
const app = global.app = express();
app.set('port', config.port);
app.set('trust proxy', true);
// Import API Routes
if (config.databaseConnectOnInit) {
  let {
    connectAllDatabase
  } = __webpack_require__(/*! ./models/mongodb */ "./server/models/mongodb/index.js");
  connectAllDatabase();
}
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies
app.use(bodyParser.json({
  limit: '50mb'
})); // support json encoded bodies
app.use('/api', __webpack_require__(/*! ./routes/ */ "./server/routes/index.js")); // routes

// Enable CORS
if (!nuxtConfig.dev) {
  app.use(cors());
}
// Import and Set Nuxt.js options
let nuxtConfig = __webpack_require__(/*! ../nuxt.config.ts */ "./nuxt.config.ts");
nuxtConfig.dev = !("development" === 'production');

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig);

// Build only in dev mode
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server
var server = app.listen(config.port, config.host);
server.timeout = 600 * 1000;
//server.setTimeout(500000);
console.log('Server listening on ' + config.host + ':' + config.port); // eslint-disable-line no-console
/* WEBPACK VAR INJECTION */}.call(this, "server"))

/***/ }),

/***/ "./server/middleware/signupAuth.js":
/*!*****************************************!*\
  !*** ./server/middleware/signupAuth.js ***!
  \*****************************************/
/*! exports provided: afterSignupAuth */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "afterSignupAuth", function() { return afterSignupAuth; });
const config = __webpack_require__(/*! ../config */ "./server/config/index.js").load();
const Cookie = __webpack_require__(/*! cookie */ "./node_modules/cookie/index.js");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const afterSignupAuth = async (req, res, next) => {
  var cookie = req.headers.cookie ? Cookie.parse(req.headers.cookie) : {};
  var parsed = cookie;
  if (cookie.formData == undefined && cookie.user == undefined || req.headers.token) {
    let token = req.headers && req.headers.token ? req.headers && req.headers.token : '';
    console.log('req.originalUrl', req.originalUrl);
    console.log('req.headers', req.headers);
    console.log('req.body', req.body);
    console.log('req.query', req.query);
    if (token) {
      jwt.verify(token, config.jwtKey, async (err, decode) => {
        if (err) {
          console.log('invalid token 1');
          return res.status(401).json({
            success: false,
            c: 'invalid token 1'
          });
        } else {
          res.locals.auth = {
            id: decode.userId,
            createAuth: false
          };
          next();
        }
      });
    } else {
      console.log('user data not found 1');
      return res.status(401).json({
        success: false,
        c: 'user data not found 1'
      });
    }
  } else {
    if (cookie.user != undefined) {
      let user = JSON.parse(parsed.user);
      jwt.verify(JSON.parse(parsed.user).token, config.jwtKey, (err, decode) => {
        if (err) {
          console.log('invalid token 3');
          return res.status(401).json({
            success: false,
            c: 'invalid token 3'
          });
        } else {
          res.locals.auth = {
            id: JSON.parse(parsed.user).id,
            createAuth: true
          };
          next();
        }
      });
    } else {
      jwt.verify(JSON.parse(parsed.auth).accessToken, config.jwtKey, (err, decode) => {
        if (err) {
          console.log('invalid token 4');
          return res.status(401).json({
            success: false,
            c: 'invalid token 4'
          });
        } else {
          res.locals.auth = {
            id: decode.userId,
            createAuth: false
          };
          next();
        }
      });
    }
  }
};

/***/ }),

/***/ "./server/models sync recursive ^\\.\\/.*$":
/*!*************************************!*\
  !*** ./server/models sync ^\.\/.*$ ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./": "./server/models/index.js",
	"./index": "./server/models/index.js",
	"./index.js": "./server/models/index.js",
	"./mongodb": "./server/models/mongodb/index.js",
	"./mongodb/": "./server/models/mongodb/index.js",
	"./mongodb/index": "./server/models/mongodb/index.js",
	"./mongodb/index.js": "./server/models/mongodb/index.js",
	"./mongodb/mainModel": "./server/models/mongodb/mainModel.js",
	"./mongodb/mainModel.js": "./server/models/mongodb/mainModel.js",
	"./mongodb/schema/UserSchema": "./server/models/mongodb/schema/UserSchema.js",
	"./mongodb/schema/UserSchema.js": "./server/models/mongodb/schema/UserSchema.js",
	"./mongodb/user": "./server/models/mongodb/user.js",
	"./mongodb/user.js": "./server/models/mongodb/user.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./server/models sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./server/models/index.js":
/*!********************************!*\
  !*** ./server/models/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(/*! path */ "path");
const {
  database,
  databaseDefault
} = __webpack_require__(/*! ../config */ "./server/config/index.js").load();
class ConnectionManager {
  constructor(connection_driver, config_name) {
    this.driver = connection_driver;
    this.type = config_name;
    this.config = database[config_name];
    this.connection = [];
  }
  connect(config) {
    if (config.active) {
      return this.driver(config);
    } else {
      console.warn(`app:database Selected ${this.type} database (${config.name}) is not activated on configuration !`);
      return null;
    }
  }
  getConnection(number) {
    if (!number) {
      number = 0;
    }
    if (this.connection[number]) {
      return this.connection[number];
    } else {
      if (this.config.hasOwnProperty(number)) {
        this.connection[number] = this.connect(this.config[number]);
        return this.connection[number];
      } else {
        console.warn(`app:database Database ${this.type} number ${number} is not exist on configuration !`);
        return null;
      }
    }
  }
}
const model = (name, type) => {
  return __webpack_require__("./server/models sync recursive ^\\.\\/.*$")("./" + (type || databaseDefault) + '/' + name);
};
const connectAllDatabase = () => {
  let conn = {};
  for (let type in database) {
    conn[type] = [];
    for (var i = 0; i < database[type].length; i++) {
      conn[type].push(__webpack_require__("./server/models sync recursive ^\\.\\/.*$")("./" + type).getConnection(i));
    }
  }
  return conn;
};
module.exports = {
  ConnectionManager,
  model,
  connectAllDatabase
};

/***/ }),

/***/ "./server/models/mongodb/index.js":
/*!****************************************!*\
  !*** ./server/models/mongodb/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  ConnectionManager
} = __webpack_require__(/*! ../ */ "./server/models/index.js");
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const mongoConnection = config => {
  const options = {};
  let at = '';
  let by = '';
  let on = '';
  if (config.user && config.user != '') {
    at = '@';
  } else {
    config.user = '';
  }
  if (config.pass && config.pass != '') {
    by = ':';
  } else {
    config.pass = '';
  }
  if (config.port && config.port != '') {
    on = ':';
  } else {
    config.port = '';
  }

  // mongoose.connect('mongodb://' + config.user + by + config.pass + at + config.host + on + config.port + '/' + config.name, extend(options, config.options))
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('autoIndex', false);
  mongoose.set('useUnifiedTopology', true);
  var conn = mongoose.createConnection(config.url, {
    serverSelectionTimeoutMS: 30000,
    useNewUrlParser: true,
    poolSize: 50,
    useUnifiedTopology: true,
    poolSize: 10
  });

  // mongoose.Promise = global.Promise
  conn.on('error', () => {
    console.error.bind(console, 'app:database MongoDB connection error : \n');
  });
  conn.on('open', () => {
    console.log('app:database MongoDB connection success!');
  });
  return conn;
};
const manager = new ConnectionManager(mongoConnection, 'mongodb');
module.exports = manager;

/***/ }),

/***/ "./server/models/mongodb/mainModel.js":
/*!********************************************!*\
  !*** ./server/models/mongodb/mainModel.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class MainModel {
  constructor(model, additionalModel = false) {
    this.model = model;
    this.additionalModel = additionalModel;
  }
  get(params) {
    return new Promise((resolve, reject) => {
      this.model.find(params).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  getPages(params, fields = null) {
    let size = params.size ? parseInt(params.size) : 10000;
    let page = params.page ? parseInt(params.page) : 1;
    let query = params.query ? params.query : params;
    return new Promise((resolve, reject) => {
      this.model.find(query, fields).sort(params && params.sort ? params.sort : {
        'createdAt': -1
      }).limit(size).skip(size * (page - 1)).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  getCount(params) {
    let query = params.query;
    if (!params.query) {
      query = params;
    }
    return new Promise((resolve, reject) => {
      this.model.countDocuments(query).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  get_w_select(params, select) {
    return new Promise((resolve, reject) => {
      this.model.find(params).select(select).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  get_w_sort(params, select, sort) {
    return new Promise((resolve, reject) => {
      this.model.find(params).select(select).sort(sort).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  add(params) {
    return new Promise((resolve, reject) => {
      let modules = new this.model(params);
      modules.save(err => {
        if (err) {
          let message = JSON.stringify(err);
          if (message.includes('duplicate key error collection')) {
            var characters = 'ABCDEFGHIJKLMNOPQRTUVWXYZ0123456789';
            let isErr = false;
            /* create with random char
            if (message.includes('index: id_1 dup key')) {
              isErr = true
              params.id = params.id + characters.charAt(Math.floor(Math.random() * characters.length))
            }
            */
            if (isErr) {
              resolve(this.add(params));
            }
          }
          reject(err);
        } else {
          resolve(modules);
        }
      });
    });
  }
  update(params) {
    return new Promise((resolve, reject) => {
      this.model.updateMany(params.selector, {
        '$set': params.data
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  push(params) {
    return new Promise((resolve, reject) => {
      this.model.updateMany(params.selector, {
        '$push': params.data
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  pull(params) {
    return new Promise((resolve, reject) => {
      this.model.updateMany(params.selector, {
        '$pull': params.data
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  updateWithoutTime(params) {
    return new Promise((resolve, reject) => {
      this.model.updateOne(params.selector, {
        '$set': params.data
      }, {
        timestamps: false
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  updateMany(params) {
    return new Promise((resolve, reject) => {
      this.model.updateMany(params.selector, {
        '$set': params.data
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      this.model.findByIdAndRemove({
        _id: id
      }, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  deleteManyByParams(params) {
    return new Promise((resolve, reject) => {
      this.model.deleteMany(params, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  deleteByParams(params) {
    return new Promise((resolve, reject) => {
      this.model.deleteOne(params, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  updateBulk(params) {
    return new Promise((resolve, reject) => {
      this.model.bulkWrite(params, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  getSum(params, field) {
    return new Promise((resolve, reject) => {
      this.model.aggregate([{
        "$match": params
      }, {
        $group: {
          _id: null,
          total: {
            $sum: field
          }
        }
      }]).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.length ? result[0].total : 0);
      });
    });
  }
  getWithoutSort(params, fields = null) {
    return new Promise((resolve, reject) => {
      this.model.find(params, fields).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}
module.exports = MainModel;

/***/ }),

/***/ "./server/models/mongodb/schema/UserSchema.js":
/*!****************************************************!*\
  !*** ./server/models/mongodb/schema/UserSchema.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  Schema,
  model,
  Types
} = __webpack_require__(/*! mongoose */ "mongoose");
const Model = new Schema({
  name: String,
  phone: String,
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    default: 'user'
  },
  is_active: Boolean
}, {
  collection: 'users',
  timestamps: true
});
Model.index({
  email: 1
});
module.exports = Model;

/***/ }),

/***/ "./server/models/mongodb/user.js":
/*!***************************************!*\
  !*** ./server/models/mongodb/user.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! . */ "./server/models/mongodb/index.js").getConnection();
const MainModel = __webpack_require__(/*! ./mainModel */ "./server/models/mongodb/mainModel.js");
const User = mongoose.model('User', __webpack_require__(/*! ./schema/UserSchema */ "./server/models/mongodb/schema/UserSchema.js"));
class ModelClass extends MainModel {}
let model = new ModelClass(User);
module.exports = model;

/***/ }),

/***/ "./server/routes/auth.js":
/*!*******************************!*\
  !*** ./server/routes/auth.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");
const router = express.Router();
const {
  afterSignupAuth
} = __webpack_require__(/*! ../middleware/signupAuth */ "./server/middleware/signupAuth.js");
const auth = __webpack_require__(/*! ../controllers/authController */ "./server/controllers/authController.js");

// ======= ROUTE FOR /API/AUTH/ ============

router.post('/login', auth.login);
module.exports = router;

/***/ }),

/***/ "./server/routes/index.js":
/*!********************************!*\
  !*** ./server/routes/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");
const router = express.Router();
const auth = __webpack_require__(/*! ./auth */ "./server/routes/auth.js");
router.use('/auth', auth);
module.exports = router;

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "md5":
/*!**********************!*\
  !*** external "md5" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("md5");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "nuxt":
/*!***********************!*\
  !*** external "nuxt" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=main.map