<template>
  <div class="login-wrap">
    <el-form label-position="left" :model="userForm" :rules="rules" label-width="0px" class="login">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="userForm.number" auto-complete="off" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="userForm.password" 
        auto-complete="off" 
        placeholder="密码" 
        @keyup.enter.native="toLogin(userForm)"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="info" style="width:100%;" @click="toLogin(userForm)"
        :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { login } from '../net/req'
export default {
  name: 'login',
  data() {
    return {
      //定义loading默认为false
      logining: false,
      userForm: {
        //username和password默认为空
        number: '',
        password: '',
      },
      //rules前端验证
      rules: {
        number: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      }
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.$message({
      message: '账号密码及验证码不为空即可',
      type: 'success'
    })
    
  },
  // 里面的函数只有调用才会执行
  methods: {

    //获取信息
    toLogin(formName) {

        login(formName).then(res=>{
            console.log(res.data)
            if(res.data.success===false){
                throw error
            }
            else{
                this.$store.commit('login',{
                  loading:true,
                  user:res.data
                })
                this.$router.push('/')
            }
        }).catch(()=>{
            this.$message({
              message:'密码或工号出错啦',
              type:'error'
            })
            this.logining = false
            
        })
    },
  }
}
</script>

<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  /* background-color: #fef8ec; */
}
.login{
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.remember {
  margin: 0px 0px 35px 0px;
}
.code-box {
  text-align: right;
}
.codeimg {
  height: 40px;
}
</style>