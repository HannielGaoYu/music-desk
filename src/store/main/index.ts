import {defineStore} from 'pinia'
import {getBanner, getPlayList, getTopPlayList, getMusicSearchRes, getMusicDetail} from '../../service/main/music'

interface IMusiclikeInfo {
  data: any[]
  lastSong: any
}

interface IMainState {
  banner: any[]
  playList: any[]
  topPlayList: any[]
  musicSearchRes: any
  musicDetail: any
  hotPlayList: any[]
  playListInfo: any
  musicLikeInfo: IMusiclikeInfo
}

export const useMainStore = defineStore('main',{
  state: (): IMainState => ({
    banner: [],
    playList: [],
    topPlayList: [],
    musicSearchRes: {},
    musicDetail: {},
    hotPlayList: [],
    playListInfo: {},
    musicLikeInfo: {
      data: [],
      lastSong: {}
    }
  }),
  getters: {},
  actions: {
    async fetchBanner() {
      const res = await getBanner()
      this.banner = res.data.banners
    },
    async fetchPlayList(id: number) {
      this.playList = []
      const res = await getPlayList(id)
      this.playList = res.data.playlist.tracks
      this.playListInfo = res.data.playlist
      this.playListInfo.tracks = []
    },
    async fetchHotPlayList(id = 3778678) {
      const res = await getPlayList(id)
      this.hotPlayList = res.data.playlist.tracks
    },
    // cat=全部&limit=6&offset=0
    async fetchTopPlayList(cat: string, limit: number , offset: number) {
      const res = await getTopPlayList(cat, limit, offset)
      this.topPlayList = res.data.playlists
    },
    async fetchMusicSearchRes(keywords: string, count: number) {
      const res = await getMusicSearchRes(keywords, count)
      this.musicSearchRes = res.data.result
    },
    async fetchMusicDetail(ids: string, level: string, type: string) {
      const res = await getMusicDetail(ids, level, type)
      this.musicDetail = res.data
    },
  }
})