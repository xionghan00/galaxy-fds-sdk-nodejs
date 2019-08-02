const path = require('path')
const FDS = require('./index')

let arg = process.argv

const localFilePath = arg[2]
const id = arg[3]
const key = arg[4]
const endpoint = arg[5]
const bucketName = arg[6]

let fds = new FDS(id, key, endpoint)

fds.putDir(bucketName, localFilePath)
