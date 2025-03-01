<template>
  <div class="worldrecordhistory">
    <div class="filter">
      <div class="top-space">
        平台：
        <el-select v-model="platform">
          <el-option
            v-for="platform in platforms"
            :key="platform"
            :label="platform"
            :value="platform"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-divider></el-divider>
    <el-timeline> </el-timeline>
    <div>
      <el-timeline>
        <el-timeline-item
          v-for="(worldRecord, index) in filteredWorldRecords"
          :key="index"
          :timestamp="worldRecord.Date"
        >
          <el-card>
            <div>
              {{ worldRecord.Player }}
              <el-link type="primary" :href="worldRecord.VideoUrl">{{
                worldRecord.Time
              }}</el-link>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      platform: "PC",
      platforms: ["PC", "安卓", "iOS"],
      worldRecords: [],
    };
  },
  computed: {
    filteredWorldRecords() {
      return this.worldRecords.filter(
        (worldRecord) => worldRecord.Platform === this.platform
      );
    },
  },
  mounted() {
    this.getWorldRecords();
  },
  methods: {
    async getWorldRecords() {
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
        order: "-TotalTime",
        keys: "Player,Time,VideoUrl,Date,Platform,-TotalTime,-createdAt,-objectId",
      };
      const url = `https://3dec7zyj.lc-cn-n1-shared.com/1.1/classes/WorldRecord?${new URLSearchParams(
        params
      )}`;
      const response = await fetch(url, options);
      this.worldRecords = (await response.json()).results.map((worldRecord) => {
        worldRecord.Date = new Date(worldRecord.Date.iso).toLocaleDateString(
          "zh-CN",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        return worldRecord;
      });
      console.log(this.worldRecords);
    },
  },
};
</script>
 <style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  place-items: center;
  justify-content: center;
}
.top-space {
  margin-top: 20px;
}
</style>