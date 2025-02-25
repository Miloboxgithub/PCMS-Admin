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
        <template #reimburse="{ rows }">
          <el-tag type="warning" v-if="rows.reimburse == 0">未报销</el-tag>
          <el-tag type="success" v-else-if="rows.reimburse == 1">已报销</el-tag>
          
        </template>
        <template #releaseStatus="{ rows }">
          <el-tag type="warning" v-if="rows.releaseStatus == 0">未发布</el-tag>
          <el-tag type="success" v-else-if="rows.releaseStatus == 1">已发布</el-tag>
        </template>
        
        <template #toolbarBtn>
          <!-- <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = false;
            "
            >新增数据</el-button
          > -->
          <el-button type="success" @click="daochu()">
              <el-icon style="margin-right: 5px"><el-icon><UploadFilled /></el-icon></el-icon>
              导出
            </el-button>
          <!-- <el-button type="primary" @click="visible2 = true">
              <el-icon style="margin-right: 5px"><CirclePlus /></el-icon>
              增添不可预约时段
            </el-button> -->
            <div style="margin-left: 10px;">
            <el-checkbox v-model="quanbu" label="全部" border />
          </div>
            <div style="margin-left: 10px;">
            <el-checkbox v-model="yesfabu" label="已发布" border />
          </div>
          <div style="margin-left: 10px;"><el-checkbox v-model="nofabu" label="未发布" border /></div>
          <div style="margin-left: 10px;">
            <el-checkbox v-model="yesbaoxiao" label="已报销" border />
          </div>
          <div style="margin-left: 10px;"><el-checkbox v-model="nobaoxiao" label="未报销" border /></div>
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
          <el-tag type="warning" v-if="rows.reimburse == 0">未报销</el-tag>
          <el-tag type="success" v-else-if="rows.reimburse == 1">已报销</el-tag>
        </template>
        <template #fabu="{ rows }">
          <el-tag type="warning" v-if="rows.releaseStatus == 0">未发布</el-tag>
          <el-tag type="success" v-else-if="rows.releaseStatus == 1">已发布</el-tag>
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
  fetchTeacherCourseData,
  DeleteTeacherCourseData,
  SearchCourse,
  createCourse,
  editTeacherCourse,
  exportTeacherCourseData,
  fetchAdminData,
} from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import { ElMessageBox } from "element-plus";
import axios from "axios";
import { useRouter } from "vue-router";
const yesfabu = ref(false);
const nofabu = ref(false);
const yesbaoxiao = ref(false);
const nobaoxiao = ref(false);
const quanbu = ref(true);
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
  { type: "input", label: "工号/姓名：", prop: "teacherName" },
  { type: "input", label: "指导地点", prop: "GuidancePlace" },
  { type: "input", label: "选课人数", prop: "StudentRequirements" },
]);

// 表格相关
let columns = ref([
  //{ type: "index", label: "序号", width: 55, align: "center" },
  { type: "selection", width: 55, align: "center" },
  { prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "code", label: "课题编号" ,width:200},
  //{ prop: "projectpracticeName", label: "实践课程名称",width: 250 },
  { prop: "title", label: "题目",width: 250 },
  { prop: "teacherName", label: "指导老师" ,width: 150},
  { prop: "teacherSno", label: "工号" ,width: 150},
  { prop: "guidanceTime", label: "指导时间", width: 150 },
  { prop: "guidancePlace", label: "指导地点" ,width: 150},
  {prop: "studentRequirements", label: "最大可选人数",width:150 },
  { prop: "studentHave", label: "已选人数",width:100 },
  { prop: "studentNeed", label: "剩余人数" ,width:100},
  { prop: "budget", label: "经费", width:100},
  {prop: "releaseStatus", label: "是否发布",width:100 },
  { prop: "reimburse", label: "是否已报销" ,width:100},
  { prop: "operator", label: "操作", width: 250 ,fixed: "right"},
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});

