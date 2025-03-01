<template>
  <div class="map">
    <div class="filter">
      <div class="top-space">
        搜索：
        <el-input class="input" placeholder="请输入地图名或作者名" v-model="searchMapName" />
      </div>
      <div class="top-space">
        平台：
        <el-select v-model="platform">
          <el-option v-for="platform in platforms" :key="platform" :label="platform" :value="platform" />
        </el-select>
      </div>
      <div class="top-space">
        类型：
        <el-select v-model="form">
          <el-option v-for="form in forms" :key="form" :label="form" :value="form" />
        </el-select>
      </div>
      <div class="top-space">
        风格：
        <el-select v-model="style">
          <el-option v-for="style in styles" :key="style" :label="style" :value="style" />
        </el-select>
      </div>
      <div class="top-space">
        难度：
        <el-select v-model="difficulty">
          <el-option v-for="difficulty in difficulties" :key="difficulty" :label="difficulty" :value="difficulty" />
        </el-select>
      </div>
    </div>
    <el-divider></el-divider>
    <el-table class="table" v-loading="false" stripe :data="filteredMaps" :row-style="{ height: '65px' }">
      <el-table-column width="60px">
        <template v-slot="scope">
          <el-link type="primary" :href="scope.row.url">下载</el-link>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="205px">
        <template v-slot="scope">
          <el-popover class="popover" v-if="scope.row.preview != ''" placement="top-start" trigger="hover"
            :width="previewWidth">
            <template #reference>
              <el-button class="link" link type="primary">
                {{ scope.row.name }}
              </el-button>
            </template>
            <template #default>
              <el-image class="image" :src="scope.row.preview" fit="fill" />
            </template>
          </el-popover>
          <a v-else>{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="130px">
        <template v-slot="scope">{{ scope.row.author }}</template>
      </el-table-column>
      <el-table-column label="大小" min-width="80px">
        <template v-slot="scope">{{ scope.row.size }}</template>
      </el-table-column>
      <el-table-column label="类型" min-width="60px">
        <template v-slot="scope">{{ scope.row.form }}</template>
      </el-table-column>
      <el-table-column label="风格" min-width="60px">
        <template v-slot="scope">{{ scope.row.style }}</template>
      </el-table-column>
      <el-table-column label="难度" min-width="60px">
        <template v-slot="scope">{{ scope.row.difficulty }}</template>
      </el-table-column>
    </el-table>
    <div class="center">
      <p>地图总数：{{ filteredMaps.length }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, onMounted, ref } from 'vue';
import LeanCloudQuery from '../../services/leancloud/leanCloudQuery';
import LeanCloudService from '../../services/leancloud/leanCloudService';
import Map from '../../models/map';
const leanCloudService = inject("LeanCloudService") as LeanCloudService;
const maps = ref<Map[]>([]);
const searchMapName = ref('');
const form = ref('不限');
const forms: string[] = ["不限", "原创", "移植"];
const style = ref('不限');
const styles: string[] = ["不限", "挑战", "休闲"];
const difficulty = ref('不限');
const difficulties: string[] = ["不限", "简单", "中等", "困难", "极难", "地狱"];
const platform = ref('PC');
const platforms: string[] = ["PC", "安卓"];
let isLoading = ref(false);
const previewWidth = computed(() => { return window.innerWidth * 0.5; });
let filteredMaps = computed<Map[]>(() => {
  return maps.value.filter(
    map =>
      (map.name.toLowerCase().includes(searchMapName.value.toLowerCase()) ||
        map.author.toLowerCase().includes(searchMapName.value.toLowerCase())) &&
      map.platform === platform.value &&
      (form.value === "不限" || map.form === form.value.toLowerCase()) &&
      (style.value === "不限" || map.style === style.value.toLowerCase()) &&
      (difficulty.value === "不限" || map.difficulty === difficulty.value.toLowerCase())
  )
});
onMounted(async () => {
  await getMaps();
  isLoading.value = true;
});
const getMaps = async () => {
  const query = new LeanCloudQuery<Map>("Map")
    .orderByAscending("name")
    .select("name", "author", "size", "form", "style", "difficulty", "platform", "url", "preview");
  maps.value = await leanCloudService.find(query);
  maps.value.forEach(map => {
    if (map.preview) map.preview = `${map.preview}?imageView/2/w/768/h/432/q/40`;
  });
};
</script>

<style scoped>
.table {
  width: 100%;
}

.input {
  width: auto;
}

.filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.link {
  white-space: normal;
}

.center {
  text-align: center;
}

.top-space {
  margin-top: 20px;
  margin-inline: 5px;
}

.el-input {
  width: 200px;
}

.el-select {
  width: 200px;
}
</style>