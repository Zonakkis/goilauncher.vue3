<template>
  <div class="mod">
    <el-collapse v-loading="isLoading">
      <el-collapse-item>
        <template #title>
          &nbsp;&nbsp;
          <h2>Modpack</h2>
          &nbsp;
          <span>by</span>
          &nbsp;
          <h3>Anjo2</h3>
        </template>
        <div v-for="modpack in modpacks" :key="modpack.url">
          <el-card>
            <el-link :href="modpack.url">下载</el-link>
            &nbsp;&nbsp;
            <a class="build">{{ modpack.build }}</a>
            &nbsp;
            {{ modpack.target_game_version.join("/") }}
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item>
        <template #title>
          &nbsp;&nbsp;
          <h2>LevelLoader</h2>
          &nbsp;
          <span>by</span>
          &nbsp;
          <h3>Anjo2</h3>
        </template>
        <div v-for="levelLoader in levelLoaders" :key="levelLoader.url">
          <el-card>
            <el-link :href="levelLoader.url">下载</el-link>
            &nbsp;&nbsp;
            <a class="build">{{ levelLoader.build }}</a>
            &nbsp;
            {{ levelLoader.target_game_version.join("/") }}
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item>
        <template #title>
          &nbsp;&nbsp;
          <h2>ModpackAndLevelLoader</h2>
          &nbsp;
          <span>by</span>
          &nbsp;
          <h3>Nameless & Jor02</h3>
        </template>
        <div v-for="modpackAndLevelLoader in modpackAndLevelLoaders" :key="modpackAndLevelLoader.url">
          <el-card>
            <el-link :href="modpackAndLevelLoader.url">下载</el-link>
            &nbsp;&nbsp;
            <a class="build">{{ modpackAndLevelLoader.build }}</a>
            &nbsp;
            {{ modpackAndLevelLoader.target_game_version.join("/") }}
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item>
        <template #title>
          &nbsp;&nbsp;
          <h2>其他Mod</h2>
        </template>
        <div v-for="otherMod in otherMods" :key="otherMod.url">
          <el-card>
            <el-link :href="otherMod.url">下载</el-link>
            &nbsp;&nbsp;
            <span class="name">{{ otherMod.name }}</span>
            &nbsp;
            <span class="build">{{ otherMod.build }}</span>
            &nbsp;
            <span>by</span>
            &nbsp;
            <span class="author">{{ otherMod.author }}</span>
            &nbsp;
            <span>{{ otherMod.target_game_version.join("/") }}</span>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import Mod from "../../models/mod";
import LeanCloudQuery from "../../services/leancloud/leanCloudQuery";
import LeanCloudService from "../../services/leancloud/leanCloudService";
const leanCloudService = inject("LeanCloudService") as LeanCloudService;
let modpacks: Mod[];
let levelLoaders: Mod[];
let modpackAndLevelLoaders: Mod[];
let otherMods: Mod[];
const isLoading = ref(true);
onMounted(async () => {
  await getModpacks();
  await getLevelLoaders();
  await getModpackAndLevelLoaders();
  await getOtherMods();
  isLoading.value = false;
});
const getModpacks = async () => {
  const query = new LeanCloudQuery<Mod>("Mod")
    .where("type", "Modpack")
    .orderByDescending("build")
    .select("build", "url", "target_game_version");
  modpacks = await leanCloudService.find(query);
};
const getLevelLoaders = async () => {
  const query = new LeanCloudQuery<Mod>("Mod")
    .where("type", "LevelLoader")
    .orderByDescending("build")
    .select("build", "url", "target_game_version");
  levelLoaders = await leanCloudService.find(query);
};
const getModpackAndLevelLoaders = async () => {
  const query = new LeanCloudQuery<Mod>("Mod")
    .where("type", "ModpackAndLevelLoader")
    .orderByDescending("build")
    .select("build", "url", "target_game_version");
  modpackAndLevelLoaders = await leanCloudService.find(query);
};
const getOtherMods = async () => {
  const query = new LeanCloudQuery<Mod>("Mod")
    .where("type", "Other")
    .orderByDescending("build")
    .select("name", "build", "author", "url", "target_game_version");
  otherMods = await leanCloudService.find(query);
};
</script>

<style scoped>
.name {
  font-size: 20px;
}

.build {
  font-weight: 400;
  font-size: 18px;
}

.author {
  font-size: 18px;
}
</style>