import axios from '../package/http.js'

export default async(cb) => {
  await axios
    .request({
      url: '/user/login',
      method: 'post',
      data: {
        username: '张一',
        password: '123456'
      }
    })
    .then((res) => {
      window.sessionStorage.setItem('token', res.data)
    })

  await axios
    .request({
      url: '/flowable/definition/userGroup',
      method: 'get'
    })
    .then((res) => {
      window.sessionStorage.setItem('userGroup', JSON.stringify(res.data))
    })

  await axios
    .request({
      url: '/flowable/definition/userList',
      method: 'get'
    })
    .then((res) => {
      window.sessionStorage.setItem('userList', JSON.stringify(res.data))
    })
  await cb()
}
