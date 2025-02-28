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
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = false;
            "
            >新增数据</el-button
          >
          <el-button type="danger" @click="moban()">
              <el-icon style="margin-right: 5px"><el-icon><Bottom /></el-icon></el-icon>
              下载模板
            </el-button>
          <el-button type="primary" @click="openUploadDialog()">
              <el-icon style="margin-right: 5px"><el-icon><UploadFilled /></el-icon></el-icon>
              批量导入
            </el-button>
            <el-button type="success" @click="daochu()">
              <el-icon style="margin-right: 5px"><el-icon><UploadFilled /></el-icon></el-icon>
              导出
            </el-button>
            <el-select
            v-model="xx"
            placeholder="学院"
            style="width: 200px; margin-left: 10px"
          >
            <el-option
              v-for="item in college"
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
              v-for="item in majorss"
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
      </TableDetail>
    </el-dialog>
    <el-dialog
    v-model="uploadDialogVisible"
    title="请选择要导入教师专业"
    width="500"
  >
  <el-form ref="form" label-width="120px">
    <el-form-item label="专业" required>
      <el-select v-model="mmm" placeholder="请选择专业">
        <el-option
          v-for="item in majors"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleFormSubmit">确认</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive ,watch} from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import {
  fetchTeacherData,
  DeleteTeacherData,
  createTeacher,
  updateTeacher,
  exportTeacherData,
  getTemplate,
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
  { type: "input", label: "查询：", prop: "sno" },
]);
// 初始化专业和年级的响应式变量
const mmm = ref('');
// 专业数据
const majors = ref([
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
// 表单提交处理函数
const handleSubmit = () => {
  console.log('Selected Major:', mmm.value);
  // 在这里可以添加更多的逻辑，例如发送数据到服务器
  daoru(mmm.value, mappings[mmm.value]);
  uploadDialogVisible.value = false;
};

// 监听表单提交事件
const form = ref(null);
const handleFormSubmit = () => {
  if (!mmm.value ) {
    ElMessage.error('请先选择专业');
    return;
  }
  handleSubmit();
};
const openUploadDialog = () => {
  // 设置弹窗可见
  uploadDialogVisible.value = true;
};
const majorss = ref([
  {label: "全部", value: ""},
  { label: "机械设计制造及其自动化", value: "0101" },
  { label: "电子科学与技术", value: "0102" },
  { label: "自动化", value: "0103" },
  { label: "机器人工程", value: "0104" },
]);
const college = ref([
  {label: "全部", value: ""},
  { label: "中德智能制造学院", value: "JX002" },
  { label: "大数据与互联网学院", value: "JX003" },
])
const xx = ref("");
const mm = ref("");
watch(mm, (newValue, oldValue) => {
  // 在这里调用你需要的函数
  getData(1, 0);
});
watch(xx, (newValue, oldValue) => {
  getData(1, 0);
})
const uploadDialogVisible = ref(false);
// 表格相关
let columns = ref([
  //{ type: "index", label: "序号", width: 55, align: "center" },
  { type: "selection", width: 55, align: "center" },
  { prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "name", label: "教师姓名" },
  { prop: "sno", label: "工号" },
  { prop: "phone", label: "电话" },
  { prop: "email", label: "邮箱" },
  { prop: "major_name", label: "专业" },
  { prop: "CollegeName", label: "学院" },
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
  const ress = await fetchTeacherData(e, p,'',xx.value,mm.value);
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  tableData.value = ress.TeacherInfoList;
  page.total = ress.total;

  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, 0);
const handleSearch = async (queryData) => {
  console.log(queryData.sno, "queryData");
  if (!queryData.sno) {
    getData(1, 0);
  } else {
    const ress = await fetchTeacherData(1,0,queryData.sno,xx.value,mm.value);
    if (ress == null) {
      ElMessage.error("查询失败");
    } else {
      tableData.value = ress.TeacherInfoList;
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
      const res = await exportTeacherData();
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
const daoru = async (a,b) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx, .xls"; // 限制只能选择Excel文件

  input.addEventListener("change", async(e) => {
    const eventTarget = e.target as HTMLInputElement;
    const files = eventTarget.files;
    if (files.length === 0) {
      ElMessage.error("请选择文件");
      return;
    }

    const file = files[0];
    // if (file.size > 524288) { // 限制文件大小为500KB
    //   alert('File size should be less than 500KB.');
    //   return;
    // }
    try {
      const formData = new FormData();
      formData.append("teacherfile", file);
      formData.append('majorname', a);
      formData.append('majorcode', b);
      const response =await axios.post('/api/superadmin/createbatchteacher', formData, {
        headers: {
          
          Authorization: localStorage.getItem("vuems_token"),
          
        },
        responseType: "blob",
      });

      // 假设后端返回状态码200表示成功
      if (response.data.code != 50) {
        console.log("File uploaded successfully:", response);
        ElMessage.success("文件导入成功");
        setTimeout(() => {
          getData(1, 0);
        }, 500);
        // 检查是否有错误信息表格返回
      if (response.data.size!=52) {
        
        // 触发弹窗让用户选择是否下载错误表格
        ElMessageBox.confirm(
          `导入表格有错误信息，是否下载错误教师名单？`,
          '提示',
          {
            confirmButtonText: '下载',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          console.log('User confirmed download');
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadErrorFile(blob, 'error_report.xlsx');
        }).catch(() => {
          // 用户取消下载
          console.log('Download cancelled');
        });
      }
      } else {
        ElMessage.error("导入错误");
      }
      
    } catch (error) {
      console.error("Error uploading file:", error);
      ElMessage.error("文件导入失败");
    }
  });

  input.click(); // 触发点击事件以打开文件选择对话框
};
const downloadErrorFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
};
async function moban() {
  ElMessageBox.confirm("确定要下载模板吗？", "提示", {
    type: "info",
  })
    .then(async () => {
      const res = await getTemplate('teacher');
      if (res.code == 50)
        ElMessage({
          type: "warning",
          message: "下载失败",
        });
      else {
        const url = window.URL.createObjectURL(new Blob([res],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template.xlsx'); // 设置下载的文件名
        link.style.display = 'none' // 隐藏元素
        document.body.appendChild(link);
        link.click();
        
        // 清理 DOM 和释放 URL 对象
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        ElMessage({
          type: "success",
          message: "下载成功",
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
      label: "姓名",
      prop: "name",
      required: true,
    },
    {
      type: "input",
      label: "工号",
      prop: "sno",
      required: true,
    },
    {
      type: "input",
      label: "手机号",
      prop: "phone",
      required: true,
    },
    {
      type: "input",
      label: "邮箱",
      prop: "email",
      required: true,
    },
    {
      type: "select",
      label: "专业",
      prop: "major_name",
      required: true,
      options: [
        { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
        { label: "电子科学与技术", value: "电子科学与技术" },
        { label: "自动化", value: "自动化" },
        { label: "机器人工程", value: "机器人工程" },
      ],
    },
    {
      type: "select",
      label: "学院",
      prop: "college_name",
      required: true,
      options: [
        { label: "中德智能制造学院", value: "中德智能制造学院" },
        { label: "大数据与互联网学院", value: "大数据与互联网学院" },
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
      label: "姓名",
      prop: "name",
      required: true,
    },
    {
      type: "input",
      label: "工号",
      prop: "sno",
      required: true,
    },
    {
      type: "input",
      label: "手机号",
      prop: "phone",
      required: true,
    },
    {
      type: "input",
      label: "邮箱",
      prop: "email",
      required: true,
    },
    {
      type: "select",
      label: "专业",
      prop: "major_name",
      required: true,
      options: [
        { label: "机械设计制造及其自动化", value: "机械设计制造及其自动化" },
        { label: "电子科学与技术", value: "电子科学与技术" },
        { label: "自动化", value: "自动化" },
        { label: "机器人工程", value: "机器人工程" },
      ],
    },
    {
      type: "select",
      label: "学院",
      prop: "college_name",
      required: true,
      options: [
        { label: "中德智能制造学院", value: "中德智能制造学院" },
        { label: "大数据与互联网学院", value: "大数据与互联网学院" },
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
const mapping = {
  机械设计制造及其自动化: "0101",
  电子科学与技术: "0102",
  机器人工程: "0104",
  自动化: "0103",
};
const mapp = {
  中德智能制造学院:"JX002",
  大数据与互联网学院:"JX003"
};
const updateData = async (e) => {
  e.major_code = mapping[e.major_name];
  e.college_code = mapp[e.college_name];
  if (isEdit.value) {
    const res = await updateTeacher(e);
    console.log(res, "更新数据");
    if(res.code!=50){
      ElMessage.success("编辑成功");
    }
    else{
      ElMessage.error("编辑失败");
    }
  } else {
    const res = await createTeacher(e);
    console.log(res, "新建数据");
    if(res.code!=50){
      ElMessage.success("新建成功");
    }
    else{
      ElMessage.error("新建失败");
    }
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
      label: "姓名",
    },
    {
      prop: "sno",
      label: "工号",
    },
    {
      prop: "phone",
      label: "电话",
    },
    {
      prop: "email",
      label: "邮箱",
    },
    {
      prop: "major_name",
      label: "专业",
    },
    {
      prop: "CollegeName",
      label: "学院",
    }
  ];
  visible1.value = true;
};
const handleDelSelection = (e) => {
  let delt = [];
  if (e.length > 0) {
    e.forEach((value) => {
      delt.push(value.sno);
    });
  }
  DeleteTeacherData(delt)
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
  let ttt=[row.sno]
  const res = await DeleteTeacherData(ttt);
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
