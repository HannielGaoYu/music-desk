let BASE_URL_SEARCH = ''
let BASE_URL_ANALYSIS = ''
if (import.meta.env.PROD) {
  BASE_URL_SEARCH = 'http://codercba.com:9002'
  BASE_URL_ANALYSIS = 'https://api.kxzjoker.cn/api/163_music'
} else {
  BASE_URL_SEARCH = 'http://codercba.com:9002'
  BASE_URL_ANALYSIS = 'https://api.kxzjoker.cn/api/163_music'
}

export const TIME_OUT = 10000
export {BASE_URL_SEARCH, BASE_URL_ANALYSIS}