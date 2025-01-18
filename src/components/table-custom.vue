<template>
  <div>
    <div class="table-toolbar" v-if="hasToolbar">
      <div class="table-toolbar-left" style="display: flex">
        <slot name="toolbarBtn"></slot>
      </div>
      <div class="table-toolbar-right flex-center">
        <template v-if="multipleSelection.length > 0">
          <el-tooltip effect="dark" content="删除选中" placement="top">
            <el-icon
              class="columns-setting-icon"
              @click="delSelection(multipleSelection)"
            >
              <Delete />
            </el-icon>
          </el-tooltip>
          <el-divider direction="vertical" />
        </template>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-icon class="columns-setting-icon" @click="refresh">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip effect="dark" content="列设置" placement="top">
          <el-dropdown :hide-on-click="false" size="small" trigger="click">
            <el-icon class="columns-setting-icon">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="c in columns">
                  <el-checkbox v-model="c.visible" :label="c.label" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <el-table
      class="mgb20"
      :style="{ width: '100%' }"
      border
      :data="tableData"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @sort-change="customSortMethod"
      table-layout="auto"
    >
      <template v-for="item in columns" :key="item.prop" >
        <el-table-column
          v-if="item.visible"
          :prop="item.prop"
          :label="item.label"
          use show-overflow-tooltip
          :width="item.width"
          :type="item.type"
          :align="item.align || 'center'"
          :sortable="item.sortable"
          :fixed="item.fixed||false"
        >
          <template
            #default="{ row, column, $index }"
            v-if="item.type === 'index'"
          >
            {{ getIndex($index) }}
          </template>
          <template #default="{ row, column, $index }" v-if="!item.type">
            <slot :name="item.prop" :rows="row" :index="$index">
              <template v-if="item.prop == 'operator'">
                <el-button
                  type="warning"
                  size="small"
                  :icon="View"
                  @click="viewFunc(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="editFunc(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="item.prop == 'operators'">
                <el-button
                  type="warning"
                  size="small"
                  :icon="View"
                  @click="viewFunc(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="item.prop == 'operatorno'">
                <el-button
                  type="warning"
                  size="small"
                  :icon="View"
                  @click="viewFunc(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="editFunc(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                  disabled
                >
                  删除
                </el-button>
              </template>
              <span v-else-if="item.formatter">
                {{ item.formatter(row[item.prop]) }}
              </span>
              <span v-else>
                {{ row[item.prop] }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="hasPagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :background="true"
      :layout="layout"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, ref } from "vue";
import { Delete, Edit, View, Refresh } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
//import { fetchUserData } from "@/api";
const props = defineProps({
  // 表格相关
  tableData: {
    type: Array,
    default: [],
  },
  columns: {
    type: Array as PropType<any[]>,
    default: [],
  },
  rowKey: {
    type: String,
    default: "id",
  },
  hasToolbar: {
    type: Boolean,
    default: true,
  },
  //  分页相关
  hasPagination: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },

  layout: {
    type: String,
    default: "total, prev, pager, next",
  },
  delFunc: {
    type: Function,
    default: () => {},
  },
  viewFunc: {
    type: Function,
    default: () => {},
  },
  editFunc: {
    type: Function,
    default: () => {},
  },
  delSelection: {
    type: Function,
    default: () => {},
  },
  refresh: {
    type: Function,
    default: () => {},
  },
  changePage: {
    type: Function,
    default: () => {},
  },
});
// const changePage = (val: number) => {

//     getData(val);

// }

// const getData = async (e) => {
//   const ress = await fetchUserData(e,'');
//   //console.log(ress,"shdfbkjdbgdfjk");

//    tableData.value = ress.list;
//    total.value = ress.total;
//    console.log(tableData.value,"tableData.value");

// };
// let {
//     tableData,
//     columns,
//     rowKey,
//     hasToolbar,
//     hasPagination,
//     total,
//     currentPage,
//     pageSize,
//     layout,
// } = toRefs(props)
// 使用 toRefs 将 props 转换为响应式引用，但保持 currentPage 可写
const { columns, rowKey, hasToolbar, hasPagination, total, pageSize, layout } =
  toRefs(props);
const currentPage = ref(props.currentPage);
const tableData = ref(props.tableData);
// const columns = ref(props.columns);
// const rowKey = ref(props.rowKey);
// const hasToolbar = ref(props.hasToolbar);
// const hasPagination = ref(props.hasPagination);
// const layout = ref(props.layout);

// 设置默认值

columns.value.forEach((item) => {
  if (item.visible === undefined) {
    item.visible = true;
  }
});
let isAscending=true
 let sortState = localStorage.getItem("sortState");
const customSortMethod=()=> {
  
  console.log(sortState,"sortState");
  
          if(sortState){
            props.changePage(currentPage.value,'', null);
            localStorage.removeItem("sortState");
          }
          else{
            props.changePage(currentPage.value, '','1');
            localStorage.setItem("sortState", "1");
          }

    }
// 当选择项发生变化时会触发该事件
const multipleSelection = ref([]);
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection;
};

// 当前页码变化的事件
const handleCurrentChange = (val: number) => {
  console.log(val, "ssssssssssssssss");
  currentPage.value = val;
  console.log(currentPage.value, "qqqqqq");
  props.changePage(currentPage.value, "");
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  })
    .then(async () => {
      props.delFunc(row);
    })
    .catch(() => {});
};

const getIndex = (index: number) => {
  return index + 1 + (currentPage.value - 1) * pageSize.value;
};
//handleCurrentChange(1)
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.columns-setting-icon {
  display: block;
  font-size: 18px;
  cursor: pointer;
  color: #676767;
}
</style>
<style>
.table-header .cell {
  color: #333;
}
</style>
