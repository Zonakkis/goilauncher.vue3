<template>
  <div class="about">
    <el-container direction="vertical">
      <el-main>
        <el-image class="image" :src="logo" fit="scale-down" lazy></el-image>
        <div>
          <h1>GOILauncher</h1>
          <p>
            GOILauncher是一个基于Avalonia开发的Windows开源Getting Over It
            启动器。它可以帮助你查看游戏信息，并提供一键下载安装Mod、地图，启动游戏等功能。
          </p>
          <div v-if="update !== undefined">
            最新版本下载：
            <el-link class="link" type="primary" :href="update.url">{{ update.version }}</el-link>
          </div>
          <p>
            这里是GOILauncher的网页版本，你也可以在这里使用CGOILaucnher的绝大多数功能，如地图下载，查看排行榜并提交速通。
            <br />
            <strong> （但无法享受一键安装并启动游戏） </strong>
          </p>
        </div>
      </el-main>
      <el-footer>
        <div class="div">
          友情链接：
          <el-link class="link" type="primary" href="https://cloud.cgoi.cc">CGOI云</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link class="link" type="primary" href="https://space.bilibili.com/292855911">哔哩哔哩</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link class="link" type="primary" href="https://github.com/Zonakkis/GOILauncher">Github</el-link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-link class="link" type="primary" href="https://afdian.net/a/Zonakkis">爱发电</el-link>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import logo from "../../assets/goilauncher.png";
import { inject, onMounted, ref } from "vue";
import Update from "../../models/update";
import LeanCloudService from "../../services/leancloud/leanCloudService";
const leanCloudService = inject("LeanCloudService") as LeanCloudService;
const update = ref<Update>();
onMounted(async () => {
  await getUpdate();
});
const getUpdate = async () => {
  update.value = await leanCloudService.get<Update>("Update", "67b8c0b2d2c78e5c0084c98e");
};
</script>
<style scoped>
.about {
  display: flex;
  text-align: center;
  justify-content: center;
  height: 100%;
}

.div {
  display: flex;
  place-items: center;
  justify-content: center;
  height: 100%;
}

.image {
  width: 20%;
}

.link {
  font-size: 16px;
}
</style>
