<template>
  <div class="about">
    <el-dialog :title="dialogTitle" v-model="showDialog">
      <div>
        在审核通过后，您的速通将会出现在排行榜中。<br />
        您可以在待审核页面查看您的速通是否处于审核中。
      </div>
      <span slot="footer">
        <el-button type="primary" @click="showDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <el-form :hide-required-asterisk="true" :model="speedrun" :data="speedrun" :rules="rules" label-position="top">
      <el-form-item label="游戏范围">
        <el-select v-model="speedrun.level" style="width: 100%">
          <el-option v-for="level in levels" :key="level" :label="level" :value="level" />
        </el-select>
      </el-form-item>
      <el-form-item label="模式">
        <el-select v-model="speedrun.category" style="width: 100%">
          <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
        </el-select>
      </el-form-item>
      <el-form-item label="游戏平台">
        <el-select v-model="speedrun.platform" style="width: 100%">
          <el-option v-for="platform in platforms" :key="platform.value" :label="platform.label"
            :value="platform.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="国家">
        <el-select v-model="speedrun.country_code" style="width: 100%">
          <el-option v-for="countryCode in countryCodes" :key="countryCode.value" :label="countryCode.label"
            :value="countryCode.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="视频平台">
        <el-select v-model="speedrun.video_platform" @change="changeVideoPlatform" style="width: 100%">
          <el-option v-for="videoPlatform in videoPlatforms" :key="videoPlatform" :label="videoPlatform"
            :value="videoPlatform" />
        </el-select>
      </el-form-item>
      <el-form-item :label="videoIDName" prop="video_id" :rules="[
        {
          required: true,
          message: `${videoIDName}不能为空`,
          trigger: 'blur',
        },
      ]">
        <el-input v-model="speedrun.video_id" :placeholder="`请输入${videoIDName}`" />
      </el-form-item>
      <el-form-item label="玩家（可选）">
        <el-input v-model="speedrun.player" placeholder="请输入玩家名字（仅供审核查看，通过后会改成视频平台用户名）" />
      </el-form-item>
      <el-form-item label="时间" prop="Time">
        <div class="flex">
          <el-input-number class="stretch" v-model="speedrun.minute" :max="59" :min="0" :controls="false" />
          <a class="minWidth">分</a>
          <el-input-number class="stretch" v-model="speedrun.second" :max="59" :min="0" :controls="false" />
          <a class="minWidth">.</a>
          <el-input-number class="stretch" v-model="speedrun.millionsecond" :max="999" :min="0" :controls="false" />
          <a class="minWidth">秒</a>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex">
          <el-button type="primary" @click="submitRun">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from "vue";
import PendingRun from "../../models/pendingRun";
import LeanCloudService from "../../services/leancloud/leanCloudService";
import type { FormRules } from "element-plus";
const leanCloudService = inject("leanCloudService") as LeanCloudService;
const showDialog = ref(false);
const dialogTitle: string = "提交成功！";
const speedrun = ref(new PendingRun());
const videoIDName = ref("哔哩哔哩视频链接（或BV号）");
const levels = ["完整游戏", "Tutorial", "Devil's Chimney",
  "Slide Skip", "Furniture Land", "Orange Hell", "Anvil",
  "Bucket", "Ice Mountain", "Radio Tower", "Space"];
const categories = ["Glitchless", "Snake"];
const platforms = [
  {
    value: "PC",
    label: "PC",
  },
  {
    value: "Android",
    label: "安卓",
  },
  {
    value: "IOS",
    label: "IOS",
  },
];
const videoPlatforms = ["哔哩哔哩", "YouTube"];
const countryCodes = [
  {
    value: "cn",
    label: "中国",
  },
];
onMounted(() => {
  console.log(speedrun.value);
});
const checkTime = (rule: any, value: any, callback: Function) => {
  if (isNaN(speedrun.value.minute) || isNaN(speedrun.value.second) || isNaN(speedrun.value.millionsecond)) {
    return callback(new Error("时间不能为空"));
  } else callback();
  if (rule && value && callback) { }
};
const ruleForm = reactive({
  Time: ''
})
const rules = reactive<FormRules<typeof ruleForm>>({
  Time: [{
    validator: checkTime,
    required: true,
    message: "时间不能为空",
    trigger: "blur"
  }]
})
const submitRun = async () => {
  let found = false;
  switch (speedrun.value.video_platform) {
    case "哔哩哔哩":
      speedrun.value.video_id.split("/").forEach((str) => {
        if (str.startsWith("BV")) {
          found = true;
          speedrun.value.video_id = str;
        }
      });
      break;
    case "YouTube":
      if (speedrun.value.video_id.includes("watch?v=")) {
        speedrun.value.video_id.split("/").forEach((str) => {
          if (str.startsWith("watch?v=")) {
            found = true;
            speedrun.value.video_id = str.substring(8, str.length);
          }
        });
      }
      break;
  }
  if (!found) {
    alert(`输入的${videoIDName}有误，请重新检查。`);
    return;
  }
  speedrun.value.calculateTime();
  console.log(speedrun.value);
  await leanCloudService.create("PendingRun", speedrun.value);
  showDialog.value = true;
  speedrun.value = new PendingRun();
};
const changeVideoPlatform = () => {
  switch (speedrun.value.video_platform) {
    case "哔哩哔哩":
      videoIDName.value = "哔哩哔哩视频链接（或BV号）";
      break;
    case "YouTube":
      videoIDName.value = "YouTube视频链接";
      break;
  }
};
</script>
<style scoped>
.flex {
  width: 100%;
  display: flex;
  justify-content: center;
}

.stretch {
  width: 100%;
}

.minWidth {
  text-align: center;
  min-width: 30px;
}
</style>