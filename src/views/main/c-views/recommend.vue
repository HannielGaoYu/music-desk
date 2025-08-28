<template>
  <div class="recommend">
    <div class="top-bar">
      <div class="back"></div>
      <div class="enter"></div>
      <div class="search"></div>
    </div>
    <div class="top-title" style="font-size: 12px; font-weight: 600; margin-bottom: 16px;">
      Hi, 今日为你推荐
    </div>
    <div class="hot-bar">
      <div class="main-hot">  
          <album-cover 
            icon="left" 
            cover="false" 
            big="true" 
            :album="banner[0]?.bigImageUrl" 
            :text="banner[0]?.typeTitle"
            :ids="banner[0]?.targetId"
            @album-click="playSong(banner[0])"
          >
          </album-cover>       
      </div>
      <template v-for="(item) in banner.slice(4,8)" key="*this">
        <div class="item">
          <album-cover 
            icon="left" 
            cover="true" 
            :album="item?.bigImageUrl" 
            :text="item?.typeTitle"
            :ids="item?.targetId"
            @album-click="playSong(item)"
          >
          </album-cover>
        </div>
      </template>
    </div>
    <div class="songs-title" style="font-weight: 600; margin-bottom: 16px;">您的宝藏歌单推荐</div>
    <div class="songs-recommend">
      <template v-for="(item) in topPlayList" key="*this">
          <div class="item">
            <album-cover 
            icon="left" 
            cover="true" 
            :album="item?.coverImgUrl" 
            :text="item?.name"
            >
            </album-cover>
          </div>
      </template>
    </div>
    <div class="hot-title" style="font-weight: 600; margin-bottom: 16px;">大家都在听</div>
    <div class="hot-hear">
      <template v-for="(item) in 12" key="item">
        <div style="flex-shrink: 0; width: 33.3%;">
          <song-box 
            :album="hotPlayList[item]?.al?.picUrl" 
            :name="hotPlayList[item]?.name" 
            :ar="hotPlayList[item]?.ar[0].name" 
            :ids="hotPlayList[item]?.id" 
            @song-click="handleSongClick"
            :id="item"
          >
          </song-box>
          <song-box 
            :album="hotPlayList[item+12]?.al?.picUrl" 
            :name="hotPlayList[item+12]?.name" 
            :ar="hotPlayList[item+12]?.ar[0].name" 
            :ids="hotPlayList[item+12]?.id" @song-click="handleSongClick"
            :id="item + 12"
          >
          </song-box>
          <song-box 
            :album="hotPlayList[item+24]?.al?.picUrl" 
            :name="hotPlayList[item+24]?.name" 
            :ar="hotPlayList[item+24]?.ar[0].name" 
            :ids="hotPlayList[item+24]?.id" 
            @song-click="handleSongClick"
            :id="item + 24"
          >
          </song-box>
        </div>
      </template>
    </div>
    <div class="title" style="font-weight: 600; margin: 16px 0;">歌单游览计划</div>
    <div class="songs-hot">
      <template v-for="(item) in randPlayList" key="*this">
          <div class="item">
            <album-cover icon="left" cover="true" :album="item?.coverImgUrl" :text="item?.name"></album-cover>
          </div>
      </template> 
    </div>

    <div class="treasure-song" style="height: 60px;"></div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AlbumCover from '../../../components/album-cover.vue'
import SongBox from '../../../components/song-box.vue'
import {useMainStore} from '../../../store/main/index'
import { getRangeRandNum } from '../../../utils/tools'
import { getHotPlayList, getTopPlayList } from '../../../service/main/music'
import { ref } from 'vue'

const mainStore = useMainStore()
mainStore.fetchBanner()
mainStore.fetchTopPlayList("全部", 12, 0)
// mainStore.fetchPlayList(3778678)
mainStore.fetchHotPlayList()
const {banner, topPlayList, hotPlayList, playList} = storeToRefs(mainStore)

const randPlayList = ref<any[]>([])
const randNum = getRangeRandNum(0, 9) 
getHotPlayList().then(res => {
  getTopPlayList(res.data.tags[randNum].name, 12, 0).then(res => {
    randPlayList.value = res.data.playlists
  })
})

const emit = defineEmits(['song-to-main'])

const playSong = (data: any) => {
  if (data?.targetId !== 0) {
    emit('song-to-main', data?.targetId)
  }
}

const handleSongClick = () => {
  playList.value = hotPlayList.value
}

</script>

<style scoped lang="less">
  .recommend {
    color: #fff;
    box-sizing: border-box;
    padding: 10px 26px;
    .hot-bar {
      display: flex;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: space-between;
      .main-hot {
        width: 32%;
      }
      .item {
        width: 15%;
      }
    }
    .songs-recommend {
      display: flex;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 15%;
      }
    }
    .hot-hear {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .songs-hot {
      display: flex;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 15%;
      }
    }
  }

</style>