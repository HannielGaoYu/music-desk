<template>
  <div class="play">
    <div class="top" style="box-sizing: border-box; padding: 20px;">
      <top-bar type="play" color="white" size="20"></top-bar>
    </div>
    
    <div class="bg-img">
      <img v-lazy="musicDetail?.pic" alt="" style="width: 100%;height: 100%;">
    </div>
    <div class="bg-cover"></div>
    <div class="song-info">
      <span>{{ musicDetail.name }}-{{ musicDetail?.ar_name }}</span>
    </div>
    <div class="album" @click="handleBack">
      <img v-lazy="musicDetail?.pic" alt="" style="width: 100%; aspect-ratio: 1/1;">
    </div>
    <div class="song-word" ref="songWordRef" @mouseenter="handleEnter" @mouseleave="handleAutoMove" @scroll="handleMove">
      <template v-for="(item, index) in parseLyric(musicDetail?.lyric)">
        <div :class="`item ${wordIndex === index ? 'active' : ''}`" @click="handleChangeSongPeocess(item.time, index)">{{item.text}}</div>
      </template>
    </div>
    <div class="process-word" 
      v-if="showSignWord && stopAutoScroll"
      @mouseenter="handleSignShow"
      style=""
    >
      <img 
        src="../../assets/img/paly/右.png" 
        alt="" 
        class="right" 
        style="width: 30px; height: 20px;"
      >
      <img 
        src="../../assets/img/paly/左.png" 
        alt="" 
        class="right" 
        style="width: 30px;
        height: 20px;"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useMainStore} from '../../store/main/index'
import { storeToRefs } from 'pinia'
import { foundSongWord, parseLyric } from '../../utils/tools'
import { eventBus } from '../../event-bus'
import { onMounted, onUnmounted, ref } from 'vue'
import TopBar from '../../components/top-bar.vue'

onUnmounted(() => {
  eventBus.off("song-time")
})

onMounted(() => {
  songWordRef.value.scrollBy({top: wordIndex.value*50, behavior: 'smooth'})
  setTimeout(() => {
    handleWordMatch()
  }, 300)
})

interface IRWord {
  text: string,
  time: number
}

const songWordRef = ref()
const wordIndex = ref<number>(0)
const scrollDistance = ref<number>(0)
const stopAutoScroll = ref<boolean>(false)
const showSignWord = ref<boolean>(false)
const mainStore = useMainStore()
const { musicDetail } = storeToRefs(mainStore)
const wordList = ref<IRWord[]>([])

// watch(scrollDistance, (newValue, oldValue) => {
//   if (newValue - oldValue > 51) {
//     stopAutoScroll.value = true
//   } 
// })

// setInterval(() => {
//   let v = scrollDistance.value
//   setTimeout(() => {
//     if (v === scrollDistance.value) {
//       stopAutoScroll.value = false
//     }
//   }, 2500)
// }, 300)


const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleWordMatch = () => {
  eventBus.on("song-time", (currentTime: any) => {
    wordList.value = parseLyric(musicDetail.value?.lyric)
    const index = foundSongWord(wordList.value, currentTime * 1000)
    wordIndex.value = index
    scrollDistance.value = songWordRef.value.scrollTop
    if (!stopAutoScroll.value) {
      songWordRef.value.scrollTo({top: index*50, behavior: 'smooth'})
    }
  })
}

const handleEnter = () => {
  stopAutoScroll.value = true
  showSignWord.value = true
}

const handleMove = () => {
  showSignWord.value = true
}

const handleAutoMove = () => {
  stopAutoScroll.value = false
}

const handleSignShow = () => {
  stopAutoScroll.value = true
  showSignWord.value = true
}

const handleChangeSongPeocess = (time: number, index: number) => {
  if (Math.abs(index * 50 - songWordRef.value.scrollTop) <= 25) {
    eventBus.emit("change-song-process", time)
  }
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
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
    }
    .song-info {
      position: absolute;
      top: 6%;
      right: 5%;
      width: 50%;
      text-align: center;
      color: #fff;
      font-size: 22px;
      font-weight: 600;
      overflow:hidden;
      word-wrap: break-word;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      line-clamp:2;
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
      left: 40%;
      top: 13.5%;
      width: 60%;
      height: 73%; 
      // background-color: #295;
      transition: all 0.2s ease-in;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .item {
        color: #aaa;
        font-size: 19px;
        width: 60%;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        margin: 0 auto;
        text-align: center;
        font-weight: 500;
        overflow: hidden;
        white-space: 1;
        text-overflow: ellipsis;
        transition: all 0.2s ease-in;
        &:first-of-type {
          margin-top: 30%;
        }
        &:last-of-type {
          margin-bottom: 70%;
        }
      }
      .item.active {
        color: #fff;
        font-weight: 600;
      }
    }
    .process-word {
      position: absolute; 
      top: 44.6%; 
      left: 45%;
      width: 50%;
      display: flex; 
      justify-content: space-between;
      align-items: center;
      vertical-align: top; 
      z-index: -1;
    }
  }
</style>