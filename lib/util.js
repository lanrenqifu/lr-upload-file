/**
 * @file 工具模块
 * @type {exports}
 */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var fileUtil = require('lr-util-file');
var pathUtil = require('path');

var util = {

  /**
   * @desc 获取文件内容
   * @param path
   * @return String
   */
  getFileContent: function(path) {
    if(fileUtil.isFile(path)) {
      if(fileUtil.isImage(path)) {
        return urlencode(_.trim(fs.readFileSync(path, 'binary')));
      } else if(/\.(?:js|css)$/ig.test(path)) {
        return {
          type: pathUtil.extname(path).slice(1),
          code: fs.readFileSync(path, 'utf8')
        }
      } else {
        return {
          type: pathUtil.extname(path).slice(1),
          code: fs.readFileSync(path, 'base64')
        }
      }
    } else if(fileUtil.isUrl(path)) {
      return path;
    }
    return null;
  },

  /**
   * @desc rawurlencode
   */
  rawurlencode: function(str) {
    str = (str+'').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27')
      .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
  }
};

/**
 * @desc urlencode
 */
function urlencode(str) {
  return escape(str).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A')
    .replace(/\//g, '%2F').replace(/@/g, '%40');
}

module.exports = util;