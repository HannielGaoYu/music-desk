<template>
  <div class="play">
    <div class="top" style="box-sizing: border-box; padding: 20px;">
      <top-bar type="play" color="white" size="20"></top-bar>
    </div>
    
    <div class="bg-img">
      <img v-lazy="musicDetail?.pic" alt="" style="width: 100%;height: 100%;">
    </div>
    <div class="bg-cover"></div>
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
      style="position: absolute; top: 47%; right: 8.8%; display: flex; align-items: center;vertical-align: top; z-index: -1;"
    >
      <img 
        src="../../assets/img/paly/右.png" 
        alt="" 
        class="right" 
        style="width: 30px;
        height: 20px; margin-right: 390px;"
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
      top: 6%;
      width: 60%;
      height: 80%; 
      // background-color: #295;
      transition: all 1s ease-in;
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
        transition: all 1s ease-in;
        &:first-of-type {
          margin-top: 40%;
        }
        &:last-of-type {
          margin-bottom: 40%;
        }
      }
      .item.active {
        color: #fff;
        font-weight: 600;
      }
    }

  }
</style>