const Projectpractice = ref([]);
const practiceName = ref("");
// 监听practiceName的变化
watch(practiceName, (newValue, oldValue) => {
  console.log(`选中的值从 ${oldValue} 变为 ${newValue}`);
  // 在这里调用你需要的函数
  getData(1, 0);
});
watch(quanbu, (newValue, oldValue) => {
  if(newValue == true){
    yesfabu.value = false;
    nofabu.value = false;
    yesbaoxiao.value = false;
    nobaoxiao.value = false;
  }
  getData(1, 0);
})
watch(yesfabu, (newValue, oldValue) => {
  //console.log(`yesxuan选中的值从 ${oldValue} 变为 ${newValue}`);
  if(newValue == true){
    quanbu.value = false;
    nofabu.value = false;
  }
  // 在这里调用你需要的函数
  getData(1, 0);
});
watch(nofabu, (newValue, oldValue) => {
  //console.log(`noxuan选中的值从 ${oldValue} 变为 ${newValue}`);
  if(newValue == true){
    quanbu.value = false;
    yesfabu.value = false;
  }
  // 在这里调用你需要的函数
  getData(1, 0);
})
watch(nobaoxiao, (newValue, oldValue) => {
  //console.log(`noxuan选中的值从 ${oldValue} 变为 ${newValue}`);
  if(newValue == true){
    yesbaoxiao.value = false;
    quanbu.value = false;
  }
  // 在这里调用你需要的函数
  getData(1, 0);
})
watch(yesbaoxiao, (newValue, oldValue) => {
  //console.log(`noxuan选中的值从 ${oldValue} 变为 ${newValue}`);
  if(newValue == true){
    nobaoxiao.value = false;
    quanbu.value = false;
  }
  // 在这里调用你需要的函数
  getData(1, 0);
})
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
getadmindata()
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
  if(yesfabu.value==false&&nofabu.value==false&&yesbaoxiao.value==false&&nobaoxiao.value==false){
    quanbu.value = true;
  }
  let q='-1'
  let b='-1'
  if (yesfabu.value == true&&nofabu.value == false) {
    q = '1'
  }
  if (yesfabu.value == false&&nofabu.value == true) {
    q = '0'
  }
  if (yesbaoxiao.value == true&& nobaoxiao.value == false) {
    b = '1'
  }
  if (yesbaoxiao.value == false&& nobaoxiao.value == true) {
    b = '0'
  }
  const ress = await fetchTeacherCourseData(e, p, practiceName.value,'','','-1',q,b);
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  tableData.value = ress.SetTopicInfoList;
  page.total = ress.total;

  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, 0);

