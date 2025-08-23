<template>
  <transition name="run">
    <div class="album-cover" @click="handleClick">
      <img class="album" 
        v-lazy="album" 
        alt="" 
        :style="big === 'true' ? 'aspect-ratio: 2.14/1;' : '' "
      >
      </img>
      <div class="cover" v-if="cover === 'true'"></div>
      <div class="play-icon-left">
        <img src="../assets/img/main-right/播放.png" v-if="icon === 'left'" alt="" class="icon-left">
      </div>
      <img class="play-icon-center" v-if="icon === 'center'" src="../assets//img/main-right/播放中间.png"></img>
    </div>
  </transition>
  <div class="album-text" @click="handleClick" style="font-size: 12px; color: #fff;">{{ text }}</div>
</template>

<script setup lang="ts">
  import {eventBus} from '../event-bus/index'
  const { icon, big, cover, album, text, ids } = defineProps(['icon', 'big', 'cover', 'album', 'text', 'ids'])
  
  const emit = defineEmits(["album-click"])

  const handleClick = () => {
    emit("album-click")
    eventBus.emit("album-click", ids)
  }
</script>

<style scoped lang="less">
  .album-cover {
    color: #737373;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease; 
    &:hover {
      transform: translateY(-10px);
      .cover {
        background-color: rgba(0, 0, 0, .5);
        transition: background-color 0.3s ease;
      }
      .play-icon-left {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }
  .album {
    width: 100%;
    aspect-ratio: 1/1;
    // width: 150px;
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    aspect-ratio: 1/1;

    
    z-index: 200;
  }
  .play-icon-left {
    position: absolute;
    bottom: 12%;
    left: 12px;
    display: flex;
    opacity: 0;
    justify-items: center;
    width: 26px;
    height: 16px;
    line-height: 16px;
    border-radius: 18px;
    background-color: #00f168;
  }
    .icon-left {
      width: 14px;
      height: 16px;
      margin: 0 auto;
    }
    .play-icon-center {
      position: absolute;
      top: 36%;
      left: 33%;
      width: 32px;
      height: 32px;
    }

    .run-enter-active,
  .run-leave-active {
    /* 移除 transform 和 opacity 的过渡 */
    transition: none; 
  }
  
  .run-enter-from,
  .run-leave-to {
    opacity: 0;
    transform: translateY(20px); /* 调整初始位置更自然 */
  }
  
  .run-enter-to,
  .run-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .album-text {
    margin-bottom: 20px;
  }
</style>