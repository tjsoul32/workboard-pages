import axios from 'axios'

export default function (uri, method, params, success, msg = '') {
  method = method.toLowerCase()
  return axios({
    method: method,
    url: 'http://192.168.151.66:12354' + uri.trim(),
    data: method === 'post' || method === 'put' ? params : null,
    params: method === 'get' || method === 'delete' ? params : null,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(success)
  .catch(function (err) {
    if (msg) {
      console.log(err)
      console.log(msg)
    }
    return false
  })
}
