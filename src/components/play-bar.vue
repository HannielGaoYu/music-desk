<template>
  <div class="play-bar" @click="handleCloseTab">
    <div class="line" :style="'width: ' + per + '%;'" ></div>
    <div class="bg-cover"></div>
    <div class="bg-img" >
      <img :src="musicDetail?.pic" alt="" style="width: 100%;height: 100%;">
    </div>
    <div class="main-bar">
      <div class="left" @click="handleNavSwitch">
        <img class="album" 
          loading="lazy"
          v-lazy="musicDetail?.pic !== undefined ? musicDetail?.pic : defaultPic" 
          style="width: 42px; height: 42px;margin-left: 10px;vertical-align: top;border-radius: 6%;"
        >
      </img>
        <div class="info">
          <div class="name">{{ musicDetail?.name }}</div>
          <div class="ar">{{ musicDetail?.ar_name }}</div>
        </div>
      </div>
      <div class="center" style="">
        <img class="like icon" src="@/assets/img/play-bar/喜欢.png" ></img>
        <img class="pre icon" src="@/assets/img/play-bar/last_one.png" @click.stop="handlePlayPre"></img>
        <img class="paruse icon" @click.stop="clickAudio()" :src="isPlay ? pauseIcon : playIcon" ></img>
        <img class="next icon" src="@/assets/img/play-bar/下一首.png" @click.stop="handlePlayNext"></img>
        <audio 
          ref="audio" 
          preload="auto"
          @timeupdate="handleAudioTime" 
          @ended="handlePlayNext"
        >
          <source :src="musicDetail?.url" preload="auto">
        </audio>       
      </div>
      <div class="right">
        <div class="time">{{ formatSongTime(currentTime) }} / {{ formatSongTime(duration) }}</div>
        <div class="level">
          <span 
            class="level-name" 
            :style="`color: ${levelNameColor};border-color: ${levelNameColor};`"
            @click.stop="handleChangeLevel"
          >
            {{ quality }}
          </span>
          <div class="levels-bar" v-if="isShowLevelBar" @click.stop="handleSongQuality">
            <div class="standard item" data-quality="standard">标准品质</div>
            <div class="exhigh item" data-quality="exhigh">HQ高品质</div>
            <div class="lossless item" data-quality="lossless">SQ无损品质</div>
            <div class="top-level">
              <div class="hires item" data-quality="hires">
                <div class="item-name" data-quality="hires">HIFI发烧品质</div>
                <div class="item-dec" data-quality="hires">发烧音质体验</div>
                <div class="size" data-quality="hires">{{ hiresSize }}</div>
                <img 
                  src="../assets/img/play-bar/ic_Hi-Res.png" 
                  alt="" class="quality-icon"
                  data-quality="hires"
                >
              </div>
              <div class="jyeffect item" data-quality="jyeffect">
                <div class="item-name" data-quality="jyeffect">高清环绕声</div>
                <div class="item-dec" data-quality="jyeffect">双耳环绕体验</div>
                <div class="size" data-quality="jyeffect">{{ jyeffectSize }}</div>
                <img 
                  src="../assets/img/play-bar/jyeffect音乐.png" 
                  alt="" 
                  class="quality-icon"
                  data-quality="jyeffect"
                >
              </div>
              <div class="sky item" data-quality="sky">
                <div class="item-name" data-quality="sky">沉浸环绕声</div>
                <div class="item-dec" data-quality="sky">双耳沉浸环绕体验</div>
                <div class="size" data-quality="sky">{{ skySize }}</div>
                <img 
                  src="../assets/img/play-bar/sky音乐.png" 
                  alt="" 
                  class="quality-icon"
                  data-quality="sky"
                >
              </div>
              <div class="jymaster item" data-quality="jymaster">
                <div class="item-name" data-quality="jymaster">超清母带</div>
                <div class="item-dec" data-quality="jymaster">还原声音细节</div>
                <div class="size" data-quality="jymaster">{{ jymasterSize }}</div>
                <img 
                  src="../assets/img/play-bar/jymaster音质.png" 
                  alt="" 
                  class="quality-icon"
                  data-quality="jymaster"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="word" @click.stop="handleChangeWordDisplay">
          <img :src="`${isShowWord ? songWordActiveIcon : songWordIcon}`" style="width: 30px;
          height: 30px; vertical-align: top;" alt="">
        </div>
        <div class="list" @click.stop="handleChangeSongListDisplay">
          <img :src="`${isShowList ? songListIconActive : songListIcon}`" style="width: 20px;
          height: 20px; vertical-align: top;" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  onActivated, onDeactivated, onUnmounted, ref } from 'vue';
