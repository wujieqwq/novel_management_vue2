<style scoped>
.list-group {
  border: none;
}

.list-group-item {
  border: none;
}
.disabled{
  .el-upload--picture-card{
    display: none;
  }
}
</style>
<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <div>
        <el-button type="primary" @click="dialogVisible1 = true">新建作品</el-button>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible1"
            width="70%"
            :modal-append-to-body="false">
          <span>
            <el-form :model="bookForm" :rules="bookRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="书名" prop="bname">
                <el-input v-model="bookForm.bname"></el-input>
              </el-form-item>
              <el-form-item label="封面" prop="picture">
                  <div class="grid-content bg-purple">
                        <div class="input-group mb-3">
                            <div class="custom-file">
                                <form method="post" enctype="multipart/form-data">
                                    <input  @change="getFile($event)" type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
                                </form>
                            </div>
                            <img :src="bookForm.imageSrc" class="img-thumbnail" alt="..." style="width: 200px;height: 200px">
                        </div>
                    </div>
              </el-form-item>
              <el-form-item label="简介" prop="introduction">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="bookForm.introduction"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="insertBook">创建</el-button>
                <el-button @click="dialogVisible1 = false">取 消</el-button>
              </el-form-item>
            </el-form>
          </span>
        </el-dialog>
      </div>
      <el-table
          :data="book"
          stripe
          style="width: 100%">
        <el-table-column
            fixed="left"
            label="序号"
            width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="bid"
            label=""
            width="50"
            v-if="false"
        >
        </el-table-column>
        <el-table-column
            prop="picture"
            label="封面"
            width="200">
          <template slot-scope="scope">
            <img class="img-thumbnail" :src="'http://localhost:8082'+scope.row.picture" alt="封面" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
        <el-table-column
            prop="bname"
            label="名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="bookDate"
            width="150"
            label="日期">
        </el-table-column>
        <el-table-column
            prop="bookStatus"
            width="100"
            label="上架状态">
          <template slot-scope="scope">
            <span>{{scope.row.bookStatus==='1'?'上架中':'未上架'}}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label=""
            width="">
          <template slot-scope="scope">
            <div>
              <ul class="list-group">
                <li class="list-group-item">
                  <router-link :to="'/bookDetail/' + scope.row.bid"><el-button type="primary">详情</el-button></router-link>
                </li>
                <li v-show="scope.row.bookStatus==='0'" class="list-group-item"><el-button type="danger" @click="deleteBookByBid(scope.row.bid)">删除</el-button></li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
    name:'BookList',
    data(){
      var checkBname = async (rule, value, callback) => {
        const response = await this.$http.post('/book/bnameIsExist?bname='+this.bookForm.bname);
        if (response.data.code === 4000) {
          callback(new Error('书名已存在'));
        } else {
          callback();
        }

      };
      return{
        dialogVisible1:false,
        dialogImageUrl: '',
        dialogImageName: '',
        disabled: false,
        uploadDisabled:true,
        bookForm:{
          bname:'',
          introduction:'',
          picture:'',
          imageSrc: '',
          bookStatus: '0'
        },
        bookRules: {
          bname: [
            { required: true, message: '请输入书名', trigger: 'blur' },
            { validator:checkBname,trigger: 'blur'}

          ],
          introduction: [
            { required: true, message: '请填写简介', trigger: 'blur' }
          ]
        },
        book:[
          {
            bid:'',
            bname:'',
            introduction:'',
            picture:'',
            bookStatus:'',
            bookDate:''
          }
        ]
      }
    },
    methods:{
      async selectBookList() {
        const response = await this.$http.get('/book/selectBook')
        this.book = response.data.data
      },
      getFile(event) {
        this.bookForm.picture = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          this.bookForm.imageSrc = e.target.result;
        }.bind(this);
        reader.readAsDataURL(this.bookForm.picture);
      },
      async insertBook(){
        let formData = new FormData();
        formData.append('bname', this.bookForm.bname);
        formData.append('introduction', this.bookForm.introduction);
        formData.append('picture', this.bookForm.picture);
        formData.append('bookStatus', this.bookForm.bookStatus);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        const response = this.$http.post('/book/addOrUpdateBook',formData,config)
        console.log(response)
        this.dialogVisible1=false
        this.refresh()
      },
      deleteBookByBid(bid){
        const response = this.$http.get('/book/deleteBook?bid='+bid)
        console.log(response)
        this.refresh()
      },
      refresh(){
        setTimeout(() => {
          this.$router.go(0);
        }, 100);
      }

    },
    mounted() {
      this.selectBookList();
    }
  }
</script>