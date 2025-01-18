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
           <div style="width: 100%;" >
          <el-alert v-if="item.type === 'alert'" show-icon  title="名称请按照格式填写,例:2023级电子科学技术专业项目工程实践1" type="info" :closable="false" />
        </div>
          <div v-if="item.type === 'sss'" style="width: 100%; height: 100%">
            <div
              style="
                width: 100%;
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                display: flex;
                align-items: center;
              "
            >
              <div style="color: #2272fb">指定学生（{{ numnum }}人）</div>
              <el-input
                v-model="inputname"
                style="width: 240px"
                placeholder="学生姓名查询"
              />
            </div>
            <div class="scrollable-window">
              <div class="window-content">
                <el-table :data="stableData" class="custom-table-font-size">
                  <el-table-column prop="name" label="name" width="80" />
                  <el-table-column prop="sno" label="sno" width="80" />
                  <el-table-column prop="major" label="major" width="130" />
                  <el-table-column prop="class" label="class" width="60" />
                  <el-table-column prop="phone" label="phone" width="120" />
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
          >
            <el-option
              v-for="opt in item.options"
              :label="opt.label"
              :value="opt.value"
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
          <slot :name="item.prop" v-else> </slot>
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
import { FormInstance, FormRules, UploadProps } from "element-plus";
import { PropType, ref } from "vue";
const numnum = ref(0);
const inputname = ref("");
const stableData = ref([
  {
    name: "张三",
    sno: "20210001",
    class: "1班",
    phone: "12345678901",
    major: "计算机科学与技术",
  },
  {
    name: "李四",
    sno: "20210002",
    class: "1班",
    phone: "12345678902",
    major: "计算机科学与技术",
  },
  {
    name: "王五",
    sno: "20210003",
    class: "1班",
    phone: "12345678903",
    major: "计算机科学与技术",
  },
]);
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
//console.log(form.value.password, "form.value");
form.value.password = "";
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

  update(form.value);

  //console.log(form.value, "form.value444444");
  // if (edits) {
  //   //console.log(form.value.roomName,'editsform');
  //   DeleteRoom(form);
  // } else {
  //   if (!edit) {
  //     //console.log(form.value,'增添数据');
  //     if ("role" in form.value) createRoom2(form.value);
  //     else createRoom(form.value);
  //   } else {
  //     //console.log(form.value,'修改数据');
  //     if ("role" in form.value) changeRoom2(form.value);
  //     else if ("appointmentPerson" in form.value) changeRoom3(form.value);
  //     else changeRoom(form.value);
  //   }
  // }
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
