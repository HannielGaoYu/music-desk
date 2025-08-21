import axios from 'axios'
import {searchRequest,} from '..'

//获取轮播图
export const getBanner = (type = 5) => {
  return searchRequest.get({
    url: `/banner`,
    data: {
      type
    }
  })
}

//歌单检索
export const getPlayList = (id: number) => {
  return searchRequest.get({
    url: `/playlist/detail`,
    data: {
      id
    }
  })
}

// ?cat=${cat}&limit=${limit}&offset=${offset}
//顶级歌单
export const getTopPlayList = (cat: string, limit: number, offset: number) => {
  return searchRequest.get({
    url: `/top/playlist`,
    data: {
      cat,
      limit,
      offset
    }
  })
}

export const getHotPlayList = () => {
  return searchRequest.get({
    url: '/playlist/hot',
  })
}

export const getMusicSearchRes = (keywords: string, limit = 100) => {
  return searchRequest.get({
    url: '/cloudsearch',
    data: {
      keywords,
      limit,
    }
  })
}

// export const getMusicDetail = (ids: string, level = 'jymaster', type = 'json') => {
//   return analysisRequest.get({
//     url: '',
//     data: {
//       ids,
//       level,
//       type
//     }
//   })
// }

export const getMusicDetail = (ids: string, level = 'jymaster', type = 'json'): any => {
   return new Promise((resolve, reject) => {
    axios.get(`https://api.kxzjoker.cn/api/163_music?ids=${ids}&level=${level}&type=${type}`)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
   })
}