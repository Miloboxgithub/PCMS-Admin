<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-header">
        <img class="logo mr10" src="../../assets/img/logofav.png" alt="" />
        <div class="login-title">实践课程管理系统PCMS</div>
      </div>
      <el-form :model="param" :rules="rules" ref="login" size="large">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sno">
          <el-input v-model="param.sno" placeholder="工号">
            <template #prepend>
              <el-icon>
                <Money />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="pwd-tips">
          <el-checkbox
            class="pwd-checkbox"
            v-model="checked"
            label="记住密码"
          />
          <el-link type="primary" @click="$router.push('/reset-pwd')"
            >忘记密码</el-link
          >
        </div>
        <el-button
          class="login-btn"
          type="primary"
          size="large"
          @click="submitForm(login)"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTabsStore } from "@/store/tabs";
import { usePermissStore } from "@/store/permiss";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import axios from "axios";
interface LoginInfo {
  username: string;
  password: string;
  sno: string;
}

const lgStr = localStorage.getItem("login-param");
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
  username: defParam ? defParam.username : "",
  password: defParam ? defParam.password : "",
  sno: defParam ? defParam.sno : "",
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  sno: [{ required: true, message: "请输入工号", trigger: "blur" }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid: boolean) => {
    if (valid) {
      // 假设param已经包含了用户名和密码
      const loginData = {
        name: param.username,
        password: param.password, // 确保param对象中有password属性
        sno: param.sno,
      };
      // 向后端发送登录请求
      axios
        .post("/api/login/adminlogin", loginData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // 登录成功
          //console.log(response.data);
          if (response.data.data.message == "success") {
          console.log(response);
            ElMessage.success("登录成功");
            localStorage.setItem("vuems_name", param.username);
            localStorage.setItem("vuems_role", response.data.data.role);
            localStorage.setItem("vuems_token", response.data.data.token); // 确保返回的数据中有token字段
            const keys =
              permiss.defaultList[
                param.username === "admin" ? "admin" : "user"
              ];
            permiss.handleSet(keys);
            router.push("/");

            // 如果用户勾选了记住我，则保存登录参数
            if (checked.value) {
              localStorage.setItem("login-param", JSON.stringify(param));
            } else {
              localStorage.removeItem("login-param");
            }
          } else {
            ElMessage.error("登录失败，请检查表单填写是否正确");
          }
        })
        .catch((error) => {
          // 处理错误
          console.error(error);

          if (error.response) {
            // 请求已发出但服务器响应的状态码不在2xx范围内
            if (error.response.status === 401) {
              ElMessage.error("用户名或密码错误");
            } else {
              ElMessage.error(
                `登录失败，请稍后再试 (${error.response.status})`
              );
            }
          } else if (error.request) {
            // 请求已发出但没有收到响应
            ElMessage.error("网络请求超时，请检查您的网络连接");
          } else {
            // 发生了一些设置请求时的错误
            ElMessage.error("发生了一个错误，请稍后再试");
          }
        });
    } else {
      ElMessage.error("登录失败，请检查表单填写是否正确");
    }
  });
};

const tabs = useTabsStore();
tabs.clearTabs();
</script>

<style scoped>
.login-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: url(../../assets/img/merry-christmas-2998593_640.jpg) center/cover no-repeat;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.logo {
  width: 35px;
}

.login-title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
}

.login-container {
  width: 450px;
  border-radius: 5px;
  background: #fff;
  padding: 40px 50px 50px;
  box-sizing: border-box;
}

.pwd-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: -10px 0 10px;
  color: #787878;
}

.pwd-checkbox {
  height: auto;
}

.login-btn {
  display: block;
  width: 100%;
}

.login-tips {
  font-size: 12px;
  color: #999;
}

.login-text {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #787878;
}
</style>
