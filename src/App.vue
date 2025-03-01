<template>
  <div id="app">
    <el-menu router default-active="/about" mode="horizontal">
      <el-menu-item index="/about">关于</el-menu-item>
      <el-menu-item index="/mod">Mod下载</el-menu-item>
      <el-menu-item index="/map">地图下载</el-menu-item>
      <el-menu-item index="/submitrun">提交速通</el-menu-item>
      <el-menu-item index="/leaderboard">排行榜</el-menu-item>
      <!-- <el-menu-item index="/pendingrun">待审核</el-menu-item> -->
      <!-- <el-menu-item index="/worldrecordhistory">世界纪录史</el-menu-item> -->
    </el-menu>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { provide } from "vue";
import LeanCloudService from "./services/leancloud/leanCloudService";
provide("LeanCloudService", new LeanCloudService());
</script>
<style>
.el-input {
  height: 40px;
}

.el-select__wrapper {
  height: 40px;
}
</style>
