<template>
  <div class="song-box" @click="handleHotSongClick">
    <img 
      v-lazy="album" 
      alt="" 
      class="left"
      loading="lazy"
    >
    <div class="right">
      <div class="song-info">
        <div class="song-name">{{ name }}</div>
        <div class="tag"></div>
      </div>
      <div class="song-ar">{{ ar }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {eventBus} from '../event-bus'
const {album, name, ar, ids} = defineProps(["album", "name", "ar", "ids"])


const handleHotSongClick = () => {
  eventBus.emit("song-click", {ids, type: "hot-playlist"})
}
</script>

<style scoped lang="less">
  .song-box {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 6px;
    height: 68px;
    cursor: pointer;
    &:hover {
      background-color: #333;
    }
    .left {
      width: 56px;
      height: 56px;
    }
    .right {
      height: 90%;
      margin-top: -10px;
      margin-left: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .song-info {
        color: #f1f1f1;
        font-size: 13px;
      }
      .song-ar {
        color: #aaa;
        font-size: 10px;
      }
    }
  }
</style>