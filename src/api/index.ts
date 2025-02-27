import axios from "axios";
import request from "../utils/request";

function formatDate(dateString) {
  if (!dateString) {
    return ""; // 或者返回一个默认值
  }
  return dateString.split(" ")[0];
}
//获取后台管理信息
export const fetchAdminData = async () => {
  try {
    let res = await axios.get("/api/admin/getbackallpropractice", {
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "fetchAdminData");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//获取日志
// export const fetchLogData = async (e) => {
//   try {

//   }
// };
//分页获取实践课程
export const fetchCourseData = async (e, p,m,g,a) => {
  console.log("fetchCourseData", e, p, m, g, a);
  try {
    let res = await axios.get("/api/admin/getprojectpracticebypage", {
      params: {
        page: e,
        size: 20,
        MajorName:m,
        Grade:g,
        AdminName:a,
        Type: "",
        reverse: p,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data, "---");
    let ans = {
      ProjectPracticeInfoList: res.data.data.ProjectPracticeInfoList,
      total: res.data.data.count,
    };
    ans.ProjectPracticeInfoList.forEach((item) => {
      item.selectTime =
        formatDate(item.selectStime) + "~" + formatDate(item.selectEtime);
      item.titleTime =
        formatDate(item.titleStime) + "~" + formatDate(item.titleEtime);
    });
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//删除实践课程
export const DeleteCourseData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      projectpracticeCode: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/admin/deletebatchprojectpractice", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//根据编号查询实践课程
export const SearchCourse = async (e) => {
  try {
    let res = await axios.get("/api/admin/getprojectpractice", {
      params: {
        projectpracticeCode: e,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    if (res.data.code != 0) {
      return null;
    }
    let t = [res.data.data.ProjectPractice];
    let ans = {
      ProjectPracticeInfoList: t,
      total: 1,
    };
    ans.ProjectPracticeInfoList.forEach((item) => {
      item.selectTime =
        formatDate(item.selectStime) + "~" + formatDate(item.selectEtime);
      item.titleTime =
        formatDate(item.titleStime) + "~" + formatDate(item.titleEtime);
    });
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//新建实践课程
export const createCourse = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/createprojectpractice",
      {
        projectpracticeName: e.projectpracticeName,
        majorName: e.majorName,
        majorCode: e.majorCode,
        selectStime: e.selectStime,
        selectEtime: e.selectEtime,
        titleStime: e.titleStime,
        titleEtime: e.titleEtime,
        grade: e.grade,
        status: e.status,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//修改实践课程
export const updateCourse = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/updateprojectpractice",
      {
        projectpracticeName: e.projectpracticeName,
        projectpracticeCode: e.projectpracticeCode,
        majorName: e.majorName,
        majorCode: e.majorCode,
        selectStime: e.selectStime,
        selectEtime: e.selectEtime,
        titleStime: e.titleStime,
        titleEtime: e.titleEtime,
        grade: e.grade,
        status: e.status,
        adminName: e.adminName,
        adminSno: e.adminSno,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//导出实践课程
export const exportCourseData = async () => {
  //console.log("fetchCourseData", e, p);
  try {
    let res = await axios.get("/api/admin/getexportprojectpractice", {
      params: {
        Content: "",
        Type: "00000000",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    //console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
function isNumber(str) {
  return !isNaN(Number(str));
}
//分页获取教师出题信息
export const fetchTeacherCourseData = async (e, p, esp, c, n, t, q, b) => {
  let ttt = {
    Page: e,
    Size: 20,
    GuidancePlace: n,
    ReleaseStatus: q,
    Reimburse: b,
    TeacherName: isNumber(c) ? "" : c,
    //ProjectpracticeName: n,
    ProjectpracticeCode: esp,
    TeacherSno: isNumber(c) ? c : "",
    StudentRequirements: t,
    Type: "000000",
    Reserve: "0",
  };
  console.log(ttt);
  try {
    let res = await axios.get("/api/admin/getsettopicbypage", {
      params: {
        Page: e,
        Size: 20,
        GuidancePlace: n,
        ReleaseStatus: q,
        Reimburse: b,
        TeacherName: isNumber(c) ? "" : c,
        //ProjectpracticeName: n,
        ProjectpracticeCode: esp,
        TeacherSno: isNumber(c) ? c : "",
        StudentRequirements: t,
        Type: "000000",
        Reserve: "0",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data);
    let ans = {
      SetTopicInfoList: res.data.data.SetTopicInfoList,
      total: res.data.data.count,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//获取教师出题信息
export const TeacherCourseData = async (p, c) => {
  try {
    let res = await axios.get("/api/admin/getsettopic", {
      params: {
        projectpractice_code: p,
        code: c,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//搜索学生
export const SerachStudent = async (e,a) => {
  console.log(e,a,"search");
  try {
    let res = await axios.get("/api/openuse/getsepstudents", {
      params: {
        content: e,
        projectpracticeCode: a,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建教师课题
export const createTeacherCourse = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/createsettopic",
      {
        projectPracticeCode: "KS202400002",
        projectPracticeName: "2024级电子科学与技术专业",
        title: "测试4",
        content: "测试4暂存内容",
        guidance_place: "中德楼1703",
        guidance_time: "2024.9.10-2024.12.31",
        budget: 10000,
        studentRequirements: 15,
        releaseStatus: 1,
        resultDisplay: "ppt答辩形式",
        budgetSrouce: 1,
        appointStudent: ["202401101006", "202401101007"],
        teacher_name: "教师一",
        teacher_sno: "20240001",
        reimburse: "0",
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除教师课题
export const DeleteTeacherCourseData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      code: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/admin/deletebatchsettopic", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//导出教师出题
export const exportTeacherCourseData = async (e) => {
  //console.log(e, "导出教师出题");
  try {
    let res = await axios.get("/api/admin/getexportsettopic", {
      params: {
        GuidancePlace:'',
        ReleaseStatus:'-1',
        Reimburse:'-1',
        TeacherSno:'',
        TeacherName: "",
        StudentRequirements:'-1',
        ProjectpracticeCode: e,
        TitleName: "",
        Type: "000000",
        Reserve: "0",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//编辑教师出题
//新建教师课题
export const editTeacherCourse = async (e) => {
 
  //console.log(ee, "hhhff-----------");
  try {
    let res = await axios.post(
      "/api/admin/updatesettopic",
      {
        projectPracticeCode: e.projectpracticeCode,
        projectPracticeName: e.projectpracticeName,
        title: e.title,
        content: e.content,
        code: e.code,
        guidance_place: e.guidancePlace,
        guidance_time: e.guidanceTime,
        budget: e.budget,
        studentRequirements: e.studentRequirements,
        releaseStatus: e.releaseStatus,
        resultDisplay: e.resultDisplay,
        appointStudent: e.appointStudent,
        deleteStudent: e.deleteStudent,
        teacher_name: e.teacherName,
        teacher_sno: e.teacherSno,
        //reimburse: e.reimburse,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//分页获取学生选课信息
export const fetchStudentCourseData = async (e, p, esp, n, s) => {
  try {
    let res = await axios.get("/api/admin/getselectcoursebypage", {
      params: {
        Page: e,
        Size: 20,
        ProjectpracticeCode: esp,
        StudentName: n,
        StudentSno: s,
        Phone: "",
        Class: "",
        TitleName: "",
        TeacherName: "",
        Type: "000000",
        Reserve: "0",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data);
    let ans = {
      SelectCourseInfoList: res.data.data.SelectCourseInfoList,
      total: res.data.data.Count,
      zhong: res.data.data.PeopleIn + '+'+ res.data.data.PeopleNotIn,
      weixuan: res.data.data.PeopleNot,
      yixuan: res.data.data.PeopleHave,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建学生选课
export const createStudentCourse = async (e) => {
  //console.log(e, "sssssssssssssssssssssssssss");

  try {
    let res = await axios.post(
      "/api/admin/createselectcourse",
      {
        StudentName: e.name,
        StudentSno: e.sno,
        Phone: e.phone,
        Class: e.class,
        TitleName: e.title,
        TitleCode: "KT20240005",
        TeacherName: e.teacher_name,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除学生选课
export const DeleteStudentCourseData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      DeleteArray: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/admin/deletebatchselectcourse", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//导出学生选题
export const exportStudentCourseData = async (e) => {
  try {
    let res = await axios.get("/api/admin/getexportselectcourse", {
      params: {
        ProjectpracticeCode: e,
        StudentName: "",
        StudentSno: "",
        Phone: "",
        Class: "",
        TitleName: "",
        TeacherName: "",
        Type: "000000",
        Reserve: "0",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    //console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//分页获取教师信息
export const fetchTeacherData = async (e, p, c) => {
  try {
    let res = await axios.post(
      "/api/superadmin/getteacherbypage",
      {
        Page: e,
        Size: 20,
        Content: c,
        Type: "000000",
        Reserve: "0",
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );
    //console.log(res.data);
    let ans = {
      TeacherInfoList: res.data.data.TeacherInfoList,
      total: res.data.data.count,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建教师信息
export const createTeacher = async (e) => {
  try {
    let res = await axios.post(
      "/api/superadmin/createteacher",
      {
        name: e.name,
        sno: e.sno,
        phone: e.phone,
        email: e.email,
        major_name: e.major_name,
        major_code: e.major_code,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//修改教师信息
export const updateTeacher = async (e) => {
  try {
    let res = await axios.post(
      "/api/superadmin/updateteacher",
      {
        name: e.name,
        sno: e.sno,
        phone: e.phone,
        email: e.email,
        major_name: e.major_name,
        major_code: e.major_code,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除教师信息
export const DeleteTeacherData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      sno: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/superadmin/deletebatchteacher", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//导出教师信息
export const exportTeacherData = async () => {
  //console.log("fetchCourseData", e, p);
  try {
    let res = await axios.get("/api/superadmin/getexportteacher", {
      params: {
        Content: "",
        Type: "00000000",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    //console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//分页获取学生信息
export const fetchStudentData = async (e, p, c, g, s, m) => {
  try {
    let res = await axios.post(
      "/api/admin/getstudentbypage",
      {
        Page: e,
        Size: 20,
        Content: c,
        MajorName:m,
        Grade: g,
        Class:s,
        Type: "000000",
        Reserve: "0",
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );
    //console.log(res.data);
    let ans = {
      StudentInfoList: res.data.data.StudentInfoList,
      total: res.data.data.count,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建学生信息
export const createStudent = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/createstudent",
      {
        name: e.name,
        sno: e.sno,
        phone: e.phone,
        class: e.class,
        grade: e.grade,
        major_name: e.major_name,
        major_code: e.major_code,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//修改学生信息
export const updateStudent = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/updatestudent",
      {
        name: e.name,
        sno: e.sno,
        phone: e.phone,
        class: e.class,
        grade: e.grade,
        major_name: e.major_name,
        major_code: e.major_code,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除学生信息
export const DeleteStudentData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      sno: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/admin/deletebatchstudent", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//导出学生信息
export const exportStudentData = async () => {
  try {
    let res = await axios.get("/api/admin/getexportstudent", {
      params: {
        Content: "",
        Type: "00000000",
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//获取模板
export const getTemplate = async (e) => {
  try {
    let res = await axios.get("/api/openuse/getmodulefile", {
      params: {
        type: e,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
      responseType: "blob",
    });
    //console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};

//分页获取管理员信息

export const fetchManageData = async (e, p, c) => {
  try {
    let res = await axios.get("/api/superadmin/getadminbypage", {
      params: {
        page: e,
        size: 20,
        Content: c,
        Type: "",
        reverse: p,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data);
    let ans = {
      AdminAdmins: res.data.data.AdminAdmins,
      total: res.data.data.count,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//根据姓名获取管理员信息
export const SearchAdmin = async (e) => {
  try {
    let res = await axios.get("/api/superadmin/getadmin", {
      params: {
        adminSno: e,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    if (res.data.code != 0) {
      return null;
    }
    //.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//新建管理员
export const createAdmin = async (e) => {
  try {
    let res = await axios.post(
      "/api/superadmin/createadmin",
      {
        adminName: e.adminName,
        adminSno: e.adminSno,
        password: e.password,
        grade: e.grade,
        majorName: e.majorName,
        majorCode: e.majorCode,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//编辑管理员
export const updateAdmin = async (e) => {
  try {
    let res = await axios.post(
      "/api/superadmin/updateadmin",
      {
        adminName: e.adminName,
        adminSno: e.adminSno,
        phone: e.phone,
        email: e.email,
        grade: e.grade,
        majorName: e.majorName,
        majorCode: e.majorCode,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除管理员
export const DeleteAdminData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      adminSno: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/superadmin/deletebatchadmin", {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
