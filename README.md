# galaxy-fds-sdk-nodejs
## demo 
```
const id = 'your id'
const key = 'your secrect key'
let fds = new FDS(id,key, url) // url 机房

// 查看buckets列表
fds.listBuckets((data) => {
  console.log(data)
}).catch(a => {
  console.log('error happend')
})

// 查看某buckect下所有objects
fds.listObjects(bucket_name,(res) => {
  console.log(res.data)
})

// 文件重命名
fds.renameObject(bucket_name,src_object_name,dst_object_name,cb)

// 上传文件
fds.putObject(bucket_name,object_name,'file content',cb)

// 删除文件
fds.deleteObjects(bucket_name,object_name,cb)
```

## webpack 
```

module.exports = {
    entry:{
        index: './a.js'
    }
    output:{
        filename:'js/a.js'
    } 
    plugins: [
        new MiFdsWebpackPlugin({
          id,
          key,
          url,
          bucket
        })
      ]
}
```

## gitlabci
```
build:
  stage: build
  only:
  - master
  - tags
  script:
  - npm config set @mi:registry http://registry.npm.pt.mi.com/
  - npm install
  - npm run build # / dist
  - node /node_modules/galaxy-fds-sdk-nodejs/lib/bin.js dist $id $key $machine
```
