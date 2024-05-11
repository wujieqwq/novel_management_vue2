<template>
  <div>
      <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <router-link to="/user" style="text-decoration: none">
          <el-menu-item index="1">
              <i class="el-icon-user"></i>
              <span class="text-light">个人信息</span>
          </el-menu-item>
        </router-link>
        <router-link to="/bookList" style="text-decoration: none">
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span slot="title">作品管理</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>签约改编</span>
          </template>
          <el-menu-item-group>
            <router-link to="/sign">
              <el-menu-item index="3-1">签约</el-menu-item>
            </router-link>
            <router-link to="/adaptation">
              <el-menu-item index="3-2">改编</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>评论管理</span>
          </template>
          <el-menu-item-group>
            <router-link to="/chapterReview">
             <el-menu-item index="4-1">章评</el-menu-item>
            </router-link>
            <router-link to="/bookReview">
             <el-menu-item index="4-2">书评</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index=5>
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>互动管理</span>
          </template>
          <el-menu-item-group>
            <router-link to="/operator">
             <el-menu-item index="5-1">运营员管理</el-menu-item>
            </router-link>
            <router-link to="/violationRecord">
             <el-menu-item index="5-2">违规记录</el-menu-item>
            </router-link>
            <router-link to="/feedback">
             <el-menu-item index="5-3">反馈记录</el-menu-item>
            </router-link>
            <router-link to="/operating">
             <el-menu-item index="5-3">操作记录</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    <el-menu
        v-show="this.$store.getUserType===3"
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1">
        <i class="el-icon-user"></i>
        <span slot="title">个人信息</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-document"></i>
        <span slot="title">社区动态</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <span slot="title">违规记录</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">我的反馈</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name:'AsideCom',
  data(){
    return{

    }
  },
  methods: {
  }
}
</script>
