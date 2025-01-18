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
        <template #selectStatus="{ rows }">
          <el-tag type="warning" v-if="rows.selectStatus == 0">未选课</el-tag>
          <el-tag type="success" v-else-if="rows.selectStatus == 1"
            >已选课</el-tag
          >
        </template>
        <template #toolbarBtn>
          <el-button type="success" @click="daochu()">
            <el-icon style="margin-right: 5px"
              ><el-icon><UploadFilled /></el-icon
            ></el-icon>
            导出
          </el-button>
          <!-- <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = false;
            "
            >新增数据</el-button
          > -->
          <!-- <el-select
            v-model="xuan"
            placeholder="Select"
            style="width: 100px; margin-left: 10px"
          >
            <el-option
              v-for="item in Projectxuan"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <div style="margin-left: 10px;">
            <el-checkbox v-model="yesxuan" label="已选课" border />
          </div>
          <div style="margin-left: 10px;"><el-checkbox v-model="noxuan" label="未选课" border /></div>
          <el-select
            v-model="practiceName"
            placeholder="Select"
            style="width: 240px; margin-left: 10px"
          >
            <el-option
              v-for="item in Projectpractice"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="rrr">
            <div>专业总人数：{{ zhong }}人</div>
            <div>已选课人数：{{ yixuan }}人</div>
            <div>未选课人数：{{ weixuan }}人</div>
          </div>
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增数据'"
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
          <el-tag type="warning" v-if="rows.selectStatus == 0">未选课</el-tag>
          <el-tag type="success" v-else-if="rows.selectStatus == 1"
            >已选课</el-tag
          >
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import {
  fetchStudentCourseData,
  DeleteStudentCourseData,
  SearchCourse,
  createStudentCourse,
  updateCourse,
  exportStudentCourseData,
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
const yesxuan =ref(false);
const noxuan =ref(false);
// 查询相关
const query = reactive({
  //name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "姓名查询：", prop: "name" },
  { type: "input", label: "学号查询", prop: "sno" },
]);
const zhong = ref(0);
const weixuan = ref(0);
const yixuan = ref(0);
// 表格相关
let columns = ref([
  //{ type: "index", label: "序号", width: 55, align: "center" },
  { type: "selection", width: 55, align: "center" },
  { prop: "ad", label: "序号", width: 55, align: "center" },

  { prop: "name", label: "姓名" },
  { prop: "sno", label: "学号" },
  { prop: "phone", label: "电话" },
  { prop: "class", label: "班级" },
  { prop: "title", label: "题目" },
  { prop: "teacher_name", label: "指导老师" },
  { prop: "code", label: "选课课题编号" },
  { prop: "selectStatus", label: "状态" },

  { prop: "operators", label: "操作", width: 200 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const Projectpractice = ref([]);
const Projectxuan = ref([
  {
    value: "",
    label: "全部",
  },
  {
    value: "0",
    label: "未选课",
  },
  {
    value: "1",
    label: "已选课",
  },
]);
const practiceName = ref("");
const xuan = ref("");
// 监听practiceName的变化
watch(practiceName, (newValue, oldValue) => {
  console.log(`选中的值从 ${oldValue} 变为 ${newValue}`);
  // 在这里调用你需要的函数
  getData(1, 0);
});
watch(yesxuan, (newValue, oldValue) => {
  console.log(`yesxuan选中的值从 ${oldValue} 变为 ${newValue}`);

  // 在这里调用你需要的函数
  getData(1, 0);
});
watch(noxuan, (newValue, oldValue) => {
  console.log(`noxuan选中的值从 ${oldValue} 变为 ${newValue}`);

  // 在这里调用你需要的函数
  getData(1, 0);
})
const componentKey = ref(0); // 强制刷新组件
const tableData = ref<User[]>([]);
let esp = localStorage.getItem("v_codes");
esp = JSON.parse(esp);
console.log(esp, "esp");
if (Array.isArray(esp)) {
  esp.forEach((element) => {
    Projectpractice.value.push({
      value: element.projectPracticeCode,
      label: element.projectPracticeName,
    });
  });
}
if (Projectpractice.value.length > 0) {
  practiceName.value = Projectpractice.value[0].value;
}
const getData = async (e, p) => {
  const ress = await fetchStudentCourseData(e, p, practiceName.value, "", "");
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  if ((yesxuan.value == false&&noxuan.value==false)|| (yesxuan.value == true && noxuan.value == true)) {
    tableData.value = ress.SelectCourseInfoList;
    page.total = ress.total;
  } else if(yesxuan.value == true){
    tableData.value = ress.SelectCourseInfoList.filter(
      (item) => item.selectStatus == 1
    );
    page.total = ress.SelectCourseInfoList.filter(
      (item) => item.selectStatus == 1
    ).length;
  }
  else if(noxuan.value == true){
    tableData.value = ress.SelectCourseInfoList.filter(
      (item) => item.selectStatus == 0
    );
    page.total = ress.SelectCourseInfoList.filter(
      (item) => item.selectStatus == 0
    ).length;
  }
  zhong.value = ress.zhong;
  yixuan.value = ress.yixuan;
  weixuan.value = ress.weixuan;
  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, 0);
const handleSearch = async (queryData) => {
  if (!queryData.name && !queryData.sno) {
    getData(1, 0);
  } else {
    const ress = await fetchStudentCourseData(
      1,
      0,
      practiceName.value,
      queryData.name,
      queryData.sno
    );
    if (ress == null) {
      ElMessage.error("查询失败");
    } else {
      tableData.value = ress.SelectCourseInfoList;
      page.total = ress.total;
      componentKey.value++;
    }
  }
};
async function daochu() {
  ElMessageBox.confirm("确定要导出表格吗？", "提示", {
    type: "info",
  })
    .then(async () => {
      const res = await exportStudentCourseData(practiceName.value);
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
  getData(page.index, p);
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
// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "140px",
  span: 12,
  list: [
    {
      type: "input",
      label: "学生姓名",
      prop: "name",
      required: true,
    },
    {
      type: "input",
      label: "学号",
      prop: "sno",
      required: true,
    },
    {
      type: "input",
      label: "电话",
      prop: "phone",
      required: true,
    },
    {
      type: "input",
      label: "班级",
      prop: "class",
      required: true,
    },
    {
      type: "input",
      label: "题目",
      prop: "title",
      required: true,
    },
    {
      type: "input",
      label: "指导老师",
      prop: "teacher_name",
      required: true,
    },
    {
      type: "select",
      label: "状态",
      prop: "selectStatus",
      required: true,
      options: [
        { label: "已选课", value: 1 },
        { label: "未选课", value: 0 },
      ],
    },
  ],
});
let newoptions = ref<FormOption>({
  labelWidth: "140px",
  span: 12,
  list: [
    {
      type: "input",
      label: "学生姓名",
      prop: "name",
      required: true,
    },
    {
      type: "input",
      label: "学号",
      prop: "sno",
      required: true,
    },
    {
      type: "input",
      label: "电话",
      prop: "phone",
      required: true,
    },
    {
      type: "input",
      label: "班级",
      prop: "class",
      required: true,
    },
    {
      type: "input",
      label: "题目",
      prop: "title",
      required: true,
    },
    {
      type: "input",
      label: "指导老师",
      prop: "teacher_name",
      required: true,
    },
    {
      type: "select",
      label: "状态",
      prop: "selectStatus",
      required: true,
      options: [
        { label: "已选课", value: 1 },
        { label: "未选课", value: 0 },
      ],
    },
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
  getData(1, 0);
};
const updateData = async (e) => {
  if (isEdit.value) {
    console.log(e, "编辑数据");
    // e.projectpracticeCode = rowData.value.projectpracticeCode;
    // const res = await updateCourse(e);
    // console.log(res, "更新数据");
  } else {
    const res = await createStudentCourse(e);
    if (res.code != 50) {
      ElMessage.success("新建成功");
    } else {
      ElMessage.error("新建失败");
    }
    console.log(res, "新建数据");
  }
  closeDialog();
  setTimeout(() => {
    getData(1, 0);
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
      prop: "name",
      label: "学生姓名",
    },
    {
      prop: "sno",
      label: "学号",
    },
    {
      prop: "phone",
      label: "电话",
    },
    {
      prop: "class",
      label: "班级",
    },
    {
      prop: "title",
      label: "题目",
    },
    {
      prop: "teacher_name",
      label: "指导老师",
    },
    {
      prop: "code",
      label: "题目编号",
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
      delt.push({
        StudentSno: value.sno,
        TitleCode: value.code,
      });
    });
  }
  DeleteStudentCourseData(delt)
    .then((res) => {
      ElMessage.success("删除成功");
      getData(1, 0);
      page.index = 1;
    })
    .catch((err) => {
      ElMessage.error("删除失败");
    });
};
// 删除相关
const handleDelete = async (row) => {
  //console.log(row, "删除");
  let ttt = [
    {
      StudentSno: row.sno,
      TitleCode: row.code,
    },
  ];
  const res = await DeleteStudentCourseData(ttt);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, 0);
  page.index = 1;
};
</script>

<style scoped>
.rrr {
  margin-left: 10px;
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: MiSans;
  font-weight: 500;
  font-size: 16px;
  color: #606266;
}
</style>
