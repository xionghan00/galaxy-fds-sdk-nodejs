const mime = require('mime');
const dirTree = require("directory-tree")
const fs = require('fs')
const getAuthorization = require('./authorization')
const Common = require('./common')
const request = require('axios')
const path = require('path')

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
    return this.request.get(`http://${this.url}`).then(cb).catch(e => {
      throw new Error(e)
    })
  }
  listObjects(bucketName,cb){
    return this.request.get(`http://${this.url}/${bucketName}?prefix=&delimiter=/`).then(cb)
  }
  renameObject(bucketName,srcObjectName,dstObjectName,cb) {
    return this.request({
      url: `http://${this.url}/${bucketName}/${srcObjectName}?renameTo=${dstObjectName}`,
      method: 'put',
      headers:{
        "content-type": mime.getType(getFileExt(dstObjectName))
      }
    }).then(cb).catch(e => {
      throw new Error(e)
    })
  }
  putObject(bucketName,objectName,data,cb) {

    return this.request({
      url: `http://${this.url}/${bucketName}/${objectName}`,
      data,
      method: 'put',
      headers:{
        "content-type": mime.getType(getFileExt(objectName))
      }
    }).then(cb).catch(e => {
      throw new Error(e)
    })

  }
  deleteObject(bucketName,objectName,cb) {
    return this.request({
      url: `http://${this.url}/${bucketName}/${objectName}`,
      method: 'delete',
    }).then(cb).catch(e => {
      throw new Error(e)
    })
  }
  putDir(bucketName, dist){
    const base = process.cwd()
    const dir = path.join(base,dist) + '/'
    const tree = dirTree(dir)
    const uploadArrFile = (arr) => {
      arr.forEach(item => {
        if(item.type === 'directory') {
          uploadArrFile(item.children)
        } else {
          this.putObject(bucketName, item.path.replace(dir, ''), fs.readFileSync(item.path).toString()).then(res => {
            console.log(res.config.url)
          })
        }
      })
    }
    uploadArrFile(tree.children)
  }

  putFile(bucketName, filePath) {
    let absolutePath
    if (filePath.startsWith('/')) {
      absolutePath = filePath
    } else {
      absolutePath = path.join(process.cwd(), filePath)
    }

    if (!fs.existsSync(absolutePath)) {
      console.log(`[ERROR]file path ${absolutePath} not exists.`)
      return
    }

    const isDir = (p) => {
      return fs.statSync(p).isDirectory();
    }

    const uploadFile = (fullPath, basePath) => {
      let p = fullPath.replace(basePath, '')

      this.putObject(bucketName, p, fs.readFileSync(fullPath).toString()).then(res => {
        console.log(`[INFO]upload file success fullPath: ${fullPath}, to path: ${p}`)
      })
    }

    const uploadDir = (fullPath, basePath) => {
      dirTree(fullPath).children.forEach(item => {
        if(item.type === 'directory') {
          uploadDir(item.path, basePath)
        } else {
          uploadFile(item.path, basePath)
        }
      })
    }

    let p = absolutePath.lastIndexOf('/')
    const basePath = absolutePath.slice(0, p + 1)
    console.log('[INFO]upload file base path: ' + basePath)


    if (!isDir(absolutePath)) {
      uploadFile(absolutePath, basePath)
      return
    } else {
      uploadDir(absolutePath, basePath)
    }
  }
}
module.exports = Index
