import axios from 'axios'

export function login (username, password) {
  let params = new FormData()
  params.append('username', username)
  params.append('password', password)

  return axios({
    method: 'POST',
    url: 'http://192.168.151.66:12354/userlogin/',
    data: params,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function (res) {
    return res.data
  })
}

export function logout (token) {
  let params = new FormData()
  params.append('token', token)

  return axios({
    method: 'POST',
    url: 'http://192.168.151.66:12354/userlogout/',
    data: params,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function (res) {
    return res.data
  })
}
