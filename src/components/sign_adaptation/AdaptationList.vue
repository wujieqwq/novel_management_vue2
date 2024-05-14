<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-tabs v-model="activeName">
        <el-tab-pane label="改编信息" name="first">
          <el-row :gutter="10">
            <el-col :span="6">
              <span class="m-2">作品选择</span>
              <el-select v-model="bid1" filterable placeholder="请选择" @change="selectAdaptation">
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
              <el-select v-model="type1" filterable placeholder="请选择" @change="selectAdaptation">
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
          <el-table
              :data="adaptationPage.list"
              stripe
              style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" style="margin-left: 50px">
                  <el-form-item label="日期">
                    <span>{{ props.row.adaptationDate }}</span>
                  </el-form-item>
                  <el-form-item label="作品名称">
                    <span>{{ props.row.book.bname }}</span>
                  </el-form-item>
                  <el-form-item label="改编类型">
                    <span>{{ getAdaptationType(props.row.adaptationType) }}</span>
                  </el-form-item>
                  <el-form-item label="改编方">
                    <span>{{ props.row.studio }}</span>
                  </el-form-item>
                  <el-form-item label="改编范围">
                    <span>{{ props.row.scope }}</span>
                  </el-form-item>
                  <el-form-item label="授权金">
                    <span>{{ props.row.licenseMoney }}RMB</span>
                  </el-form-item>
                  <el-form-item label="授权时长">
                    <span>{{ props.row.adaptationDuration }}年</span>
                  </el-form-item>
                  <el-form-item label="备注">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
                prop="adaptationDate"
                label="日期"
                width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.adaptationDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="book.bname"
                label="作品名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="adaptationType"
                label="改编类型">
              <template slot-scope="scope">
                <span>{{getAdaptationType(scope.row.adaptationType)}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="adaptationDuration"
                label="授权时长">
              <template slot-scope="scope">
                <span>{{scope.row.adaptationDuration}}年</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="adaptationDuration"
                label="改编方">
              <template slot-scope="scope">
                <span>{{scope.row.studio}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="adaptationStatus"
                label="改编状态">
              <template slot-scope="scope">
                <span>{{getAdaptationStatus(scope.row.adaptationStatus)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="pageNum"
              :page-size="pageSize"
              :total="adaptationPage.total"
              @current-change="handleCurrentChange">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="改编申请" name="second">
          <el-form ref="form" :model="adaptationForm" label-width="80px">
            <el-form-item label="签约作品">
              <el-select v-model="adaptationForm.bid" filterable placeholder="请选择">
                <el-option
                    v-for="item in perAdBookList"
                    :key="item.bid"
                    :label="item.bname"
                    :value="item.bid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签约类别">
              <el-select v-model="adaptationForm.adaptationType" filterable placeholder="请选择">
                <el-option
                    v-for="item in adaptationTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-card>
                <div slot="header" class="clearfix">
                  <span>注意事项</span>
                </div>
                <div>
                  改编申请通过审核后，会与作者对各项事宜进行协商讨论。
                </div>
              </el-card>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="insertAdaptation">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  export default {
    name:'adaptationList',
    data(){
      return{
        activeName: 'first',
        bid1:null,
        type1:null,
        bookList:[],
        noAdaptationBookList:[],
        perAdBookList:[],
        adaptationTypeList:[
          {
            id:0,
            name:"听书"
          },
          {
            id:1,
            name:"微短剧"
          },
          {
            id:2,
            name:"漫画"
          },
        ],
        adaptationStatus:[
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
            value:"改编中"
          },
          {
            type: 3,
            value:"已改编"
          },
          {
            type: 4,
            value:"未通过"
          },
        ],
        pageNum:1,
        pageSize:10,
        adaptationPage:{

        },
        adaptationForm:{
          bid:null,
          adaptationType:null,
        }
      }
    },
    methods:{
      async insertAdaptation(){
        await this.$http.post("/adaptation/insertAdApply",this.adaptationForm)
        this.adaptationForm.adaptationType=null
        this.adaptationForm.bid=null
        this.$message.success("成功")
      },
      async selectBookList() {
        const response = await this.$http.get('/book/selectBook')
        this.bookList = response.data.data;
      },
      async selectAdaptation() {
        const response = await this.$http.post('/adaptation/selectAd',
            this.$qs.stringify({
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              bid:this.bid1,
              status:this.type1
            }))
        this.adaptationPage = response.data.data
      },
      async selectPerAd() {
        const response = await this.$http.get('/adaptation/selectPerAd')
        this.perAdBookList = response.data.data;
      },
      getAdaptationType(val){
        if(val===0){
          return "听书"
        }else if(val===1){
          return "微短剧"
        }else{
          return "漫画"
        }
      },
      getAdaptationStatus(val){
        if(val===0){
          return "审核中"
        }else if(val===1){
          return "已通过"
        }else if (val===2){
          return "改编中"
        }else if(val===3){
          return "已改编"
        }else{
          return "未通过"
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.selectAdaptation();
      },
      reSet(){
        this.bid1=null;
        this.type1=null;
        this.selectAdaptation();
      }
    },
    mounted() {
      this.selectPerAd()
    },
    created() {
      this.selectAdaptation()
      this.selectBookList()
    }
  }
</script>
<style>

</style>