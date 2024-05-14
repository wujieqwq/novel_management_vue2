<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-select :disabled="this.cid!=='-1'" v-model="bid" filterable placeholder="请选择">
        <el-option
            v-for="item in bookList"
            :key="item.bid"
            :label="item.bname"
            :value="item.bid">
        </el-option>
      </el-select>
      <div class="m-2">
        <el-form :model="chapter" label-width="100px">
          <el-form-item label="章节序号" prop="chapterNumber">
            <span>{{this.chapter.chapterNumber!==null?this.chapter.chapterNumber:(this.chapterNumber+1)}}</span>
          </el-form-item>
          <el-form-item label="章节名" prop="bookStatus">
            <el-input v-model="chapter.cname" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="章节正文" prop="bookStatus">
            <el-input type="textarea" rows="40" v-model="chapter.chapterContent" style="outline: none"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="warning" style="margin-left: 470px" @click="addOrUpdateChapter(0)">保存</el-button>
              <el-button v-if="this.per===0" type="primary" style="margin-left: 20px" @click="addOrUpdateChapter(1)">提交审核</el-button>
              <div class="text-primary" style="margin-left: 200px" v-else>提交审核前，请先处理未提交的章节或审核未通过的章节</div>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'chapterDetail',
  data(){
    return{
      cid:-1,
      bid:1,
      bookList:[],
      per:0,
      chapterNumber:null,
      chapter:{
        cname:'',
        chapterContent:'',
        bid:-1,
        auditStatus:-1,
        cid:'',
        chapterNumber:null,
      }
    }
  },
  methods:{
    getCid(){
      this.cid = this.$route.params.cid
    },
    async selectBookList() {
      const response = await this.$http.get('/book/selectBook')
      this.bookList = response.data.data
      this.bid = this.bookList[0].bid
       await this.selectChapterNumber()
      return Promise.resolve(response)
    },
    async selectChapterInfo(){
      const response = await this.$http.get('/chapter/selectChapterByCid?cid='+this.cid)
      this.chapter = response.data.data
      this.bid = response.data.data.bid
    },
    async addOrUpdateChapter(val){
      this.chapter.bid = this.bid
      this.chapter.auditStatus=val
      await this.$http.post('/chapter/addOrUpdateChapter',this.chapter)
      setTimeout(() => {
        this.chapter = {
          cname:'',
          chapterContent:'',
          bid:-1,
          auditStatus:-1,
          cid:'',
          chapterNumber: null,
        };
      }, 1000);
      this.$message.success("成功")
    },
    async selectSubPermission(){
      const response = await this.$http.get('/chapter/selectSubPermission?bid='+this.bid)
      this.per = response.data.data
      return Promise.resolve(response)
    },
    async selectChapterNumber(){
      const response = await this.$http.get('/book/selectChapterNumber?bid='+this.bid)
      this.chapterNumber = response.data.data
      return Promise.resolve(response)
    }
  },
  async mounted() {
    await this.selectBookList()
    if (this.cid !== "-1") {
      await this.selectChapterInfo()
    }
    await this.selectSubPermission()
  },
  created() {
    this.getCid();
  }
}
</script>

<style scoped>

</style>