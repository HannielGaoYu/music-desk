<template>
  <div class="songs-favor">
    <template v-for="(item) in musicLikeInfo?.data">
      <song-list-item 
        height="60"
        :album="item?.album" 
        :name="item?.name" 
        :ar="item?.ar" 
        :ids="item?.ids" 
        :id="item?.id"
      >
      </song-list-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMainStore } from '../../../store/main';

const mainStore = useMainStore()
const {musicLikeInfo} = storeToRefs(mainStore)
</script>

<style scoped lang="less">
  .songs-favor {
    color: #fff;
  }
</style>