<template>
  <div class="songs-deatil">
    <div class="top">
      <div class="songs-ablum"></div>
      <div class="songs-info">
        <div class="info-top"></div>
        <div class="create-info"></div>
        <div class="fun-bar"></div>
      </div>
    </div>
    <div class="main">
      <template v-for="(item, index) in playList">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../../../store/main';
import { storeToRefs } from 'pinia';

const route = useRoute()
const mainStore = useMainStore()
const {playList} = storeToRefs(mainStore)
onMounted(() => {
  const id = route.query!.id as unknown as number
  mainStore.fetchPlayList(id);
})
</script>

<style scoped lang="less">
  .songs-deatil {
    color: #fff;
    .main {
      box-sizing: border-box;
      padding: 10px;
    }
  }
</style>