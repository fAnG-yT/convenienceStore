<template>
    <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#fff"
    >
    
    <el-submenu index="2">
        <template slot="title">工号{{$store.state.user.number}}</template>
        <el-menu-item index="2-1">修改密码</el-menu-item>
        <el-menu-item index="2-2">个人信息</el-menu-item>
        <el-menu-item index="2-3" @click="exit()">切换账号</el-menu-item>
    </el-submenu> 
    
    <img src="../assets/img/favicon.jpg">
      
    </el-menu> 
</template>


<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      exit() {
      this.$confirm('真的要退出登录啦? ',  {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            this.$store.commit('exit')
            this.$router.push('/login')
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 1000
        )
        })
    }
    }
  }
</script>

<style scoped>
.el-menu.el-menu--horizontal{
    min-width:1688.53px;
    margin-left: -20px;
}
.el-submenu{
    float: right;
    margin-right: 10px;
}
.el-menu-item{
    text-align: center;
}
img{
    width:40px;
    height: 40px;
    float: right;
    margin: 5px;
}



</style>