<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-tabs v-model="activeName">
        <el-tab-pane label="签约信息" name="first">
          <el-row :gutter="10">
            <el-col :span="6">
              <span class="m-2">作品选择</span>
              <el-select v-model="bid" filterable placeholder="请选择" @change="selectSign">
                <el-option
                    v-for="item in bookList"
                    :key="item.bid"
                    :label="item.bname"
                    :value="item.bid">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span class="m-2">状态选择</span>
              <el-select v-model="type" filterable placeholder="请选择" @change="selectSign">
                <el-option
                    v-for="item in signStatus"
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
          <el-table
              :data="signPage.list"
              stripe
              style="width: 100%">
            <el-table-column
                prop="signDate"
                label="日期"
                width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.signDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="book.bname"
                label="作品名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="signType"
                label="签约类型">
              <template slot-scope="scope">
                <span>{{getSignType(scope.row.signType)}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="signDuration"
                label="签约时长">
              <template slot-scope="scope">
                <span v-if="scope.row.signDuration!=null">{{scope.row.signDuration}}年</span>
                <span v-else>待定</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="signStatus"
                label="签约状态">
              <template slot-scope="scope">
                <span>{{getSignStatus(scope.row.signStatus)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="pageNum"
              :page-size="pageSize"
              :total="signPage.total"
              @current-change="handleCurrentChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="签约申请" name="second">
          <el-form ref="form" :model="signForm" label-width="80px">
            <el-form-item label="签约作品">
              <el-select v-model="signForm.bid" filterable placeholder="请选择">
                <el-option
                    v-for="item in noSignBookList"
                    :key="item.bid"
                    :label="item.bname"
                    :value="item.bid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签约类别">
              <el-select v-model="signForm.signType" filterable placeholder="请选择">
                <el-option
                    v-for="item in signTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-card>
                <div slot="header" class="clearfix">
                  <span>签约细则</span>
                </div>
                <div style="white-space: pre-wrap;">
                  {{getSignInfo(this.signForm.signType)}}
                </div>
              </el-card>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="insertSign">提交</el-button>
            </el-form-item>
          </el-form>
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
        noSignBookList:[],
        signTypeList:[
          {
            id:0,
            name:"保底签约"
          },
          {
            id:1,
            name:"买断签约"
          },
          {
            id:2,
            name:"分成签约"
          },
        ],
        signStatus:[
          {
            type: 0,
            value:"审核中"
          },
          {
            type: 1,
            value:"已通过"
          },
          {
            type: 2,
            value:"未通过"
          }
        ],
        pageNum:1,
        pageSize:10,
        signPage:{

        },
        signForm:{
          bid:null,
          signType:null,
        }
      }
    },
    methods:{
      async insertSign(){
        await this.$http.post("/sign/signApply",this.signForm)
        this.signForm.signType=null
        this.signForm.bid=null
        this.$message.success("成功")
      },
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
      },
      async selectNoSignBook() {
        const response = await this.$http.post('/sign/selectNoSignBook')
        this.noSignBookList = response.data.data
      },
      getSignType(val){
        if(val===0){
          return "保底签约"
        }else if(val===1){
          return "买断签约"
        }else{
          return "分成签约"
        }
      },
      getSignStatus(val){
        if(val===0){
          return "审核中"
        }else if(val===1){
          return "已通过"
        }else{
          return "未通过"
        }
      },
      getSignInfo(val){
        if(val===0){
          return "\n1.每月固定1000元稿酬，超出收益按4:6对平台与作者进行分成\n2.平台增加作品推荐"
        }else if(val===1){
          return "\n1.平台买断作品版权，作者后续不参与作品收益分成\n2.平台增加作品推荐"
        }else if(val===2){
          return "\n1.平台接管作品改编事宜，改编收益以5:5对平台与作者进行分成\n2.平台增加作品推荐"
        }else{
          return null
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.selectSign();
      },
      reSet(){
        this.bid=null;
        this.type=null;
        this.selectSign();
      }
    },
    mounted() {
      this.selectNoSignBook()
    },
    created() {
      this.selectSign()
      this.selectBookList()
    }
  }
</script>

<style scoped>

</style>