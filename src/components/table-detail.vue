<template>
  <el-descriptions :title="title" :column="column" border>
    <el-descriptions-item v-for="item in list" :span="item.span">
      <template #label> {{ item.label }} </template>
      <slot :name="item.prop" :rows="row">
        {{ item.value || row[item.prop] }}
      </slot>
    </el-descriptions-item>
  </el-descriptions>
  <div v-if="isshow" style="width: 97%; height: 100%">
    <div class="scrollable-window">
      <div
        style="
          width: 100%;
          height: auto;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        "
      >
        <div style="color: rgb(111, 113, 117); font-size: 13px">
          已选该门课学生：
        </div>
        <div style="color: #2272fb; font-size: 13px">
          被指定（{{
            stableData.filter((item) => item.isappointment == 1).length
          }}人）
        </div>
        <div style="color: #3b3f47; font-size: 13px">
          未指定（{{
            stableData.filter((item) => item.isappointment == 0).length
          }}人）
        </div>
      </div>
      <div class="window-content">
        <el-table :data="stableData" class="custom-table-font-size">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sno" label="学号" />
          <el-table-column prop="major" label="专业" />
          <el-table-column label="是否被指定">
            <template #default="scope">
              <el-tag v-if="scope.row.isappointment == 1">被指定</el-tag>
              <el-tag v-else-if="scope.row.isappointment == 0" type="info"
                >未指定</el-tag
              >
              <el-tag v-else-if="scope.row.isappointment == 2" type="warning"
                >待指定</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="class" label="班级" />
          <el-table-column prop="phone" label="电话" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormOption } from "@/types/form-option";
import { FormInstance, FormRules, UploadProps, ElMessage } from "element-plus";
import { PropType, ref } from "vue";
import { ElMessageBox } from "element-plus";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import { TeacherCourseData, SerachStudent } from "@/api";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const isshow = ref(false);

const { row, title, column = 2, list } = props.data;
if (
  "reimburse" in row &&
  "studentHave" in row &&
  "studentRequirements" in row
) {
  isshow.value = true;
}
console.log(row, title, column, list, "查看详情");
const stableData = ref([]);
const getData = async (e, p) => {
  const res = await TeacherCourseData(e, p);
  console.log(res.data.SetTopic.Enrolls, "res");
  let ese = res.data.SetTopic.Enrolls;
  stableData.value = [];
  ese.forEach((item) => {
    stableData.value.push({
      name: item.Student.name,
      sno: item.Student.sno,
      class: item.Student.class,
      phone: item.Student.phone,
      major: item.Student.majorName,
      isappointment: item.isappointment,
    });
  });
};
if (isshow.value) getData(row.projectpracticeCode, row.code);
</script>
<style>
.scrollable-window {
  max-width: 800px; /* 最大宽度为800px */
  width: 100%; /* 宽度占满父容器 */
  height: 300px; /* 窗口高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  border: 1px solid #ccc; /* 边框样式 */
  margin: 20px auto; /* 水平居中，上下外边距20px */
  padding: 10px; /* 内边距 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  border-radius: 5px; /* 边框圆角 */
}

.window-content {
  /* 窗口内容的样式，可根据需要调整 */
  width: 100%;
}
</style>
