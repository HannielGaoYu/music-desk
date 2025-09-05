<template>
  <div class="songs-deatil">
    <div class="top">
      <img class="songs-ablum" :src="playListInfo?.coverImgUrl" style="width: 200px;
      height: 200px;"></img>
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
const id = route.query!.id as unknown as number
mainStore.fetchPlayList(id);
const {playList, playListInfo} = storeToRefs(mainStore)
onMounted(() => {
  
})
</script>

<style scoped lang="less">
  .songs-deatil {
    color: #fff;
    .top {
      height: 300px;
    }
    .main {
      box-sizing: border-box;
      padding: 20px 20px 30px 20px;
    }
  }
</style>