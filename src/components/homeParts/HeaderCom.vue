<template>
  <div class="shadow-sm p-2 mb-4 bg-body-tertiary rounded">
    <nav class="navbar navbar-expand-lg navbar-light" style="background: #8BC6EC;padding-left:50px">
      <a class="navbar-brand">欢迎 </a>
      <a class="navbar-brand text-primary" href="#">{{ user.uname }}</a>
      <button class="btn btn-outline-dark" @click="loginOut">退出</button>
    </nav>
  </div>
</template>

<script>
export default {
  name:'HeaderCom',
  data(){
    return{
      user:{
        uid:'',
        uname:''
      }
    }
  },
  methods:{
    async selectUserInfo() {
      const response = await this.$http.get('/user/selectInfo')
      this.user = response.data.data
    },
    async loginOut() {
      await this.$router.push('/login')
      localStorage.removeItem('token');
    }

  },
  mounted() {
    this.selectUserInfo();
  }
}
</script>

<style lang="scss" scoped>

</style>