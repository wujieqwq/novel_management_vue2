<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-tabs v-model="activeName">
        <el-tab-pane label="运营员信息" name="first">
          <el-row :gutter="10">
            <el-col :span="6">
              <span class="m-2">作品选择</span>
              <el-select v-model="bid" filterable placeholder="请选择" @change="selectBookReview">
                <el-option
                    v-for="item in bookList"
                    :key="item.bid"
                    :label="item.bname"
                    :value="item.bid">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" style="margin-top: 30px" @click="reSet" >清空章节条件</el-button>
            </el-col>
          </el-row>
          <div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="运营员申请" name="second">

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name:'OperatorCom',
  data(){
    return{
      activeName: 'first',
      operator:[],
      operatorApply:[],
      bid:null,
      bookList:[],
    }
  },
  methods:{
    async selectBookList() {
      const response = await this.$http.get('/book/selectBook')
      this.bookList = response.data.data;
      this.bid = response.data.data[0].bid
      return Promise.resolve(response)
    },
    async selectOperator(){
      const response = await this.$http.get('/operator/selectOp?bid='+this.bid)
      this.operator = response.data.data
      return Promise.resolve(response)
    },
    async selectOperatorApply(){
      const response = await this.$http.get('/operator/selectOpApply?bid='+this.bid)
      this.operator = response.data.data
      return Promise.resolve(response)
    },
    reSet(){
      this.bid = null
      this.selectOperator()
    },
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>