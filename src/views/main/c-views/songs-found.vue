<template>
  <div class="songs-found">
    <template v-for="(item, index) in musicSearchRes?.songs">
      <song-list-item 
        height="60"
        :album="item?.al?.picUrl" 
        :name="item?.name" 
        :ar="item?.ar[0].name" 
        :ids="item?.id" 
        :id="index"
      >
      </song-list-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMainStore } from '../../../store/main';
import { watch } from 'vue';

const mainStore = useMainStore()
const { musicSearchRes, playList } = storeToRefs(mainStore)

watch(musicSearchRes, (newValue) => {
  if (newValue?.songs.length !== 0) {
    playList.value = newValue?.songs
  }
})
</script>

<style scoped lang="less">
  .songs-found {
    color: #fff;
  }
</style>