import axios from 'axios'
import type {AxiosInstance} from 'axios'
import {RequestConfig} from './type.ts'

class myRequest {
  instance: AxiosInstance
  config: any
  constructor(config: RequestConfig) {
    this.instance = axios.create(config)
    this.config = config
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (config) => {
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    )
  }

  request<T = any>(config: RequestConfig<T>) {
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    return new Promise<T>((resolve, reject) => {
      this.instance.request<any, T>(config)
      .then(res => {
        if (config.interceptors?.responseSuccessFn) {
          res = config.interceptors.responseSuccessFn(res)
        }
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  get<T = any>(config: RequestConfig<T>) {
    config.url += '?'
    for (let item in config.data) {
      config.url += `${item}=${config.data[item]}&`
    }
    config.url = config.url?.slice(0, config.url.length - 1)
    config.data = {}
    return this.request({...config, method: 'GET'})
  }

  post<T = any>(config: RequestConfig<T>) {
    return this.request({...config, method: 'POST'})
  }
}

export default myRequest