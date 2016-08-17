/**
 * @file 上传静态文件模块
 */

var
    /**
     * @desc q
     */
    q = require('q'),

    /**
     * @desc request
     */
    request = require('request'),

    formstream = require('formstream');

/**
 *
 * @param puburl 上传地址
 * @param opt 可选参数
 * @returns {promise}
 */
function proc(puburl, file, opt) {
    var deferred = q.defer();

    var form = formstream();
    var data = opt.data || {};
    for (var key in data) {
        var value = data[key];
        if (typeof value === 'function') {
            form.field(key, value(file));
        } else {
            form.field(key, data[key]);
        }
    }

    form.file('file', file.path);

    request({
        url: puburl,
        method: 'POST',
        headers: form.headers(),
        stream: form
    }, function (error, response, body) {

        if (error || response.statusCode !== 200) {
            return deferred.reject(error || new Error('statusCode: ' + response.statusCode))
        }
        try {
            body = JSON.parse(body)
        } catch (e) {
            return deferred.reject(e);
        }
        var errno = body.errno | 0;
        if (errno) {
            return deferred.reject(new Error(body.errmsg));
        }
        var cdnUrl = body.result;
        deferred.resolve(cdnUrl);
    })
    return deferred.promise;
}

module.exports = {
    proc: proc
}