const handleSearch = async (queryData) => {
  if (!queryData.StudentRequirements&&!queryData.GuidancePlace&&!queryData.teacherName) {
    getData(1, 0);
  } else {
    let q='-1'
    let b='-1'
  if (yesfabu.value == true&&nofabu.value == false) {
    q = '1'
  }
  if (yesfabu.value == false&&nofabu.value == true) {
    q = '0'
  }
  if (yesbaoxiao.value == true&& nobaoxiao.value == false) {
    b = '1'
  }
  if (yesbaoxiao.value == false&& nobaoxiao.value == true) {
    b = '0'
  }
  let tst = queryData.StudentRequirements;
  if(queryData.StudentRequirements==undefined){
    tst='-1'
  }
    const ress = await fetchTeacherCourseData(1, 0, practiceName.value, queryData.teacherName, queryData.GuidancePlace, tst, q,b);
    if (ress == null) {
      ElMessage.error("查询失败");
    } else {
      tableData.value = ress.SetTopicInfoList;
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
      const res = await exportTeacherCourseData(practiceName.value);
      console.log(res,practiceName.value)
      if (res.code == 50)
        ElMessage({
          type: "warning",
          message: "导出失败",
        });
      else {
        const url = window.URL.createObjectURL(new Blob([res],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx'); // 设置下载的文件名
        link.style.display = 'none' // 隐藏元素
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
  labelWidth: "120px",
  span: 22,
  list: [
    // {
    //   type: "input",
    //   label: "题目编号",
    //   prop: "projectpracticeCode",
    //   required: true,
    // },
    {
      type: "sss",
      label: "选课学生管理",
      prop: "projectpracticeCode",
      required: true,
    },
    // {
    //   type: "input",
    //   label: "题目",
    //   prop: "title",
    //   required: true,
    // },
    // {
    //   type: "input",
    //   label: "指导老师",
    //   prop: "teacherName",
    //   required: true,
    // },
    {
      type: "input",
      label: "最大可选人数",
      prop: "studentRequirements",
      required: true,
    },
    {
      type: "input",
      label: "指导地点",
      prop: "guidancePlace",
      required: true,
    },
    {
      type: "input",
      label: "指导时间",
      prop: "guidanceTime",
      required: true,
    },
    {
      type: "input",
      label: "经费",
      prop: "budget",
      required: true,
    },
    {
      type: "select",
      label: "是否已报销",
      prop: "reimburse",
      required: true,
      options: [
        { label: "已报销", value: 1 },
        { label: "未报销", value: 0 },
      ],
    },
    //{ type: "input", label: "负责人", prop: "adminName", required: true },
  ],
});
let newoptions = ref<FormOption>({
  labelWidth: "120px",
  span: 22,
  list: [
    {
      type: "input",
      label: "题目",
      prop: "projectpracticeName",
      required: true,
    },
    {
      type: "sss",
      label: "已选课学生",
      prop: "",
    },
    {
      type: "input",
      label: "指导老师",
      prop: "teacher_name",
      required: true,
    },
    {
      type: "input",
      label: "最大可选人数",
      prop: "studentRequirements",
      required: true,
    },
    {
      type: "input",
      label: "指导地点",
      prop: "guidance_place",
      required: true,
    },
    {
      type: "date",
      label: "指导时间",
      prop: "guidance_time",
      required: true,
    },
    {
      type: "input",
      label: "经费",
      prop: "budget",
      required: true,
    },
    {
      type: "select",
      label: "是否已报销",
      prop: "reimburse",
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
  getData(1, 0);
};
const mapping = {
  "机械设计制造及其自动化": "0101",
  "电子科学与技术": "0102",
  "机器人工程": "0104",
  "自动化": "0103",
};
const updateData = async (e) => {

  if (isEdit.value) {
    console.log(e, "编辑数据");

    if ("projectpracticeCode" in rowData.value) {
      e.projectpracticeCode = rowData.value.projectpracticeCode;
      const res = await editTeacherCourse(e);
      console.log(res, "更新数据---");
    } else {
      console.log("无数据");
    }
  } else {
    const res = await createCourse(e);
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
      prop: "projectpracticeCode",
      label: "题目编号",
    },
    {
      prop: "title",
      label: "题目",
    },
    {
      prop: "projectpracticeName",
      label: "实践课程名称",
    },
    {
      prop: "teacherName",
      label: "指导老师",
    },
    {
      prop: "teacherSno",
      label: "工号",
    },
    {
      prop: "studentRequirements",
      label: "最大可选人数",
    },
    {
      prop: "content",
      label: "题目详情",
    },
    {
      prop: "resultDisplay",
      label: "题目交付要求",
    },
    {
      prop: "studentNeed",
      label: "剩余人数",
    },
    {
      prop: "guidancePlace",
      label: "地点",
    },
    {
      prop: "guidanceTime",
      label: "时间",
    },
    {
      prop: "budget",
      label: "经费",
    },
    {
      prop: "status",
      label: "是否报销",
    },
    {
      prop:"fabu",
      label:"发布状态"
    }
  ];
  visible1.value = true;
};
const handleDelSelection = (e) => {
  let delt = [];
  if (e.length > 0) {
    e.forEach((value) => {
      delt.push(value.code);
    });
  }
  DeleteTeacherCourseData(delt)
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
  const res = await DeleteTeacherCourseData(row.code);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, 0);
  page.index = 1;
};
</script>

<style scoped></style>
