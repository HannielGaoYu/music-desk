<template>
  <div class="play">
    <div class="bg-img">
      <img v-lazy="musicDetail?.pic" alt="" style="width: 100%;height: 100%;">
    </div>
    <div class="bg-cover"></div>
    <div class="album" @click="handleBack">
      <img v-lazy="musicDetail?.pic" alt="" style="width: 100%; aspect-ratio: 1/1;">
    </div>
    <div class="song-word">
      <template v-for="(item) in parseLyric(musicDetail.lyric)">
        <div class="item">{{item.text}}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useMainStore} from '../../store/main/index'
import { storeToRefs } from 'pinia'
import { parseLyric } from '../../utils/tools'

const mainStore = useMainStore()
const { musicDetail } = storeToRefs(mainStore)
const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
  .play {
    position: relative;
    color: #000;
    width: 100%;
    height: 100vh;
    z-index: 0;
    background-repeat: no-repeat;
    .bg-cover, .bg-img {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .bg-cover {
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
    }
    .album {
      position: absolute;
      left: 10%;
      top: 23%;
      width: 26%;
      aspect-ratio: 1/1;
    }
    .song-word {
      position: absolute;
      left: 45%;
      top: 6%;
      width: 55%;
      aspect-ratio: 1/1;
      // background-color: #295;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .item {
        color: #aaa;
        font-size: 15px;
        width: 55%;
        margin: 0 auto;
        text-align: center;
        margin-bottom: 30px;
        font-weight: 600;
      }
    }

  }
</style>