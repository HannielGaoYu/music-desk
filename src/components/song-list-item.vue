<template>
  <div class="song-list-item" :style="`width: ${width}px; height: ${height}px`">
    <div class="left">
      <img 
        v-lazy="album"
        class="album"
        @click="handleSongClick"
      />
      <div class="song-info">
        <div class="song-name">{{ name }}</div>
        <div class="song-ar">{{ ar }}</div>
      </div>
    </div>
    <div class="right" >
      <img 
        :src="`${likeState ? likeActive : like}`" 
        alt="" 
        class="like"
        @click="handleFavorSong"
      >
      <img src="../assets/img/play-bar/下载.png" alt="" class="download">
      <img src="../assets/img/play-bar/删除.png" alt="" class="delete">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import like from '../assets/img/play-bar/喜欢1.png'
import likeActive from '../assets/img/play-bar/喜欢2.png'
import { eventBus } from '../event-bus'
import { useMainStore } from '../store/main'
import { useRoute } from 'vue-router'

const ipcRenderer = window.ipcRenderer

const mainStore = useMainStore()
const {musicLikeInfo} = mainStore

const {album, name, ar, ids, id, width, height} = defineProps(["album", "name", "ar", "ids", "id", "width", "height"])

const likeState = ref<boolean>(false)
const emit = defineEmits(["song-click"])
const route = useRoute()

onMounted(() => {
  for (let item of musicLikeInfo?.data) {
    if (item.ids === ids) {
      likeState.value = true
    }
  }
})

const handleSongClick = (e: Event) => {
  eventBus.emit("song-click", {ids, id})
  emit("song-click")
  e.stopPropagation()
}

const handleFavorSong = async () => {
  if (route.path === "/main/songs-favor") {
    likeState.value = true
    for (let index in musicLikeInfo?.data) {
      if (musicLikeInfo?.data[index].ids === ids) {
        musicLikeInfo?.data.splice(parseInt(index), 1)
      }
    }
    ipcRenderer.invoke("like-info", JSON.stringify(musicLikeInfo))
    return
  } else {
    if (likeState.value) {
      for (let index in musicLikeInfo?.data) {
        if (musicLikeInfo?.data[index].ids === ids) {
          musicLikeInfo?.data.splice(parseInt(index), 1)
        }
      }
      likeState.value = !likeState.value
      ipcRenderer.invoke("like-info", JSON.stringify(musicLikeInfo))
      return
    }
    musicLikeInfo?.data.unshift({album, name, ar, ids, id, width, height})
    ipcRenderer.invoke("like-info", JSON.stringify(musicLikeInfo))
    likeState.value = !likeState.value
  }

}
</script>

<style scoped lang="less">
  .song-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 3px 5px;
    font-size: 12px;
    .left {
      height: 100%;
      display: flex;
      align-items: center;
      .album {
        height: 100%;
        aspect-ratio: 1/1;
      }
      .song-info {
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 6px;
        .song-name {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; 
        }
        .song-ar {
          font-size: 10px;
        }
      }
    }
    .right {
      height: 100%;
      display: flex;
      align-items: center;
      .like, .download, .delete {
        height: 36%;
        aspect-ratio: 1/1;
        margin-right: 10px;
      }
    }
  }
</style>