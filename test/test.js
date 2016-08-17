'use strict';

var uploadDispatch = require('../');
var path = require('path');

var data = [
  './0.gif',
  '/1.gif',
  './1.png',
  path.join(__dirname, 'face.png'),
  '../index.js',
  './cj.swf'
];

data.forEach(function(item) {
  uploadDispatch.upload({
    files: item
  }, function(err, data) {
    if(err) {
      return console.log('上传失败，原因是：' + err);
    }
    if(data) {
      for(var k in data) {
        console.log('上传文件：' + k + ' 成功，cdn地址是：' + data[k]);
      }
    }
  });
});


