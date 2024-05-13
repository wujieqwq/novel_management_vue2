<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-tabs v-model="activeName">
        <el-tab-pane label="签约信息" name="first">
          <el-row>
            <el-col>
              <span>作品选择</span>
              <el-select v-model="bid" filterable placeholder="请选择">
                <el-option
                    v-for="item in bookList"
                    :key="item.bid"
                    :label="item.bname"
                    :value="item.bid">
                </el-option>
              </el-select>
            </el-col>
            <el-col>
              <span>状态选择</span>
              <el-select v-model="type" filterable placeholder="请选择">
                <el-option
                    v-for="item in signStatus"
                    :key="item.type"
                    :label="item.value"
                    :value="item.type">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-table
              :data="signPage"
              stripe
              style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="pageNum"
              :page-size="pageSize"
              :total="signPage.total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="签约申请" name="second">

        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
  export default {
    name:'signList',
    data(){
      return{
        activeName: 'first',
        bid:null,
        type:null,
        bookList:[],
        signStatus:[
          {
            type: 0,
            value:"审核中"
          },
          {
            type: 1,
            value:"改编中"
          },
          {
            type: 2,
            value:"已改编"
          },
          {
            type: 3,
            value:"未过审"
          }
        ],
        pageNum:1,
        pageSize:10,
        signPage:{

        }
      }
    },
    methods:{
      async selectBookList() {
        const response = await this.$http.get('/book/selectBook')
        this.bookList = response.data.data;
      },
      async selectSign() {
        const response = await this.$http.post('/sign/selectSign',
        this.$qs.stringify({
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          bid:this.bid,
          status:this.type
        }))
        this.signPage = response.data.data
      }
    },
    created() {
      this.selectSign()
      this.selectBookList()
    }
  }
</script>

<style scoped>

</style>