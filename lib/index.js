/**
 * @file 模块入口
 */

'use strict';

var


  /**
   * @desc 上传静态文件模块
   * @type {upload|exports}
   */
  fileUploader = require('./file-upload'),

  /**
   * @desc 负责输出信息的模块
   */
  DEBUG = require('lr-util-debug'),

  /**
   * @desc 工具模块
   * @type {upload|exports}
   */
  util = require('./util'),

  /**
   * @desc file util
   * @type {debug|exports}
   */
  fileUtil = require('lr-util-file'),

  /**
   * @desc md5方法
   * @type {upload|exports}
   */
  md5 = require('blueimp-md5').md5,

  /**
   * @desc cache 缓存部分
   * @type {upload|exports}
   */
  cache = require('./cache');

/**
 * @desc 上传
 * @param puburl 上传远程地址
 * @param opts 传入的参数
 * @param func 回调函数
 * @returns {launcher}
 */
var launcher = function(puburl, opts, param, func) {
  var that = this;
  if(!(this instanceof launcher)) return new launcher(opts, func);

  if(!puburl) {
    return DEBUG.warn('木有告诉上传地址 母鸡上传到哪里去。。。');
  }

  if(!func) {
    return DEBUG.warn('木有回调函数 上传文件的地址肿么告诉你。。。');
  }
  if(!opts.files) {
    return DEBUG.error('传入的上传文件地址为空');
  }

  this.puburl = puburl;

  this.file = opts.file;

  this.fileUploader = fileUploader;
  this.files = fileUtil.isFile(opts.files) ? opts.files : opts.files.replace(/^\//, './');
  var key,

    url = util.getFileContent(this.files);

  if(!url) {
    return DEBUG.error('传入的上传文件: ' + this.files + ' 地址不存在');
  }

  key = (typeof url != 'string') ? md5(url.code + '|' + url.type) : md5(url);

  cache.find(key)
    .then(function(data) {
      if(data && data['url'] && fileUtil.isUrl(data['url'])) {
        var result = {};
        result[this.files] = data['url'];
        func.apply(this, [null, result]);
      } else {
        throw new Error("Get cache fail!");
      }
    }.bind(this))
    .catch(function() {
      var uploader = this.fileUploader;
      this._tryUpload(puburl, uploader, param, func || function() {});
    }.bind(this));
}

var p = launcher.prototype;

/**
 * @desc 上传文件
 * @param uploader {Uploader} 上传模块
 * @param path {String} 如果是url地址 传入的就是url地址 否则则是图片的内容
 * @param func {Function} 上传后的回调函数
 * @private
 */
p._tryUpload = function(uploader, param, func) {
  return uploader.proc(this.puburl, this.file, param)
    .then(function(url) {
      if(fileUtil.isUrl(url)) {
        var result = {};
        result[this.files] = url;
        var key = (typeof path != 'string') ? md5(path.code + '|' + path.type) : md5(path);
        cache.insert(key, url)
          .then(function() {
            func.apply(this, [null, result]);
          }.bind(this));
      } else {
        throw new Error('Get url error!');
      }
    }.bind(this))
    .catch(function(msg) {
      msg = (typeof msg == 'string') ? msg : (msg.message ? msg.message : '未知错误');
      DEBUG.error('传入的上传文件: ' + this.files + ' 上传失败! 原因是: ' + msg);
      func.apply(this, [msg, null]);
    }.bind(this));
}

module.exports = launcher;