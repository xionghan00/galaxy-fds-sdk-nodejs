const crypto = require('crypto');
const moment = require('moment')
const request = require('axios')
const { URL } = require('url')
const Common = require('./common')


function getSignature(stringToSign, secretKey) {
  const sha1Sign = hmacBase64Sha1(stringToSign, secretKey)
  return sha1Sign;
}

function hmacBase64Sha1(encodedStr, sk) {
  const hmac = crypto.createHmac('sha1', sk);
  hmac.update(encodedStr);
  return hmac.digest('base64');
}



function getStringToSign(req) {
  let result = req.method.toUpperCase() + '\n'
  result += (req.headers[Common.CONTENT_MD5] || '') + '\n'
  result += (req.headers[Common.CONTENT_TYPE] || '') + '\n'
  let time = new Date().toGMTString() + '\n'
  result += time
  result += new URL(req.url).pathname
  return result
}

function getAuthorization(Access, Secret, req) {
  let stringToSign = getStringToSign(req)
  let signature = getSignature(stringToSign, Secret)
  return `Galaxy-V2 ${Access}:${signature}`
}

module.exports = getAuthorization

