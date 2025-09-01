<template>
  <div class="song-list-item" :style="`width: ${width}px; height: ${height}px`">
    <div class="left">
      <img 
        v-lazy="album"
        class="album"
        
      />
      <div class="song-info">
        <div class="song-name">{{ name }}-{{ 999 }}</div>
        <div class="song-ar">{{ ar }}</div>
      </div>
    </div>
    <div class="right" >
      <img 
        :src="`${likeState ? likeActive : like}`" 
        alt="" 
        class="like"
      >
      <img src="../assets/img/play-bar/下载.png" alt="" class="download">
      <img src="../assets/img/play-bar/删除.png" alt="" class="delete">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import like from '../assets/img/play-bar/喜欢1.png'
import likeActive from '../assets/img/play-bar/喜欢2.png'

const {album, name, ar, width, height} = defineProps(["album", "name", "ar", "ids", "id", "width", "height"])

const likeState = ref<boolean>(false)
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
        height: 30%;
        aspect-ratio: 1/1;
      }
    }
  }
</style>