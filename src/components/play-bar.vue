<template>
  <div class="play-bar">
    <div class="line" :style="'width: ' + per + '%;'" ></div>
    <div class="main-bar">
      <div class="left">
        <img class="album" :src="musicDetail?.pic !== undefined ? musicDetail?.pic : defaultPic" style="width: 42px; height: 42px;margin-left: 10px;vertical-align: top;border-radius: 6%;"></img>
        <div class="info">
          <div class="name">{{ musicDetail?.name }}</div>
          <div class="ar">{{ musicDetail?.ar_name }}</div>
        </div>
      </div>
      <div class="center" style="">
        <img class="like icon" src="@/assets/img/play-bar/喜欢.png" ></img>
        <img class="pre icon" src="@/assets/img/play-bar/last_one.png" @click="handlePlayPre"></img>
        <img class="paruse icon" @click="clickAudio()" :src="isPlay ? pauseIcon : playIcon" ></img>
        <img class="next icon" src="@/assets/img/play-bar/下一首.png" @click="handlePlayNext"></img>
        <audio ref="audio" @timeupdate="handleAudioTime" @ended="handlePlayNext">
          <source :src="musicDetail?.url" preload="auto">
        </audio>
      </div>
      <div class="right">
        <div class="time">{{ formatSongTime(currentTime) }} / {{ formatSongTime(duration) }}</div>
        <div class="level">
          <span 
            class="level-name" 
            :style="`color: ${levelNameColor};border-color: ${levelNameColor};`"
            @click="handleChangeLevel"
          >
            {{ quality }}
          </span>
          <div class="levels-bar" v-if="isShowLevelBar" @click="handleSongQuality">
            <div class="standard item" data-quality="standard">标准品质</div>
            <div class="exhigh item" data-quality="exhigh">HQ高品质</div>
            <div class="lossless item" data-quality="lossless">SQ无损品质</div>
            <div class="top-level">
              <div class="hires item" data-quality="hires">
                <div class="item-name">HIFI发烧品质</div>
                <div class="item-dec">发烧音质体验</div>
                <div class="size">{{ hiresSize }}</div>
                <img src="../assets/img/play-bar/ic_Hi-Res.png" alt="" class="quality-icon">
              </div>
              <div class="jyeffect item" data-quality="jyeffect">
                <div class="item-name">高清环绕声</div>
                <div class="item-dec">双耳环绕体验</div>
                <div class="size">{{ jyeffectSize }}</div>
                <img src="../assets/img/play-bar/jyeffect音乐.png" alt="" class="quality-icon">
              </div>
              <div class="sky item" data-quality="sky">
                <div class="item-name">沉浸环绕声</div>
                <div class="item-dec">双耳沉浸环绕体验</div>
                <div class="size">{{ skySize }}</div>
                <img src="../assets/img/play-bar/sky音乐.png" alt="" class="quality-icon">
              </div>
              <div class="jymaster item" data-quality="jymaster">
                <div class="item-name">超清母带</div>
                <div class="item-dec">还原声音细节</div>
                <div class="size">{{ jymasterSize }}</div>
                <img src="../assets/img/play-bar/jymaster音质.png" alt="" class="quality-icon">
              </div>
            </div>
          </div>
        </div>
        <div class="word"></div>
        <div class="list"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  ref, } from 'vue';
import {useMainStore} from '../store/main/index'
import playIcon from '../assets/img/play-bar/播放.png'
import pauseIcon from '../assets/img/play-bar/暂停.png'
import { storeToRefs } from 'pinia';
import defaultPic from '../assets/data/profix.png'
import { eventBus } from '../event-bus';
import {formatSongTime} from '../utils/tools'
import { getMusicDetail } from '../service/main/music';

const songIds = ref<number>(0) 
const currentTime = ref<number>(0)
const duration = ref<number>(0)
const per = ref()
const songPlayList = ref<any[]>([])
const songIndex = ref<number>(0)

const isShowLevelBar = ref<boolean>(false)
const quality = ref<string>("标准")
const levelNameColor = ref<string>("#bbb")
const hiresSize = ref<string>("")
const jyeffectSize = ref<string>("")
const skySize = ref<string>("")
const jymasterSize = ref<string>("")

const mainStore = useMainStore()
const {musicDetail, playList} = storeToRefs(mainStore)

eventBus.on("album-click", async(ids: any)=> {
  
  await mainStore.fetchMusicDetail(ids + "", "standard", "json")
  audio.value.load()
  handleSongSize(ids)
  plays()
  songIds.value = ids
})

eventBus.on("song-click", async(songInfo: any) => {
  
  if (songInfo.type === "hot-playlist") {
    songPlayList.value = playList.value
  }
  for (let i = 0; i < songPlayList.value?.length; i++) {
      if (songPlayList.value[i]?.id + "" === songInfo?.ids + "") {
        songIndex.value = i
      }
  }
  pause()
  await mainStore.fetchMusicDetail(songInfo?.ids + "", "standard", "json")
  audio.value.load()
  handleSongSize(songInfo?.ids)
  plays()
  songIds.value = songInfo?.ids
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
  await mainStore.fetchMusicDetail(songPlayList.value[songIndex.value]?.id + "", "standard", "json")
  handleSongSize(songPlayList.value[songIndex.value]?.id)
  audio.value.load()
  plays()
}

const handlePlayNext = async () => {
  songIndex.value += 1
  pause()
  await mainStore.fetchMusicDetail(songPlayList.value[songIndex.value]?.id + "", "standard", "json")
  handleSongSize(songPlayList.value[songIndex.value]?.id)
  audio.value.load()
  plays()
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
  const qualitySelect = event.target.dataset.quality
  if (qualitySelect !== undefined && qualitySelect !== "") {
    if (qualitySelect === "standard") {
      quality.value = "标准"
    } else if (qualitySelect === "exhigh") {
      quality.value = "HQ"
      levelNameColor.value = "#00cc65"
    } else if (qualitySelect === "lossless") {
      quality.value = "SQ"
      levelNameColor.value = "#ff6600"
    } else if (qualitySelect === "hires") {
      quality.value = "Hi-Fi"
      levelNameColor.value = "#e5b046"
    } else if (qualitySelect === "jyeffect") {
      quality.value = "高清环绕"
      levelNameColor.value = "#e5b046"
    } else if (qualitySelect === "sky") {
      quality.value = "沉浸环绕"
      levelNameColor.value = "#e5b046"
    } else {
      quality.value = "超清母带"
      levelNameColor.value = "#e5b046"
    }
    isShowLevelBar.value = false
    pause()
    await mainStore.fetchMusicDetail(songIds.value + "", qualitySelect, "json")
    audio.value.load()
    plays()
  }
}

const handleChangeLevel = () => {
  isShowLevelBar.value = true
}

</script>

<style scoped lang="less">
  .play-bar {
    position: relative;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(20px);
    z-index: 600;
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
      background-color: rgba(24, 24, 24,1);
      .left {
        display: flex;
        align-items: center;
        .info {
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
        right: 20px;
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
            margin-right: 20px;
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