import {useMainStore} from '../store/main/index'
import playIcon from '../assets/img/play-bar/播放.png'
import pauseIcon from '../assets/img/play-bar/暂停.png'
import { storeToRefs } from 'pinia';
import defaultPic from '../assets/data/profix.png'
import { eventBus } from '../event-bus';
import {formatSongTime} from '../utils/tools'
import { getMusicDetail } from '../service/main/music';

import songWordIcon from '../assets/img/play-bar/点歌_词_32.png'
import songWordActiveIcon from '../assets/img/play-bar/点歌_词_32 (1).png'

import songListIcon from '../assets/img/play-bar/音乐列表-copy.png'
import songListIconActive from '../assets/img/play-bar/音乐列表-copy2.png'
import { useRouter } from 'vue-router';

onUnmounted(() => {
  alert("hhh")
})

onDeactivated(() => {
  pause()
  plays()
})

onActivated(() => {
  pause()
  plays()
})

const songIds = ref<number>(0) 
const currentTime = ref<number>(0)
const duration = ref<number>(0)
const per = ref()
const songIndex = ref<number>(0)

const isShowLevelBar = ref<boolean>(false)
const quality = ref<string>("标准")
const qualitySelect = ref<string>("standard")
const levelNameColor = ref<string>("#bbb")
const hiresSize = ref<string>("")
const jyeffectSize = ref<string>("")
const skySize = ref<string>("")
const jymasterSize = ref<string>("")

const isShowWord = ref<boolean>(false)
const isShowList = ref<boolean>(false)

const mainStore = useMainStore()
const {musicDetail, playList} = storeToRefs(mainStore)

const router = useRouter()

setInterval(() => {
  eventBus.emit("song-time", currentTime.value)
}, 500)

eventBus.on("album-click", async(ids: any)=> {
  
  await mainStore.fetchMusicDetail(ids + "", qualitySelect.value, "json")
  audio.value.load()
  handleSongSize(ids)
  plays()
  songIds.value = ids
})

eventBus.on("song-click", async(songInfo: any) => {
  if (playList.value.length === 0) {
    songIndex.value = songInfo?.id
  }
  for (let i = 0; i < playList.value?.length; i++) {
      if (playList.value[i]?.id + "" === songInfo?.ids + "") {
        songIndex.value = i
      }
  }
  pause()
  await mainStore.fetchMusicDetail(songInfo?.ids + "",qualitySelect.value, "json")
  audio.value.load()
  handleSongSize(songInfo?.ids)
  plays()
  songIds.value = songInfo?.ids
})

eventBus.on("change-song-process", (time: any) => {
  audio.value.currentTime = time / 1000
})

const audio = ref()
const isPlay = ref<boolean>(false)
const plays = () => {
  if (audio.value) {
    audio.value.play()
    isPlay.value = true
  }
}

const pause = () => {
  if (audio.value) {
    audio.value.pause()
    isPlay.value = false
  }
} 

const clickAudio = () => {
  isPlay.value = !isPlay.value
  if (isPlay.value) {
    plays()
  } else {
    pause()
  }

}

const handleAudioTime = () => {
  currentTime.value = audio.value.currentTime
  duration.value = audio.value.duration
  per.value = (audio.value.currentTime / audio.value.duration) * 100
  console.log(per.value)
}

const handlePlayPre = async () => {
  songIndex.value -= 1
  pause()
  await mainStore.fetchMusicDetail(playList.value[songIndex.value]?.id + "", qualitySelect.value, "json")
  audio.value.load()
  plays()
  handleSongSize(playList.value[songIndex.value]?.id)
}

const handlePlayNext = async () => {
  songIndex.value += 1
  pause()
  await mainStore.fetchMusicDetail(playList.value[songIndex.value]?.id + "", qualitySelect.value, "json")
  audio.value.load()
  plays()
  handleSongSize(playList.value[songIndex.value]?.id)
}

const handleSongSize = (ids: any) => {
  getMusicDetail(ids+"", "hires", "json").then((res: any) => {
    hiresSize.value = res.data.size
  })
  getMusicDetail(ids+"", "jyeffect", "json").then((res: any) => {
    jyeffectSize.value = res.data.size
  })
  getMusicDetail(ids+"", "sky", "json").then((res: any) => {
    skySize.value = res.data.size
  })
  getMusicDetail(ids+"", "jymaster", "json").then((res: any) => {
    jymasterSize.value = res.data.size
  })
}

