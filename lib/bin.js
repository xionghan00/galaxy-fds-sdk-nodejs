const path = require('path')
const FDS = require('./index')

let arg = process.argv
let fds = new FDS(arg[3], arg[4], arg[5])

fds.putDir(arg[6], arg[2])
