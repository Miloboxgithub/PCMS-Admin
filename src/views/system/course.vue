<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
        :key="componentKey"
        :columns="columns"
        :tableData="tableData"
        :total="page.total"
        :currentPage="page.index"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :changePage="changePage"
        :editFunc="handleEdit"
        :delSelection="handleDelSelection"
      >
        <template #status="{ rows }">
          <el-tag type="warning" v-if="rows.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">已开始</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
        </template>
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = false;
            "
            >新增实践课程</el-button
          >
          <el-button type="success" @click="daochu()">
            <el-icon style="margin-right: 5px"
              ><el-icon><UploadFilled /></el-icon
            ></el-icon>
            导出
          </el-button>
          <el-select
            v-model="gg"
            placeholder="年级"
            style="width: 200px; margin-left: 10px"
          >
            <el-option
              v-for="item in grades"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
            <el-select
            v-model="mm"
            placeholder="专业"
            style="width: 200px; margin-left: 10px"
          >
            <el-option
              v-for="item in majors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增实践课程'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
      bu
    >
      <TableEdit
        :form-data="rowData"
        :options="isEdit ? options : newoptions"
        :edit="isEdit"
        :update="updateData"
      />
    </el-dialog>
    <el-dialog
      title="查看详情"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <TableDetail :data="viewData">
        <template #status="{ rows }">
          <el-tag type="warning" v-if="rows.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">已开始</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive,watch } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import {
  fetchCourseData,
  DeleteCourseData,
  SearchCourse,
  createCourse,
  updateCourse,
  exportCourseData,
  fetchAdminData,
} from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
const router = useRouter();
const goTologon = () => {
  // 使用 router.push 方法进行页面跳转
  router.push("/login");
  ElMessage.error("获取数据失败");
};
console.log(TableSearch.props, "search");
const startTime = ref("");
const endTime = ref("");
// 查询相关
const query = reactive({
  //name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "实践课程编号：", prop: "projectpracticeCode" },
  // { type: "input", label: "专业：", prop: "majorName" },
  // { type: "input", label: "年级：", prop: "grade" },
  { type: "input", label: "负责人：", prop: "adminName" },
]);

