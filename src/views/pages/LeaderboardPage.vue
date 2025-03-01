<template>
  <div class="leaderboard">
    <div class="filter">
      <div class="top-space">
        国家：
        <el-select v-model="countryCode">
          <el-option v-for="item in countries" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="top-space">
        模式：
        <el-select v-model="category">
          <el-option v-for="category in categories" :key="category" :label="category" :value="category">
          </el-option>
        </el-select>
      </div>
      <div class="top-space">
        游戏平台：
        <el-select v-model="platform">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="top-space">
        仅显示玩家不同平台最好成绩&nbsp;
        <el-switch v-model="onlyShowBest"> </el-switch>
      </div>
    </div>
    <el-divider> </el-divider>
    <el-table class="table" stripe v-loading="isLoading" :data="filteredSpeedruns" width="100%" size="large">
      <el-table-column label="排名" min-width="50px">
        <template v-slot="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="玩家" min-width="235px">
        <template v-slot="scope">
          <el-tooltip v-if="scope.row.country" :content="scope.row.country" placement="top">
            <el-image class="flags" :src="`https://www.speedrun.com/images/flags/${scope.row.country_code}.png`" lazy>
            </el-image>
          </el-tooltip>
          <el-link class="player" :href="scope.row.player_url" target="_blank">{{
            scope.row.player
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="游戏平台" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="time" label="时间" min-width="150px">
      </el-table-column>
      <el-table-column label="视频地址" min-width="80px">
        <template v-slot="scope">
          <el-link :href="scope.row.video_url" target="_blank">{{
            scope.row.video_platform
          }}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue';
import Speedrun from '../../models/speedrun';
import LeanCloudQuery from '../../services/leancloud/leanCloudQuery';
import LeanCloudService from '../../services/leancloud/leanCloudService';
const leanCloudService = inject("LeanCloudService") as LeanCloudService;
const speedruns = ref<Speedrun[]>([]);
let countries = [
  {
    value: "不限",
    label: "不限",
  },
  {
    value: "cn",
    label: "中国",
  },
];
const countryCode = ref("cn");
const platforms = [
  {
    value: "不限",
    label: "不限",
  },
  {
    value: "PC",
    label: "PC",
  },
  {
    value: "Android",
    label: "安卓",
  },
  {
    value: "iOS",
    label: "iOS",
  },
];
const platform = ref("不限");
const categories = ["Glitchless", "Snake"];
const category = ref("Glitchless");
const onlyShowBest = ref(true);
const isLoading = ref(true);
let filteredSpeedruns = computed<Speedrun[]>(() => {
  return speedruns.value.filter(
    (speedrun) =>
      (countryCode.value === "不限" || speedrun.country_code === countryCode.value) &&
      (platform.value === "不限" || speedrun.platform === platform.value) &&
      (category.value === "不限" || speedrun.category === category.value) &&
      (!onlyShowBest.value || platform.value != "不限" || speedrun.fastest)
  );
});
onMounted(async () => {
  await getSpeedruns();
  isLoading.value = false;
});
const getSpeedruns = async () => {
  const query = new LeanCloudQuery<Speedrun>("Speedrun")
    .orderByAscending("total_time")
    .select("player", "user_id", "level", "category", "uid", "total_time", "platform", "time", "platform", "video_platform", "video_id", "country", "country_code", "fastest");
  speedruns.value = (await leanCloudService.find(query)).map(speedrun => Object.assign(new Speedrun(), speedrun));
  speedruns.value.forEach((speedrun) => {
    if (speedrun.country_code && !countries.some((country) => country.value === speedrun.country_code)) {
      countries.push({
        value: speedrun.country_code,
        label: speedrun.country,
      });
    }
  });
};
</script>

<style scoped>
.table {
  width: 100%;
}

.filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.flags {
  width: 18px;
  display: inline-flex;
  justify-content: center;
  text-align: center;
  margin: 5px;
}

.player {
  display: inline-block;
}

.top-space {
  margin-top: 20px;
  margin-inline: 5px;
}

.el-select {
  width: 250px;
}
</style>