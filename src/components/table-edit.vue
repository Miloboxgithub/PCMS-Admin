<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-width="options.labelWidth"
  >

    <el-row>
      <el-col :span="options.span" v-for="item in options.list">
        <el-form-item :label="item.label" :prop="item.prop">
          <!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
          <div style="width: 100%">
            <el-alert
              v-if="item.type === 'alert'"
              show-icon
              title="请先选择年级专业后再选择实践课程名称"
              type="info"
              :closable="false"
            />
          </div>
          <div v-if="item.type === 'sss'" style="width: 100%; height: 100%">
            <div style="border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px; width: 100%;">
            <div
              style="
                width: 100%;
                height: auto;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
              "
            >
              <div style="color: #2272fb; font-size: 12px;">
                指定学生（{{
                  stableData.filter((item) => item.isappointment == 1).length
                }}人）
              </div>
              <div style="color: #3b3f47; font-size: 12px">
                未指定（{{
                  stableData.filter((item) => item.isappointment == 0).length
                }}人）
              </div>
              <el-input
                v-model="inputname"
                style="width: 240px; margin-left: 10px; margin-right: 10px"
                placeholder="学生姓名/学号查询"
              />
              <el-button
                @click="searchStudent(inputname)"
                :icon="Search"
                circle
              />
            </div>
            <div class="window-content">
                <el-table :data="searchData" class="custom-table-font-size">
                  <el-table-column prop="name" label="姓名" width="60" />
                  <el-table-column prop="sno" label="学号" width="100" />
                  <el-table-column prop="major" label="专业" width="100" />
                  <el-table-column prop="class" label="班级" width="50" />
                  <el-table-column prop="phone" label="电话" width="100" />
                  <el-table-column fixed="right" label="操作" min-width="60">
                    <template #default="scope">
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click.prevent="addRow(scope.$index)"
                      >
                        添加
                      </el-button>
                      
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </div>
            <div class="scrollable-window">
              <div class="window-content">
                <el-table :data="stableData" class="custom-table-font-size">
                  <el-table-column prop="name" label="姓名" width="60" />
                  <el-table-column prop="sno" label="学号" width="100" />
                  <el-table-column prop="major" label="专业" width="100" />
                  <el-table-column label="是否被指定" width="80">
                    <template #default="scope">
                      <el-tag v-if="scope.row.isappointment == 1"
                        >被指定</el-tag
                      >
                      <el-tag v-else-if="scope.row.isappointment == 0" type="info">未指定</el-tag>
                      <el-tag v-else-if="scope.row.isappointment == 2" type="warning">待指定</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="class" label="班级" width="50" />
                  <el-table-column prop="phone" label="电话" width="100" />
                  <el-table-column fixed="right" label="操作" min-width="60">
                    <template #default="scope">
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click.prevent="deleteRow(scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <el-date-picker
            v-else-if="item.type === 'datetimerange'"
            v-model="form[item.prop]"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            controls-position="right"
          ></el-input-number>
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            @change="handleChange($event, item.prop, form[item.prop])"
          >
            <el-option
              v-for="opt in item.options"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'selectname'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="nnn in item.options"
              :label="nnn.label"
              :value="nnn.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'selects'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="opted in item.opted"
              :label="opted.label"
              :value="opted.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'status'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="status in item.status"
              :label="status.label"
              :value="status.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'st'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="st in item.st"
              :label="st.label"
              :value="st.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'sta'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="sta in item.sta"
              :label="sta.label"
              :value="sta.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            type="date"
            v-model="form[item.prop]"
            :value-format="item.format"
          ></el-date-picker>
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="form[item.prop]"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
          ></el-switch>
          <el-upload
            v-else-if="item.type === 'upload'"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form[item.prop]" :src="form[item.prop]" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <!-- <slot :name="item.prop" v-else> </slot> -->
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { FormOption } from "@/types/form-option";
import { FormInstance, FormRules, UploadProps,ElMessage } from "element-plus";
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
const numnum = ref(0);
const inputname = ref("");
const stableData = ref([]);
const searchData = ref([]);
const delstableData = ref([]);
const deleteRow = (index: number) => {
  if(stableData.value[index].isappointment!=2){
    delstableData.value.push(stableData.value[index]);
  }
  stableData.value.splice(index, 1);
};
const ggg = ref('')
const mam = ref('')
const handleChange = (event, a, b) => {
  console.log("事件对象：", event);
  console.log("第一个自定义值：", a);
  console.log("第二个自定义值：", b);
  if(a=='grade'){
    ggg.value = b
  }
  if(a=='majorName'){
    mam.value = b
  }
  if(ggg.value&&mam.value){
    options.list.forEach((item) => {
      if(item.prop=='projectpracticeName'){
        item.options = []
        if(mam.value=='电子科学与技术'){
          item.options =[
            {
              label: ggg.value+mam.value+'工程项目实践1',
              value: ggg.value+mam.value+'工程项目实践1',
            },
            {
              label: ggg.value+mam.value+'工程项目实践2',
              value: ggg.value+mam.value+'工程项目实践2',
            },
            {
              label: ggg.value+mam.value+'工程项目实践3',
              value: ggg.value+mam.value+'工程项目实践3',
            }
          ]
        }
        if(mam.value=='机械设计制造及其自动化'){
          item.options =[
            {
              label: ggg.value+mam.value+'基础实践',
              value: ggg.value+mam.value+'基础实践',
            },
            {
              label: ggg.value+mam.value+'中级实践',
              value: ggg.value+mam.value+'中级实践',
            },
            {
              label: ggg.value+mam.value+'高级实践',
              value: ggg.value+mam.value+'高级实践',
            }
          ]
        }
        if(mam.value=='自动化'){
          item.options =[
            {
              label: ggg.value+mam.value+'项目工作1',
              value: ggg.value+mam.value+'项目工作1',
            },
            {
              label: ggg.value+mam.value+'项目工作2',
              value: ggg.value+mam.value+'项目工作2',
            },
            {
              label: ggg.value+mam.value+'项目工作3',
              value: ggg.value+mam.value+'项目工作3',
            }
          ]
        }
        if(mam.value=='机器人工程'){
          item.options =[
            {
              label: ggg.value+mam.value+'基础实践1',
              value: ggg.value+mam.value+'基础实践1',
            },
            {
              label: ggg.value+mam.value+'基础实践2',
              value: ggg.value+mam.value+'基础实践2',
            },
            {
              label: ggg.value+mam.value+'基础实践3',
              value: ggg.value+mam.value+'基础实践3',
            }
          ]
        }
      }
    })
  }
};
const { options, formData, edit, update, edits } = defineProps({
  options: {
    type: Object as PropType<FormOption>,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  edit: {
    type: Boolean,
    required: false,
  },
  update: {
    type: Function,
    required: true,
  },
  edits: {
    type: Boolean,
    required: true,
  },
});
options.list.forEach((item) => {
  item.opts = [
    {
      label: "user",
      value: "user",
    },
    {
      label: "admin",
      value: "admin",
    },
  ];
  item.opted = [
    {
      label: "08:00-09:00",
      value: "08:00-09:00",
    },
    {
      label: "09:00-10:00",
      value: "09:00-10:00",
    },
    {
      label: "10:00-11:00",
      value: "10:00-11:00",
    },
    {
      label: "11:00-12:00",
      value: "11:00-12:00",
    },
    {
      label: "12:00-13:00",
      value: "12:00-13:00",
    },
    {
      label: "13:00-14:00",
      value: "13:00-14:00",
    },
    {
      label: "14:00-15:00",
      value: "14:00-15:00",
    },
    {
      label: "15:00-16:00",
      value: "15:00-16:00",
    },
    {
      label: "16:00-17:00",
      value: "16:00-17:00",
    },
    {
      label: "17:00-18:00",
      value: "17:00-18:00",
    },
    {
      label: "18:00-19:00",
      value: "18:00-19:00",
    },
    {
      label: "19:00-20:00",
      value: "19:00-20:00",
    },
  ];
  item.status = [
    {
      label: "正常",
      value: "正常",
    },
    {
      label: "不可预约",
      value: "不可预约",
    },
  ];
  item.st = [
    {
      label: "正常",
      value: "正常",
    },
    {
      label: "禁用",
      value: "禁用",
    },
  ];
  item.sta = [
    {
      label: "可预约",
      value: "可预约",
    },
    {
      label: "已预约",
      value: "已预约",
    },
    {
      label: "已取消",
      value: "已取消",
    },
    {
      label: "不可预约",
      value: "不可预约",
    },
  ];
});
const form = ref({ ...(edit ? formData : {}) });
console.log(form.value, "form");
console.log(options.list, "options.list");
if(edit){
  ggg.value = form.value.grade
  mam.value = form.value.majorName
  if(ggg.value&&mam.value){
    options.list.forEach((item) => {
      if(item.prop=='projectpracticeName'){
        item.options = []
        if(mam.value=='电子科学与技术'){
          item.options =[
            {
              label: ggg.value+mam.value+'工程项目实践1',
              value: ggg.value+mam.value+'工程项目实践1',
            },
            {
              label: ggg.value+mam.value+'工程项目实践2',
              value: ggg.value+mam.value+'工程项目实践2',
            },
            {
              label: ggg.value+mam.value+'工程项目实践3',
              value: ggg.value+mam.value+'工程项目实践3',
            }
          ]
        }
        if(mam.value=='机械设计制造及其自动化'){
          item.options =[
            {
              label: ggg.value+mam.value+'基础实践',
              value: ggg.value+mam.value+'基础实践',
            },
            {
              label: ggg.value+mam.value+'中级实践',
              value: ggg.value+mam.value+'中级实践',
            },
            {
              label: ggg.value+mam.value+'高级实践',
              value: ggg.value+mam.value+'高级实践',
            }
          ]
        }
        if(mam.value=='自动化'){
          item.options =[
            {
              label: ggg.value+mam.value+'项目工作1',
              value: ggg.value+mam.value+'项目工作1',
            },
            {
              label: ggg.value+mam.value+'项目工作2',
              value: ggg.value+mam.value+'项目工作2',
            },
            {
              label: ggg.value+mam.value+'项目工作3',
              value: ggg.value+mam.value+'项目工作3',
            }
          ]
        }
        if(mam.value=='机器人工程'){
          item.options =[
            {
              label: ggg.value+mam.value+'基础实践1',
              value: ggg.value+mam.value+'基础实践1',
            },
            {
              label: ggg.value+mam.value+'基础实践2',
              value: ggg.value+mam.value+'基础实践2',
            },
            {
              label: ggg.value+mam.value+'基础实践3',
              value: ggg.value+mam.value+'基础实践3',
            }
          ]
        }
      }
    })
  }
}
form.value.password = "";
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
getData(form.value.projectpracticeCode, form.value.code);
const rules: FormRules = options.list
  .map((item) => {
    if (item.required) {
      return {
        [item.prop]: [
          { required: true, message: `${item.label}不能为空`, trigger: "blur" },
        ],
      };
    }
    return {};
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});
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
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.value.appointStudent=stableData.value;
  form.value.deleteStudent=delstableData.value;
  //console.log(form.value, "form.value");
  update(form.value);
};
const addRow = (k) => {
  let i = searchData.value[k];
    // 检查 stableData.value 中是否已存在相同 sno 的数据
    const isDuplicate = stableData.value.some(item => item.sno === i.sno);
    if (!isDuplicate) {
    stableData.value.push({
      name: i.name,
      sno: i.sno,
      class: i.class,
      phone: i.phone,
      major: i.major,
      isappointment: 2,
    });
  } else {
    ElMessage.error('该学生已指定');
  }
}
const searchStudent = async (e) => {
  const res = await SerachStudent(e);
  console.log(res.data, "res.data");
  //if()
  if(res.data.message =='failed'){
    ElMessage.error('搜索失败')
  }
  else{
    searchData.value = [];
    let op = res.data.Studentinfo.StudentLists;
    op.forEach((item) => {
      searchData.value.push({
        name: item.name,
        sno: item.sno,
        class: item.class,
        phone: item.phone,
        major: item.majorName,
        grade: item.grade,
      })
    })
     
    
  }
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  form.value.thumb = URL.createObjectURL(uploadFile.raw!);
};
</script>

<style>
.scrollable-window {
  max-width: 800px; /* 最大宽度为800px */
  width: 100%; /* 宽度占满父容器 */
  height: 200px; /* 窗口高度 */
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
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.custom-table-font-size {
  font-size: 10px; /* 设置字体大小为14px */
}
</style>