const handleSongQuality = async (event: any) => {
  qualitySelect.value = event.target.dataset.quality
  if (qualitySelect !== undefined && qualitySelect.value !== "" && event.target.dataset.quality !== undefined) {
    if (qualitySelect.value === "standard") {
      quality.value = "标准"
      levelNameColor.value = "#bbb"
    } else if (qualitySelect.value === "exhigh") {
      quality.value = "HQ"
      levelNameColor.value = "#00cc65"
    } else if (qualitySelect.value === "lossless") {
      quality.value = "SQ"
      levelNameColor.value = "#ff6600"
    } else if (qualitySelect.value === "hires") {
      quality.value = "Hi-Fi"
      levelNameColor.value = "#e5b046"
    } else if (qualitySelect.value === "jyeffect") {
      quality.value = "高清环绕"
      levelNameColor.value = "#e5b046"
    } else if (qualitySelect.value === "sky") {
      quality.value = "沉浸环绕"
      levelNameColor.value = "#e5b046"
    } else if (qualitySelect.value === "jymaster") {
      quality.value = "超清母带"
      levelNameColor.value = "#e5b046"
    }
    isShowLevelBar.value = false
    pause()
    await mainStore.fetchMusicDetail(playList.value[songIndex.value]?.id + "", qualitySelect.value, "json")
    audio.value.load()
    audio.value.currentTime = currentTime.value
    plays()
  }
}

const handleChangeLevel = () => {
  isShowLevelBar.value = true
}

const handleChangeWordDisplay = () => {
  isShowWord.value = !isShowWord.value
}

const handleChangeSongListDisplay = () => {
  isShowList.value = !isShowList.value
}

const handleCloseTab = () => {
  isShowLevelBar.value = false
  isShowList.value = false
  isShowWord.value = false
}

const handleNavSwitch = () => {
  router.push({
    path: "/play"
  })
}
</script>

<style scoped lang="less">
  .play-bar {
    color: #fff;
    width: 100%;
    height: 100%;
    z-index: 200;
    .bg-cover, .bg-img {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 60px;
      z-index: -1;
    }

    .bg-cover {
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(20px);
      z-index: 2;
    }
    .bg-img {
      display: none;
    }
    // overflow: hidden;
    &:hover {
      transform: none;
    }
    .line {
      width: 0%;
      height: 1%;
      background-color: red;
    }
    .main-bar {
      position: relative;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      width: 100%;
      height: 99%;
      // background-color: rgba(24, 24, 24,1);
      z-index: 200;
      .left {
        display: flex;
        align-items: center;
        .info {
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
        }
      }
      .center {
        display: flex;
        position: absolute;
        left: 45%;
        .icon {
          width: 30px;
          height: 30px;
        } 
      }
      .right {
        height: 100%;
        position: absolute;
        right: 10px;
        display: flex;
        align-content: center;
        align-items: center;
        .level {
          display: flex;
          align-items: center;
          position: relative;
          .level-name {
            font-size: 10px;
            cursor: pointer;
            padding: 3px 5px;
            border: 1px solid #626262;
            border-radius: 3px;
            margin-left: 10px;
            margin-right: 0px;
          }
          .levels-bar {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 12px;
            box-sizing: border-box;
            padding: 20px;
            width: 300px;
            height: 320px;
            position: absolute;
            bottom: 42px;
            left: -280px;
            margin: 0 auto;
            z-index: 700;
            background-color: #1a1b20;
            .item {
              font-size: 11px;
              width: 100%;
              height: 100%;
              padding: 10px 2px;
              border-radius: 3px;
              cursor: pointer;
              &:hover {
                background-color: #333;
              }
            }
            .top-level {
              display: flex;
              flex-wrap: wrap;
              flex-shrink: 0;
              justify-content: space-between;
              .item {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: #eda517;
                width: 48.2%;
                height: 60px;
                margin-top: 20px;
                box-sizing: border-box;
                padding: 6px;
                border-radius: 3px;
                background-color: #292d3e;
                .item-dec, .size {
                  color: #efb442;
                  font-size: 9px;
                  font-weight: 200;
                } 
                .quality-icon {
                  position: absolute;
                  right: 5px;
                  top: 12px;
                  width: 36px;
                  height: 36px;
                }
                &:hover {
                  background-color: #333;
                }
              }
            }
          }
        }
      }
    }
  }
</style>