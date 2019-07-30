
const getAuthorization = require('./authorization')
const Common = require('./common')
const request = require('axios')
const mime = require('mime')
function getFileExt (name) {
  let fileName = name.lastIndexOf(".");//取到文件名开始到最后一个点的长度
  let fileNameLength = name.length;//取到文件名长度
  let fileFormat = name.substring(fileName + 1, fileNameLength);//截
  return fileFormat
}

class Index {
  constructor(id,key,url) {
    this.id = id
    this.key = key
    this.url = url
    this.request = request
    this.request.interceptors.request.use((req) => {
      req.headers[Common.DATE] = new Date().toGMTString()
      let authorization = getAuthorization(id, key, req)
      req.headers[Common.AUTHORIZATION] = authorization
      return req
    })
    this.request.interceptors.response.use(res => {
      return res
    },err => {
      return Promise.reject(err)
    })

  }
  listBuckets(cb) {
    return this.request.get(`http://${this.url}`).then(cb)
  }
  listObjects(bucket_name,cb){
    return this.request.get(`http://${this.url}/${bucket_name}?prefix=&delimiter=/`).then(cb)
  }
  renameObject(bucket_name,src_object_name,dst_object_name,cb) {
    return this.request({
      url: `http://${this.url}/${bucket_name}/${src_object_name}?renameTo=${dst_object_name}`,
      method: 'put',
      headers:{
        "content-type":mime.getType(getFileExt(dst_object_name))
      }
    }).then(cb)
  }
  putObject(bucket_name,object_name,data,cb) {
    return this.request({
      url: `http://${this.url}/${bucket_name}/${object_name}`,
      data,
      method: 'put',
      headers:{
        "content-type": mime.getType(getFileExt(object_name))
      }
    }).then(cb)

  }
  deleteObject(bucket_name,object_name,cb) {
    return this.request({
      url: `http://${this.url}/${bucket_name}/${object_name}`,
      method: 'delete',
    }).then(cb)
  }
}
module.exports = Index
