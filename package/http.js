import axios from 'axios'
import _this from '@/main.js'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL }} = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) window.localStorage.setItem('error_logs', info)
}

const dealError = function(error) {
  if (error.response.data.status == -2) {
    _this.$Message.error('无效token,请重新登录')
    const jumpToLoginUrl = error.response.data.data + '?redirect=http://' + window.location.host
    window.location.href = jumpToLoginUrl
  } else {
    _this.$Message.error('抱歉,获取数据似乎出现了问题')
  }
  return Promise.reject(error)
}

class HttpRequest {
  constructor(baseUrl = '/') {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      // token: window.sessionStorage.getItem('token'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // 隐藏加载效果
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      if (!Object.keys(this.queue).length) {
        // 可添加加载效果
      }
      this.queue[url] = true
      return config
    }, error => {
      return dealError(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      // _this.$Message.success('This is an success tip');
      // 根据需求只返回所需的

      if (res.data.status == '-1') {
        _this.$Message.error(res.data.msg || '抱歉,获取数据似乎出现了问题')
        return
      }
      return res.data
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return dealError(error)
    })
  }
  request(options) {
    const instance = axios.create({
      timeout: 30000
    })
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const baseUrl = ''

const _axios = new HttpRequest(baseUrl)
export default _axios
