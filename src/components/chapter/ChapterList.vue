<style>
.border-right {
  border-right: 1px solid #000;
}
</style>
<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <div>当前作品</div>
      <el-select v-model="bid" filterable placeholder="请选择" @change="selectChapterList">
        <el-option
            v-for="item in bookList"
            :key="item.bid"
            :label="item.bname"
            :value="item.bid">
        </el-option>
      </el-select>
      <div v-if="this.chapterPage.total!==0">
        <ul class="list-group">
          <li class="list-group-item">
            <div class="row text-center">
              <div class="col">章节序号</div>
              <div class="col">章节名</div>
              <div class="col">创建日期</div>
              <div class="col">状态</div>
              <div class="col">操作</div>
            </div>
          </li>
          <li v-for="(item,index) in this.chapterPage.list" :key="index" class="list-group-item">
            <div class="row text-center">
              <div class="col border-right">{{chapterPage.list.length-index}}</div>
              <div class="col border-right">{{item.cname}}</div>
              <div class="col border-right">{{item.chapterDate}}</div>
              <div class="col border-right" :class="getColorClass(item.auditStatus)">{{getChapterStatus(item.auditStatus)}}</div>
              <div class="col text-center">
                <router-link :to="'/chapterDetail/'+item.cid">
                  <el-button type="primary" size="small">详情</el-button>
                </router-link>
                <el-button
                    v-if="item.auditStatus==='0'"
                    type="danger"
                    size="small"
                    @click="deleteChapter(item.cid)"
                >
                  删除
                </el-button>
              </div>
            </div>
            <div  class="border-top border-black mt-2">
              <div>审核备注</div>
              <div class="w-75">
                <el-input disabled type="textarea" rows="3" :value="item.auditRemarks"></el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="text-center">
        <h3>还没有章节</h3>
      </div>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="chapterPage.total"
          :current-page="pageNum"
          :page-size="pageSize"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name:'ChapterList',
  data(){
    return{
      cid:0,
      bid:'',
      bookList:[],
      pageNum:1,
      pageSize:10,
      chapterPage:{

      }

    }
  },
  methods:{
    getChapterStatus(status){
      if (status==="0"){
        return "草稿"
      }else if (status==="1"){
        return "审核中"
      }else if(status==="2"){
        return "审核通过"
      }else if(status==="3"){
        return "审核未通过"
      }
    },
    getColorClass(auditStatus) {
      switch (auditStatus) {
        case "0":
          return 'text-warning';
        case "1":
          return 'text-primary';
        case "2":
          return 'text-success';
        case "3":
          return 'text-danger';
      }
    },
    async selectBookList() {
      const response = await this.$http.get('/book/selectBook')
      this.bookList = response.data.data;
      this.bid = this.bookList[0].bid;
      return Promise.resolve(response)
    },
    async selectChapterList() {
      const response = await this.$http.post('/chapter/selectChapterByBid',
          this.$qs.stringify({
            bid: this.bid,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
      )
      this.chapterPage = response.data.data;
      return Promise.resolve(response)
    },
    async deleteChapter(cid){
      await this.$http.post('/chapter/deleteChapter?cid='+cid)
      await this.selectChapterList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.selectChapterList();
    },
    async getBookAndChapterList() {
      await this.selectBookList();
      await this.selectChapterList();
    }
  },
  created() {
    this.getBookAndChapterList()
  }

}
</script>

<style scoped>

</style>