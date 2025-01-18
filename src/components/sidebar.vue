<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#fff"
      text-color="#777F8F"
      active-text-color="#2272FB"
      router
    >
      <template v-for="item in menuData">
        <template v-if="item.children">
          <el-sub-menu
            :index="item.index"
            :key="item.index"
            v-permiss="item.id"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                v-if="subItem.children"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.id"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.id">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.id"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";
import { menuData } from "@/components/menu";

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #fff;
}
.el-menu-item:hover{  
  outline: 0 !important;  
  color: #2272FB !important;  
  background: #F1F5FD !important;
}  
.el-menu-item.is-active {  
  color: #2272FB !important;  
  background: #F1F5FD !important;  
}  
/* .el-submenu__title:focus, .el-submenu__title:hover{  
  outline: 0 !important;  
  color: #409EFF !important;  
  background: none !important;  
}   */
.el-sub-menu:hover{  
  outline: 0 !important;  
  color: #2272FB !important;  
  background: #F1F5FD !important;
}  
.el-sub-menu.is-active {  
  color: #2272FB !important;  
  background: #F1F5FD !important;  
}  
.el-sub-menu__title:hover{  
  outline: 0 !important;  
  color: #2272FB !important;  
  background: #F1F5FD !important;
}  
.el-sub-menu__title.is-active {  
  color: #2272FB !important;  
  background: #F1F5FD !important;  
}  
.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar-el-menu {
  min-height: 100%;
}
</style>
