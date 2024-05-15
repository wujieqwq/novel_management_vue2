<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
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
      </el-row>
      <div>
        <ul class="list-group">
          <li v-for="(item,index) in bookReview.list" :key="index" class="list-group-item shadow-sm mt-2">
            <div class="row border-1 border-bottom">
              <div class="col-2">
                {{item.bname}}
              </div>
            </div>
            <div class="row m2-2">
              <div class="col-2 text-primary">
                用户:{{item.user.uname}}
              </div>
              <div class="col-6"></div>
              <div class="col-2 d-flex">
                <div>
                  <el-popconfirm
                      title="确定删除吗？"
                      @confirm="deleteBookReview(item.brid)"
                  >
                    <el-button slot="reference" type="danger" size="small">删除</el-button>
                  </el-popconfirm>
                </div>
                <div class="mx-2">
                  <el-button type="warning" size="small" @click="setVUser(item)">禁言</el-button>
                </div>
              </div>
            </div>
            <div class="m-2 shadow-sm">
              <span class="m-2" style="font-size: medium">{{item.brDate}}</span>
              <span v-show="item.customTag!=null"><el-tag>{{item.customTag}}</el-tag></span>
              <el-input readonly type="textarea" rows="6" :value="item.brContent"></el-input>
            </div>
          </li>
        </ul>
      </div>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%">
        <span>
          <el-form :model="vForm" :rules="rules" ref="vForm" label-width="80px">
            <el-form-item label="用户名" prop="uname">
              <el-input v-model="vForm.uname"></el-input>
            </el-form-item>
            <el-form-item label="封禁原因" prop="reason">
              <el-input type="textarea" rows="3" v-model="vForm.reason"></el-input>
            </el-form-item>
            <el-form-item label="封禁天数" prop="resDay">
              <el-select v-model="vForm.resDay" placeholder="请选择">
                <el-option label="3天" value=3></el-option>
                <el-option label="7天" value=7></el-option>
                <el-option label="15天" value=15></el-option>
                <el-option label="30天" value=30></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertVRecord('vForm')">确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <el-pagination
            background
            v-if="bookReview.total!==0"
            layout="prev, pager, next"
            :total="this.bookReview.total"
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
  name:'BookReview',
  data(){
    return{
      bid:null,
      pageNum:1,
      pageSize:10,
      bookList:[],
      dialogVisible: false,
      bookReview:{

      },
      vForm:{
        uid:null,
        uname:null,
        reason:null,
        resDay:null,
      },
      rules: {
        reason:[
          {required: true, message: '请输入封禁原因', trigger: 'blur'}
        ],
        resDay:[
          {required: true, message: '请选择天数', trigger: 'change'}
        ]
      }
    }
  },
  methods:{
    async selectBookList() {
      const response = await this.$http.get('/book/selectBook')
      this.bookList = response.data.data;
      this.bid = response.data.data[0].bid
      return Promise.resolve(response)
    },
    async selectBookReview(){
      const response = await this.$http.post('/review/selectBookReviewByBid',
      this.$qs.stringify({
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        bid:this.bid,
        type:-1,
      }))
      this.bookReview = response.data.data
      return Promise.resolve(response)
    },
    async deleteBookReview(val) {
      await this.$http.get('/review/deleteBookReview?brid='+val)
      await this.selectBookReview()
    },
    async insertVRecord(val){
      this.$refs[val].validate(async (valid) => {
        if (valid) {
          await this.$http.post('/vrecord/insertVRecord', {
            reason:this.vForm.reason,
            violationResult:this.vForm.resDay,
            vuid:this.vForm.uid
          })
          this.dialogVisible=false
        } else {
          alert('信息填写不正确');
          return false;
        }
      });
    },
    setVUser(val){
      this.dialogVisible = true
      this.vForm.uid = val.user.uid
      this.vForm.uname = val.user.uname
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.selectBookReview();
    },
  },
  async mounted() {
    await this.selectBookList();
    await this.selectBookReview();
  }
}
</script>

<style scoped>

</style>