const path = require('path')
const FDS = require('./index')

let arg = process.argv

const localFilePath = arg[2]
const id = arg[3]
const key = arg[4]
const endpoint = arg[5]
const bucketName = arg[6]

let fds = new FDS(id, key, endpoint)

// fds.putDir(bucketName, localFilePath)

/**
 * localFilePath支持以下几种格式
 * 1. 绝对路径file  ex. /home/work/app01/dist/20190805/main.js => ${fdsDir}/main.js
 * 2. 绝对路径directory本身  ex. /home/work/app01/dist/20190805 => ${fdsDir}/20190805/main.js
 * 3. 绝对路径directory下所有文件  ex. /home/work/app01/dist/20190805/  => ${fdsDir}/main.js
 * 4. 相对路径file  ex. dist/main.js => ${current dir}/dist/main.js
 * 5. 相对路径directory本身
 * 6. 相对路径directory下所有文件
 */
fds.putFile(bucketName, localFilePath)