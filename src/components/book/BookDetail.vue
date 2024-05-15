<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-tabs v-model="activeName">
        <el-tab-pane label="作品基本信息" name="first">
          <el-form :model="bookForm" :rules="bookRules" label-width="100px">
            <el-row>
              <el-col :span="14">
                <el-form-item label="书名" prop="bname">
                  <el-input v-model="bookForm.bname" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="标签" prop="bookTags">
                  <el-select v-model="bookTags" multiple placeholder="请选择" filterable @change="handleChange">
                    <el-option
                        v-for="item in tags"
                        :key="item.tid"
                        :label="item.tname"
                        :value="item.tid">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="封面" prop="email">
              <div class="grid-content bg-purple">
                <div class="input-group mb-3">
                  <img :src="'http://localhost:8082'+bookForm.imageSrc" class="img-thumbnail" alt="..." style="width: 200px;height: 200px">
                  <div class="custom-file">
                    <form method="post" enctype="multipart/form-data">
                      <input  @change="getFile($event)" type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
                    </form>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="上架状态" prop="bookStatus">
              <el-select :disabled="chapterNum<10" v-model="bookForm.bookStatus" placeholder="至少有10章">
                <el-option label="上架中" value="1"></el-option>
                <el-option label="未上架" value="0"></el-option>
              </el-select>
              <span v-show="chapterNum<10" class="text-warning m-2">本书章节未达10章不可上架</span>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
              <el-input type="textarea" v-model="bookForm.introduction" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateAll">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="用户自定义标签" name="second">
          <el-collapse v-model="activeNames">
            <el-select v-model="value" placeholder="请选择" @change="selectBookReviews">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
              </el-option>
            </el-select>
              <ul class="list-group">
                <li v-for="(item,index) in bookReview.list" :key="index" class="list-group-item">
                  <div class="text-primary">{{item.customTag}}</div>
                  <div class="m-3">
                    <div class="row">
                      <span class="col-10">
                        <div class="font-weight-bold">用户：{{item.user.uname}}</div>
                        <div class="text-muted">{{item.brDate}}</div>
                      </span>
                      <span class="col">
                        <el-button
                            v-if="item.tagStatus==='0'"
                            type="primary"
                            size="small"
                            @click="updateCustomTag(item.brid,'1')">
                          显示
                        </el-button>
                        <el-button
                            v-else
                            type="danger"
                            size="small"
                            @click="updateCustomTag(item.brid,'0')">
                          隐藏
                        </el-button>
                      </span>
                    </div>
                    <div class="m-3 bg-dark-subtle">
                      <p>
                        {{item.brContent}}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
<!--            </el-collapse-item>-->
          </el-collapse>
          <el-pagination
              background
              layout="prev, pager, next"
              :total="bookReview.total"
              :current-page="pageNum"
              :page-size="pageSize"
              @current-change="handleCurrentChange">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

  export default {
    name:'BookDetail',
    data(){
      return{
        bid:'',
        activeName: 'first',
        activeNames:['1'],
        chapterNum:0,
        pageNum:1,
        pageSize:3,
        bookForm:{
          bid:'',
          bname:'',
          introduction:'',
          bookStatus:0,
          bookDate:'',
          picture:'',
          imageSrc:'',
          changeP:'0'
        },
        tags:[
          {tid:'',tname:''}
        ],
        bookTags:[],
        bookRules: {
          bname: [
            { required: true, message: '请输入书名', trigger: 'blur' },

          ],
          introduction: [
            { required: true, message: '请填写简介', trigger: 'blur' }
          ]
        },
        bookReview:{
          pages:0,
          prePage:0,
          total:0,
          list:[

          ]
        },
        options: [{
          value: -1,
          label: '全部'
        }, {
          value: 1,
          label: '已显示'
        }, {
          value: 0,
          label: '未显示'
        }],
        value:-1
      }
    },
    computed:{

    },
    methods:{
      getBid(){
        this.bid = this.$route.params.bid;
      },
      async selectBook(){
        const response = await this.$http.get("/book/selectBookByBid?bid="+this.bid)
        this.bookForm = response.data.data
        this.bookForm.imageSrc = response.data.data.picture
      },
      async selectAllTags() {
        const response = await this.$http.get("/tag/selectAllTags")
        this.tags = response.data.data
      },
      async selectBookTags() {
        const response = await this.$http.get("/tag/selectTagByBid?bid=" + this.bid)
        this.bookTags = response.data.data
      },
      async countChapter() {
        const response = await this.$http.get("/chapter/countChapter?bid=" + this.bid)
        this.chapterNum = response.data.data
      },
      async selectBookReviews() {
        const response = await this.$http.post("/review/selectBookReviewWithTagByBid",
          this.$qs.stringify({bid:this.bid,
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          type:this.value})
        )
        this.bookReview = response.data.data
      },
      getFile(event) {
        this.bookForm.picture = event.target.files[0];
        this.bookForm.changeP = '1'
        const reader = new FileReader();
        reader.onload = function(e) {
          this.bookForm.imageSrc = e.target.result;
        }.bind(this);
        reader.readAsDataURL(this.bookForm.picture);
      },
      updateBookInfo(){
        let formData = new FormData();
        formData.append('bname', this.bookForm.bname);
        formData.append('introduction', this.bookForm.introduction);
        formData.append('picture', this.bookForm.picture);
        formData.append('bookStatus', this.bookForm.bookStatus);
        formData.append('bid', this.bookForm.bid);
        formData.append('changeP', this.bookForm.changeP);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        const response = this.$http.post('/book/addOrUpdateBook',formData,config)
        console.log(response)
      },
      async updateBookTags() {
        const response = await this.$http.post('/tag/setTags', {
          bid: this.bookForm.bid,
          tags: this.bookTags
        })
        console.log(response)
      },
      async updateCustomTag(brid,tagStatus){
        const response = await this.$http.post('/review/updateCustomTag',
        this.$qs.stringify({
          brid:brid,
          tagStatus:tagStatus
        }))
        await this.selectBookReviews()
        console.log(response)
      },
      updateAll(){
        this.updateBookInfo()
        this.updateBookTags()
        this.refresh()
      },
      handleChange(value) {
        if (value.length > 5) {
          this.$message.error('最多只能选择5个选项');
          this.bookTags = value.slice(0, 5);
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.selectBookReviews();
      },
      refresh(){
        setTimeout(() => {
          this.$router.go(0);
        }, 100);
      }
    },
    created() {
      this.getBid()
    },
    mounted() {
      this.selectBookTags()
      this.selectBook()
      this.selectAllTags()
      this.countChapter()
      this.selectBookReviews()
    }

  }
</script>