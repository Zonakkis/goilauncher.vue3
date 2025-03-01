<template>
  <div class="pendingrun">
    <el-container>
      <el-table ref="table" :data="speedruns" style="width: 100%">
        <el-table-column label="玩家" min-width="200">
          <template v-slot="scope">
            <el-tooltip :content="scope.row.Country" placement="top">
              <el-image
                class="flags"
                :src="`https://www.speedrun.com/images/flags/${scope.row.CountryCode}.png`"
                style="
                  width: 18px;
                  display: inline-flex;
                  justify-content: center;
                  text-align: center;
                  margin: 5px;
                "
              >
              </el-image> </el-tooltip
            >{{ scope.row.Player }}
          </template>
        </el-table-column>
        <el-table-column prop="Category" label="模式" min-width="85"> </el-table-column>
        <el-table-column prop="Platform" label="游戏平台"> </el-table-column>
        <el-table-column prop="Time" label="时间" min-width="100"> </el-table-column>
        <el-table-column label="视频地址">
          <template v-slot="scope">
            <el-link :href="scope.row.VideoURL" target="_blank">{{
              scope.row.VideoPlatform
            }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      speedruns: [],
      countries: new Map([
        ["cn", "中国"],
        ["us", "美国"],
        ["in", "印度"],
      ]),
    };
  },
  created() {
    window.addEventListener("resize", this.freshTable);
  },
  mounted() {
    this.getSpeedruns();
  },
  methods: {
    async getSpeedruns() {
      const headers = new Headers({
        "X-LC-Id": "3Dec7Zyj4zLNDU0XukGcAYEk-gzGzoHsz",
        "X-LC-Key": "uHF3AdKD4i3RqZB7w1APiFRF",
        "Content-Type": "application/json",
      });
      const options = {
        method: "GET",
        headers: headers,
      };
      let params = {
        keys: "Player,UID,Category,TotalTime,Platform,Time,VideoPlatform,VID,CountryCode,-createdAt,-updatedAt,-objectId",
      };
      const url =
        "https://3dec7zyj.lc-cn-n1-shared.com/1.1/classes/PendingRun?" +
        new URLSearchParams(params);
      const response = await fetch(url, options);
      this.speedruns = (await response.json()).results;
      this.speedruns.forEach((speedrun) => {
        speedrun.Country = this.countries.get(speedrun.CountryCode);
        switch (speedrun.VideoPlatform) {
          case "哔哩哔哩":
            speedrun.VideoURL = `https://www.bilibili.com/video/${speedrun.VID}`;
            speedrun.PlayerURL = `https://space.bilibili.com/${speedrun.UID}`;
            break;
          case "YouTube":
            speedrun.VideoURL = `https://www.youtube.com/watch?v=${speedrun.VID}`;
            speedrun.PlayerURL = `https://www.youtube.com/@${speedrun.UID}`;
            break;
          default:
            break;
        }
      });
    },
    freshTable() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
  },
};
</script>

<style>
</style>