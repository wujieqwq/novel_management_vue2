<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
      <el-table
          :data="adPage"
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
    </div>
  </div>
</template>
<script>
  export default {
    name:'adaptationList',
    data(){
      return{
        adPage:[
          {}
        ]
      }
    }
  }
</script>
<style>

</style>