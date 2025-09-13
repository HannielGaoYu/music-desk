<template>
  <div class="main" @mousedown="mousedown">
    <div class="main-left">
      <div class="title-bar left-item">
        <img src="../../assets/img/main-left/音乐.png" alt="" class="icon music-logo">
        <div class="title">音乐播放器</div>
      </div>
      <router-link class="recommend left-item" to="/main/recommend">
        <img src="../../assets/img/main-left/家.png" alt="" class="icon">
        <div class="text">为我推荐</div>
      </router-link>
      <router-link class="online-music left-item" to="/main/online-extract">
        <img src="../../assets/img/main-left/耳机.png" alt="" class="icon">
        <div class="text">音乐精选</div>
      </router-link>
      <div class="line">
      </div>
      <router-link class="my-like left-item" to="/main/songs-favor">
        <img src="../../assets/img/main-left/213喜欢.png" alt="" class="icon">
        <div class="text">我喜欢的音乐</div>
      </router-link>
      <div class="local-and-download left-item">
        <img src="../../assets/img/main-left/下载.png" alt="" class="icon">
        <div class="text">本地与下载</div>
      </div>
      <div class="play-lately left-item">
        <img src="../../assets/img/main-left/最近播放.png" alt="" class="icon">
        <div class="text">最近播放</div>
      </div>
      <div class="line">
      </div>
      <div class="create-songs left-item">
        <div class="create-bar" style="color: #989ba0; font-size: 14px;">创建的歌单</div>
        <div class="songs">
          <div class="songs-icon"></div>
          <div class="songs-title"></div>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div class="top" style="box-sizing: border-box;padding: 10px 18px 6px 18px;">
        <top-bar></top-bar>
      </div>
      <div class="content" >
        <router-view @song-to-main="handleSongPlay"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'; 
import TopBar from '../../components/top-bar.vue'
import { useMainStore } from '../../store/main';

 // 需引入 ipcRenderer 
const ipcRenderer = window.ipcRenderer 
const isKeyDown = ref<boolean>(false); 
const startMouseX = ref<number>(0); // 鼠标按下时的屏幕 X 坐标 
const startMouseY = ref<number>(0); // 鼠标按下时的屏幕 Y 坐标 
// const startWindowX = ref<number>(0); // 窗口初始 X 坐标（屏幕坐标） 
// const startWindowY = ref<number>(0); // 窗口初始 Y 坐标（屏幕坐标） 
let baseX = ref<number>(0)
let baseY = ref<number>(0)
const songId = ref<number>(0)
const mainStore = useMainStore()

onMounted(() => {
  ipcRenderer.invoke('get-like-info').then(res => {
    mainStore.musicLikeInfo = JSON.parse(res)
  })
})
 
const mousedown = async (event: MouseEvent) => { 
  isKeyDown.value  = true; 
  // 1. 记录鼠标按下时的屏幕坐标 
  startMouseX.value  = event.screenX;  
  startMouseY.value  = event.screenY;
  baseX.value = event.x;
  baseY.value = event.y;
  let width = window.outerWidth + 0;
  let height = window.outerHeight + 0;  

 
  const onMouseMove = (ev: MouseEvent) => { 
    if (!isKeyDown.value)  return; 
    // 计算鼠标偏移量（当前屏幕坐标 - 初始屏幕坐标） 
    let offsetX = (ev.screenX  - baseX.value);  
    let offsetY = (ev.screenY  - baseY.value);  
    // 新窗口位置 = 窗口初始位置 + 偏移量 
    let newX =  offsetX; 
    let newY =  offsetY; 
    ipcRenderer.invoke('custom-adsorption',  { appX: newX, appY: newY, width, height}); 
  }; 
 
  const onMouseUp = () => { 
    isKeyDown.value  = false; 
    document.removeEventListener('mousemove',  onMouseMove); 
    document.removeEventListener('mouseup',  onMouseUp); 
  }; 
 
  document.addEventListener('mousemove',  onMouseMove); 
  document.addEventListener('mouseup',  onMouseUp); 
}; 

const handleSongPlay = (songIds: number) => {
  songId.value = songIds
}

</script>

<style scoped lang="less">
  .main {
    display: flex;
    flex-wrap: nowrap;
    width: 100vw;
    height: 100vh;
    color: #fff;
  }
  .main-left {
    width: 18%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 26px;
    padding-top: 22px;
    background: #1a1b20;
    .title-bar {
      margin-bottom: 20px;
    }
    .line {
      margin-bottom: 20px;
      border: 1px solid #2d2e33;
    }
  }
  .left-item {
    display: flex;
    align-items: center;
    align-content: center;
    margin-bottom: 20px;
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .text {
      color: #fff;
      font-size: 13px;
    }
    .music-logo {
      width: 42px;
      height: auto;
    }
  }
  .main-right {
    width: 82%;
    height: calc(100% - 60px);
    overflow-y: hidden;
    background-color: #131419;
    &::-webkit-scrollbar {
      display: none;
    }
    .content {
      height: 98%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>