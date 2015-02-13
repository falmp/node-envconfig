#!/usr/bin/node --harmony

var envconfig = require('./envconfig')
  , path = require('path');

var config = envconfig.load(path.join(__dirname, '/config.yml'), { environmentPrefix: 'APP__' });

console.log('key1:', config.key1);
console.log('parent.key2:', config.parent.key2);