// 表格相关
let columns = ref([
  //{ type: "index", label: "序号", width: 55, align: "center" },
  { type: "selection", width: 55, align: "center" },
  { prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "projectpracticeCode", label: "实践课程编号", width: 200 },
  { prop: "schoolCode", label: "教务课程编号", width: 150 },
  { prop: "projectpracticeName", label: "实践课程名称", width: 250 },
  { prop: "majorName", label: "专业", width: 200 ,sortable :true},
  { prop: "grade", label: "年级", width: 85 ,sortable :true},
  { prop: "adminName", label: "负责人", width: 100,sortable :true },
  { prop: "titleTime", label: "教师出题时间", width: 250 },
  { prop: "selectTime", label: "学生选课时间", width: 250 },
  { prop: "status", label: "状态", width: 100 },
  { prop: "operatorno", label: "操作", width: 250, fixed: "right" },
]);
const page = reactive({
  index: 1,
  size: 20,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref<User[]>([]);
const getData = async (e, p, m, g, a) => {
  const ress = await fetchCourseData(e, p, m, g, a);
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  tableData.value = ress.ProjectPracticeInfoList;
  page.total = ress.total;
  localStorage.setItem("majorName", ress.majorName);
  //console.log(localStorage.getItem("majorName"),'sdsdsa',ress.majorName)
  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, 0, "", "", "");
const getadmindata = async () => {
  const ress = await fetchAdminData();
  if (ress.code != 50) {
    let op = ress.data.propracticeList;
    // let esp = [];
    // op.forEach((item) => {
    //   esp.push(item.projectPracticeCode);
    // });
    localStorage.setItem("v_codes", JSON.stringify(op));
  } else {
    goTologon();
  }
};
getadmindata();
const mm = ref("");
const gg = ref("");
const aa = ref("");
const handleSearch = async (queryData) => {
  
  aa.value = queryData.adminName;
  if (
    !queryData.projectpracticeCode &&!queryData.adminName
  ) {
    getData(1, 0, mm.value, gg.value, aa.value);
  } else if (queryData.projectpracticeCode) {
    const ress = await SearchCourse(queryData.projectpracticeCode);
    if (ress == null) {
      ElMessage.error("查询失败");
    } else {
      tableData.value = ress.ProjectPracticeInfoList;
      page.total = ress.total;
      componentKey.value++;
    }
  } else {
    getData(1, 0, mm.value, gg.value, aa.value);
  }
};
// 专业数据
const majors = ref([
  {label: "全部", value: ""},
  { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
  { label: "电子科学与技术", value: "电子科学与技术" },
  { label: "自动化", value: "自动化" },
  { label: "机器人工程", value: "机器人工程" },
]);
const mappings = {
  "机械设计制造及其自动化": "0101",
  "电子科学与技术": "0102",
  "机器人工程": "0104",
  "自动化": "0103",
};
// 生成最近四年的年级数据
const currentYear = new Date().getFullYear();
const grades = ref([{label: "全部", value: ""}]);
for (let i = 0; i < 4; i++) {
  const gradeYear = currentYear - i;
  grades.value.push({
    label: `${gradeYear}`,
    value: `${gradeYear}`,
  });
}
watch(mm, (newValue, oldValue) => {
  getData(1, 0, mm.value, gg.value, aa.value);
});
watch(gg, (newValue, oldValue) => {
  getData(1, 0, mm.value, gg.value, aa.value);
})
async function daochu() {
  ElMessageBox.confirm("确定要导出表格吗？", "提示", {
    type: "info",
  })
    .then(async () => {
      const res = await exportCourseData();
      if (res.code == 50)
        ElMessage({
          type: "warning",
          message: "导出失败",
        });
      else {
        const url = window.URL.createObjectURL(
          new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.xlsx"); // 设置下载的文件名
        link.style.display = "none"; // 隐藏元素
        document.body.appendChild(link);
        link.click();

        // 清理 DOM 和释放 URL 对象
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        ElMessage({
          type: "success",
          message: "导出成功",
        });
      }
    })
    .catch(() => {});
}
const changePage = (val: number, name: string, p) => {
  page.index = val;
  getData(page.index, p, mm.value, gg.value, aa.value);
};
function formatDate(dateString) {
  // 创建 Date 对象
  const date = new Date(dateString);

  // 获取年、月、日、时、分、秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回的月份是从 0 开始的
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 格式化月份和日期，确保它们是两位数
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // 组合成目标格式
  return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
function getRecentYears(numYears) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < numYears; i++) {
    years.push({
      label: currentYear - i,
      value: currentYear - i,
    });
  }
  return years;
}

const recentYears = getRecentYears(4); // 获取最近3年
// 新增/编辑弹窗相关
let options = ref({
  labelWidth: "140px",
  span: 22,
  list: [
    {
      type: "alert",
    },
    {
      type: "select",
      label: "年级",
      prop: "grade",
      required: true,
      options: recentYears,
    },
    {
      type: "select",
      label: "专业",
      prop: "majorName",
      required: true,
      options: [
        { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
        { label: "电子科学与技术", value: "电子科学与技术" },
        { label: "自动化", value: "自动化" },
        { label: "机器人工程", value: "机器人工程" },
      ],
    },
    {
      type: "selectname",
      label: "实践课程名称",
      prop: "projectpracticeName",
      required: true,
    },
    {
      type: "input",
      label: "教务课程编号",
      prop: "schoolCode",
      required: true,
    },
    {
      type: "select",
      label: "状态",
      prop: "status",
      required: true,
      options: [
        { label: "未开始", value: 0 },
        { label: "已停止", value: 2 },
        { label: "已开始", value: 1 },
      ],
    },
    {
      type: "date",
      label: "教师出题开始时间",
      prop: "titleStime",
      required: true,
    },
    {
      type: "date",
      label: "教师出题结束时间",
      prop: "titleEtime",
      required: true,
    },
    {
      type: "date",
      label: "学生选课开始时间",
      prop: "selectStime",
      required: true,
    },
    {
      type: "date",
      label: "学生选课结束时间",
      prop: "selectEtime",
      required: true,
    },
    //{ type: "input", label: "负责人", prop: "adminName", required: true },
  ],
});
let newoptions = ref({
  labelWidth: "140px",
  span: 22,
  list: [
    {
      type: "alert",
    },
    {
      type: "select",
      label: "年级",
      prop: "grade",
      required: true,
      options: recentYears,
    },
    {
      type: "select",
      label: "专业",
      prop: "majorName",
      required: true,
      options: [
        { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
        { label: "电子科学与技术", value: "电子科学与技术" },
        { label: "自动化", value: "自动化" },
        { label: "机器人工程", value: "机器人工程" },
      ],
    },
    {
      type: "selectname",
      label: "实践课程名称",
      prop: "projectpracticeName",
      required: true,
    },
    {
      type: "input",
      label: "教务课程编号",
      prop: "schoolCode",
      required: true,
    },
    {
      type: "select",
      label: "状态",
      prop: "status",
      required: true,
      options: [
        { label: "未开始", value: 0 },
        { label: "已停止", value: 2 },
        { label: "已开始", value: 1 },
      ],
    },
    {
      type: "date",
      label: "教师出题开始时间",
      prop: "titleStime",
      required: true,
    },
    {
      type: "date",
      label: "教师出题结束时间",
      prop: "titleEtime",
      required: true,
    },
    {
      type: "date",
      label: "学生选课开始时间",
      prop: "selectStime",
      required: true,
    },
    {
      type: "date",
      label: "学生选课结束时间",
      prop: "selectEtime",
      required: true,
    },
    //{ type: "input", label: "负责人", prop: "adminName", required: true },
  ],
});
const visible = ref(false);
const visible2 = ref(false);
const isEdit = ref(false);
const isEdits = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
  getData(1, 0, mm.value, gg.value, aa.value);
};
const mapping = {
  机械设计制造及其自动化: "0101",
  电子科学与技术: "0102",
  机器人工程: "0104",
  自动化: "0103",
};
const updateData = async (e) => {
  e.selectEtime = formatDate(e.selectEtime);
  e.selectStime = formatDate(e.selectStime);
  e.titleEtime = formatDate(e.titleEtime);
  e.titleStime = formatDate(e.titleStime);
  e.majorCode = mapping[e.majorName];
  if (isEdit.value) {
    console.log(e, "编辑数据");

    if ("projectpracticeCode" in rowData.value) {
      e.projectpracticeCode = rowData.value.projectpracticeCode;
      const res = await updateCourse(e);
      console.log(res, "更新数据");
      if(res.code == 200){
      ElMessage({
        type: 'success',
        message: '添加成功',
      })
    }
    else if(res.code == 50){
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
    } else {
      console.log("无数据");
    }
  } else {
    const res = await createCourse(e);
    console.log(res, "新建数据");
    if(res.code == 200){
      ElMessage({
        type: 'success',
        message: '添加成功',
      })
    }
    else if(res.code == 50){
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }
  closeDialog();
  setTimeout(() => {
    getData(1, 0, "", "", "");
  }, 500);
};

const closeDialog = () => {
  visible.value = false;
  visible2.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
});
const handleView = (row: User) => {
  viewData.value.row = { ...row };
  viewData.value.list = [
    {
      prop: "ad",
      label: "序号",
    },
    {
      prop: "projectpracticeCode",
      label: "实践课程编号",
    },
    {
      prop: "schoolCode",
      label: "教务课程编号",
    },
    {
      prop: "projectpracticeName",
      label: "实践课程名称",
    },

    {
      prop: "majorName",
      label: "专业",
    },
    {
      prop: "grade",
      label: "年级",
    },
    {
      prop: "adminName",
      label: "负责人",
    },
    {
      prop: "titleTime",
      label: "教师出题时间",
    },
    {
      prop: "selectTime",
      label: "学生选课时间",
    },
    {
      prop: "status",
      label: "状态",
    },
  ];
  visible1.value = true;
};
const handleDelSelection = (e) => {
  let delt = [];
  if (e.length > 0) {
    e.forEach((value) => {
      delt.push(value.projectpracticeCode);
    });
  }
  DeleteCourseData(delt)
    .then((res) => {
      ElMessage.success("删除成功");
      getData(1, 0, mm.value, gg.value, aa.value);
      page.index = 1;
    })
    .catch((err) => {
      ElMessage.error("删除失败");
    });
};
// 删除相关
const handleDelete = async (row) => {
  //console.log(row, "删除");
  const res = await DeleteCourseData(row.projectpracticeCode);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, 0, mm.value, gg.value, aa.value);
  page.index = 1;
};
</script>

<style scoped></style>
