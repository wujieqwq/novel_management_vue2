<template>
  <div class="container h-100" style="background-color: #ebebeb;margin-top: -20px">
    <div class="p-4">
    <el-form :model="userForm" :rules="userRules" ref="registerForm" label-width="100px" class="demo-registerForm">
      <el-form-item label="用户名" prop="uname">
        <el-input v-model="userForm.uname" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input readonly v-model="userForm.email" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="userType">
        <el-select disabled v-model="userForm.userType" placeholder="请选择身份">
          <el-option label="作者" value="2"></el-option>
          <el-option label="读者" value="1"></el-option>
          <el-option label="责编" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="userForm.gender" placeholder="请选择身份">
          <el-option label="女" value="2"></el-option>
          <el-option label="男" value="1"></el-option>
          <el-option label="不选择" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签名" prop="signature">
        <el-input type="textarea" v-model="userForm.signature" :autosize="{ minRows: 5, maxRows: 10}" size="medium" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="alterInfo">保存</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'UserInfo',
  data() {
    const checkUname = async (rule, value, callback) => {
      const response = await this.$http.post('/user/unameIsExist?uname=' + this.userForm.uname);
      if (response.data.code === 4000) {
        callback(new Error('用户名已存在'));
      } else {
        callback();
      }

    };
    return {
      val:false,
      rep: {},
      userForm: {
        uname: '',
        email:'',
        userType: '',
        gender:'1',
        signature:''
      },
      userRules: {
        uname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {min:3,message: "用户名至少三个字符",trigger: 'blur'},
          {validator: checkUname, trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    async selectUserInfo() {
      const response = await this.$http.get('/user/selectInfo')
      this.userForm = response.data.data
    },
    async alterInfo() {
      const response = await this.$http.post('/user/alterInfo',{
        uname:this.userForm.uname,
        gender:this.userForm.gender,
        signature:this.userForm.signature
      })
      console.log(response.data)
      this.$message.success('保存成功');
    },
  },
  mounted() {
    this.selectUserInfo();
  }
}
</script>