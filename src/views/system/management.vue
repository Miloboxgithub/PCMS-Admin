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
              @click="visible = true ; isEdit = false"
              >新增管理员</el-button
            >

          </template>
        </TableCustom>
      </div>
      <el-dialog
        :title="isEdit ? '编辑' : '新增管理员'"
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
  import { ref, reactive } from "vue";
  import { ElMessage } from "element-plus";
  import { CirclePlusFilled } from "@element-plus/icons-vue";
  import { User } from "@/types/user";
  import { fetchManageData, DeleteAdminData, SearchAdmin ,createAdmin,updateAdmin,exportCourseData} from "@/api";
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
    { type: "input", label: "查询：", prop: "name" },
  ]);
  
  // 表格相关
  let columns = ref([
    //{ type: "index", label: "序号", width: 55, align: "center" },
    { type: "selection", width: 55, align: "center" },
    { prop: "ad", label: "序号", width: 55, align: "center" },
    { prop: "adminName", label: "管理员姓名" },
    { prop: "adminSno", label: "管理员工号" ,sortable: true},
    { prop: "email", label: "邮箱"},
    { prop: "CollegeName", label: "学院" },
    { prop: "majorName", label: "专业" },
    {prop: "grade", label: "年级" },
    { prop: "phone", label: "电话号码" },
    { prop: "operator", label: "操作", width: 250 },
  ]);
  const page = reactive({
    index: 1,
    size: 10,
    total: 0,
  });
  const componentKey = ref(0); // 强制刷新组件
  const tableData = ref<User[]>([]);
  const getData = async (e, p) => {
    const ress = await fetchManageData(e, p,'');
    if (ress == "Request failed with status code 403") {
      goTologon();
    }
    tableData.value = ress.AdminAdmins;
    page.total = ress.total;
  
    componentKey.value++;
    console.log(ress, tableData.value, "tableData");
  };
  getData(1, 0);
  const handleSearch = async (queryData) => {
    if(!queryData.name){
      getData(1, 0);
    }
    else{
    const ress = await fetchManageData(1,0,queryData.name);
      if(ress.AdminAdmins==null){
        ElMessage.error("查询失败");
      }
      else{
        console.log(ress, "ress");
        
      tableData.value = ress.AdminAdmins;
      page.total = ress.AdminAdmins.length;
      componentKey.value++;
      ElMessage.success("查询成功");
      }
    }
  };
  async function daochu(){
    ElMessageBox.confirm("确定要导出表格吗？", "提示", {
      type: "info",
    })
      .then(async () => {
        const res = await exportCourseData()
        if(res.code == 50)
        ElMessage({
          type: "warning",
          message: "导出失败"
        })
      })
      .catch(() => {
        
      });
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
  function getRecentYears(numYears) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < numYears; i++) {
    years.push({
      label: currentYear - i,
      value: currentYear - i
    });
  }
  return years;
}

const recentYears = getRecentYears(4); // 获取最近3年
  // 新增/编辑弹窗相关
  let options = ref<FormOption>({
    labelWidth: "140px",
    span: 12,
    list: [
      {
        type: "input",
        label: "姓名",
        prop: "adminName",
        required: true,
      },
      {
        type: "input",
        label: "工号",
        prop: "adminSno",
        required: true,
      },
      {
        type: "input",
        label: "电话",
        prop: "phone",

      },
      {
        type: "input",
        label: "邮箱",
        prop: "email",

      },
      {
        type: "select",
        label: "专业",
        prop: "majorName",
        required: true,
        options: [
          { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
          {label:"电子科学与技术",value:"电子科学与技术"},
          { label: "自动化", value: "自动化" },
          {label:"机器人工程",value:"机器人工程"}
        ],
      },
      {
        type: "select",
        label: "学院",
        prop: "CollegeName",
        required: true,
        options: [{
          label: "中德智能制造学院",
          value: "中德智能制造学院",
        }, {
          label: "大数据与互联网学院",
          value: "大数据与互联网学院",
        }
//         中德智能制造学院：JX002
// 大数据与互联网学院：JX003
        ],
      },
      {
        type: "select",
        label: "年级",
        prop: "grade",
        required: true,
        options: recentYears,
      },
    ],
  });
  let newoptions = ref<FormOption>({
    labelWidth: "140px",
    span: 12,
    list: [
      {
        type: "input",
        label: "姓名",
        prop: "adminName",
        required: true,
      },
      {
        type: "input",
        label: "工号",
        prop: "adminSno",
        required: true,
      },
      {
        type: "input",
        label: "密码",
        prop: "password",
        required: true,
      },
      {
        type: "select",
        label: "专业",
        prop: "majorName",
        required: true,
        options: [
          { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
          {label:"电子科学与技术",value:"电子科学与技术"},
          { label: "自动化", value: "自动化" },
          {label:"机器人工程",value:"机器人工程"}
        ],
      },
      {
        type: "select",
        label: "学院",
        prop: "CollegeName",
        required: true,
        options: [{
          label: "中德智能制造学院",
          value: "中德智能制造学院",
        }, {
          label: "大数据与互联网学院",
          value: "大数据与互联网学院",
        }
//         中德智能制造学院：JX002
// 大数据与互联网学院：JX003
        ],
      }, {
        type: "select",
        label: "年级",
        prop: "grade",
        required: true,
        options: recentYears,
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
  const mapping = {
    "机械设计制造及其自动化": "0101",
    "电子科学与技术": "0102",
    "机器人工程": "0104",
    "自动化": "0103",
  };
  const updateData = async (e) => {
    e.majorCode = mapping[e.majorName]
    if(isEdit.value){

 
      const res = await updateAdmin(e)
      console.log(res, "更新数据");

    }
    else{
      
      const res = await createAdmin(e) 
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
        prop: "ad",
        label: "序号",
      },
      {
        prop: "adminName",
        label: "姓名",
      },
      {
        prop: "adminSno",
        label: "工号",
      },
      {
        prop: "majorName",
        label: "专业",
      },
      {
        prop: "CollegeName",
        label: "学院",
      },
      {
        prop: "grade",
        label: "年级",
      },
      {
        prop: "phone",
        label: "电话",
      },
      {
        prop: "email",
        label: "邮箱",
      },

    ];
    visible1.value = true;
  };
  const handleDelSelection = (e) => {
    let delt = []
    if (e.length > 0) {
    e.forEach((value) => {
      delt.push(value.adminSno)
    });
  }
    DeleteAdminData(delt).then((res) => {
      ElMessage.success("删除成功");
      getData(1, 0);
      page.index = 1;
    }).catch((err) => {
      ElMessage.error("删除失败");
    })
  }
  // 删除相关
  const handleDelete = async (row) => {
    let ttt = [row.adminSno]
    const res = await DeleteAdminData(ttt);
    if (res.code!=50) {
      ElMessage.success("删除成功");
    } else {
      ElMessage.error("删除失败");
    }
    getData(1, 0);
    page.index = 1;
  };
  </script>
  
  <style scoped></style>
  