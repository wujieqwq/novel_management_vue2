<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <div>
        <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
        <el-button type="primary">搜索</el-button>
      </div>
      <div>
        <ul class="list-group">
          <li v-for="(item,index) in feedback.list" :key="index" class="list-group-item shadow-sm mt-2">
            <div class="row m2-2">
              <div class="col-2 text-primary">
                用户:{{item.user.uname}}
              </div>
            </div>
            <div class="m-2 shadow-sm">
              <span class="m-2" style="font-size: medium">{{item.feedbackDate}}</span>
              <el-input readonly type="textarea" rows="4" :value="item.feedbackContent"></el-input>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="this.feedback.total"
            :current-page="pageNum"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'FeedBack',
  data(){
    return{
      pageNum:1,
      pageSize:10,
      searchText:null,
      feedback:{

      }
    }
  },
  methods:{
    handleCurrentChange(val) {
      this.pageNum = val
      this.selectFeedBack()
    },
    async selectFeedBack() {
      const response = await this.$http.post('/feedback/selectAllfb',
          this.$qs.stringify({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchText:this.searchText
          }))
      this.feedback = response.data.data
    }
  },
  mounted() {
    this.selectFeedBack()
  }
}
</script>

<style scoped>

</style>