import { BASE_URL_ANALYSIS, BASE_URL_SEARCH, TIME_OUT } from "./config";
import myRequest from './request'

export const searchRequest = new myRequest({
  baseURL: BASE_URL_SEARCH,
  timeout: TIME_OUT,
  // interceptors: {
  //   requestSuccessFn: (config) => {
  //     // 每一个请求都自动携带token
  //     const token = localCache.getCache(LOGIN_TOKEN)
  //     if (config.headers && token) {
  //       // 类型缩小
  //       config.headers.Authorization = 'Bearer ' + token
  //     }
  //     return config
  //   }
  // }
})

export const analysisRequest = new myRequest({
  baseURL: BASE_URL_ANALYSIS,
  timeout: TIME_OUT,
  // interceptors: {
  //   requestSuccessFn: (config) => {
  //     // 每一个请求都自动携带token
  //     const token = localCache.getCache(LOGIN_TOKEN)
  //     if (config.headers && token) {
  //       // 类型缩小
  //       config.headers.Authorization = 'Bearer ' + token
  //     }
  //     return config
  //   }
  // }
})