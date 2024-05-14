<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-row :gutter="10">
        <el-col :span="6">
          <span class="m-2">作品选择</span>
          <el-select v-model="bid" filterable placeholder="请选择" @change="selectChapterReview">
            <el-option
                v-for="item in bookList"
                :key="item.bid"
                :label="item.bname"
                :value="item.bid">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="m-2">章节选择</span>
          <el-select v-model="cnum" filterable placeholder="请选择" @change="selectChapterReview">
            <el-option
                v-for="item in adaptationStatus"
                :key="item.type"
                :label="item.value"
                :value="item.type">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" style="margin-top: 30px" @click="reSet">清空条件</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name:'ChapterReview',
  data(){
    return{
      bid:null,
      pageNum:1,
      pageSize:10,
      bookList:[],
    }
  },
  methods:{
    async selectBookList() {
      const response = await this.$http.get('/book/selectBook')
      this.bookList = response.data.data;
    },
  },
}
</script>

<style scoped>

</style>