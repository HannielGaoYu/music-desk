<template>
  <div class="songs-deatil">
    <h2>{{ route.query }}</h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../../../store/main';
// import { storeToRefs } from 'pinia';

const route = useRoute()
const mainStore = useMainStore()
// const {playList} = storeToRefs(mainStore)
onMounted(() => {
  const id = route.query!.id as unknown as number
  mainStore.fetchPlayList(id);
})
</script>

<style scoped lang="less">
  .songs-deatil {
    color: #000;
    background-color: #f0f;
  }
</style>