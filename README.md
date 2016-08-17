# lr-upload-file - 将文件发送至cdn的组件

一个发送上文件cdn的组件，能够接受一个本地文件地址或者线上地址，在文件上传成功后本地会留下缓存

## A Simple Example
可以直接这样调用
```js
var uploadDispatch = require('lr-upload-image');
uploadDispatch.upload(puburl, {
  files: '1.gif'
}, function(err, data) {
  if(err) {
    return console.log('上传失败，原因是：' + err);
  }
  if(data) {
    for(var k in data) {
      console.log('上传图片：' + k + ' 成功，cdn地址是：' + data[k]);
    }
  }
});



