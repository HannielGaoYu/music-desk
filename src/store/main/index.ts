import {defineStore} from 'pinia'
import {getBanner, getPlayList, getTopPlayList, getMusicSearchRes, getMusicDetail, getHotPlayList} from '../../service/main/music'

interface IMainState {
  banner: any[],
  playList: any[]
  topPlayList: any[]
  musicSearchRes: any[]
  musicDetail: any
  hotPlayList: any[]
}

export const useMainStore = defineStore('main',{
  state: (): IMainState => ({
    banner: [],
    playList: [],
    topPlayList: [],
    musicSearchRes: [],
    musicDetail: {},
    hotPlayList: []
  }),
  getters: {},
  actions: {
    async fetchBanner() {
      const res = await getBanner()
      this.banner = res.data.banners
    },
    async fetchPlayList(id: number) {
      const res = await getPlayList(id)
      this.playList = res.data.playlist.tracks
    },
    // cat=全部&limit=6&offset=0
    async fetchTopPlayList(cat: string, limit: number , offset: number) {
      const res = await getTopPlayList(cat, limit, offset)
      this.topPlayList = res.data.playlists
    },
    async fetchMusicSearchRes(keywords: string) {
      const res = await getMusicSearchRes(keywords)
      this.musicSearchRes = res
    },
    async fetchMusicDetail(ids: string, level: string, type: string) {
      const res = await getMusicDetail(ids, level, type)
      this.musicDetail = res.data
    },
    async fetchHotPlayList() {
      const res = await getHotPlayList()
      this.hotPlayList = res.data.tags
    }
  }
})