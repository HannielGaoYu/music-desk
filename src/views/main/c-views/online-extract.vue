<template>
  <div>
    <button @click="handleDownload">下载文件</button>
    <div >
      <progress :value="process" max="100" style="color: aliceblue; width: 90%;"></progress>
      <span>{{ process }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { eventBus } from '../../../event-bus';

const process = ref<number>(0)

eventBus.on('download-progress', (progress) => {
  alert(progress)
})

const handleDownload = async () => {
  const musicInfo = {
    url: 'https://m701.music.126.net/20250809133617/dc044b3fa1636503eafc121705fef929/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/17078766054/1cf8/d438/aedc/ea44f027b2fafa2e23f7a1e5cfd17a8e.flac?vuutv=gTdHn9XYAQYZJt1juR5qUjfFDag7Vo+WwWUzKMwapo9yoASakycOb+lBo5fx/d9T1ODPKiRSbCi1yqganA4PDlubIOBpTlrza6ojeXO4+yc=',  // 音乐资源 URL
    filename: '哈哈哈.mp3', // 保存文件名
    artist: '哈哈', // 可选，用于分类文件夹
  };
  window.ipcRenderer.invoke('download-music',  musicInfo); // 发送下载请求
}

window.ipcRenderer.on('download-progress', (e, a) => {
  console.log(e);
  process.value = a
})

</script>