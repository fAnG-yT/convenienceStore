<template>
    <el-container>
      <el-header>
          <topnav></topnav>
      </el-header>
      <el-container>
          <el-aside :width=width>
              <leftnav @change="change" ref="leftnav" class="leftnav"></leftnav>
          </el-aside>
          <el-main>
              <keep-alive><router-view></router-view></keep-alive>
          </el-main>
      </el-container>
    </el-container>
</template>

<script>
import leftnav from '../components/LeftNav.vue'
import topnav from '../components/TopNav.vue'
export default {
    components:{
        leftnav,
        topnav
    },
    data(){
      return {
        isCollapse:true,
        show:'show',
        hidden:'hidden',
        width:'250px',
      }
    },
    mounted(){
      console.log(this.isCollapse)
    },
    methods:{
      change(isCollapse){
        setTimeout(()=>{
          this.width=isCollapse?'60px':'250px';
        },300)
          console.log(this.width);
      }
    }
}
</script>

<style>

  .leftnav{
    box-shadow:0px 0px 5px #0c0b0b2d;
  }
  .el-header{
    /* background-color: #ffffff; */
    box-shadow:0px 0px 5px #0c0b0b2d;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside .show{
    width: 100px;
  }
  .el-aside .hidden{
    width: 20px;
  }
  .el-aside {
    width: null;
    background-color: rgba(255, 255, 255, 0.822);
    /* color: #fff; */
    text-align: center;
    /* line-height: 200px; */
    height: 100%;   
    overflow: hidden; 
    /* margin-top:20px; */
  }
  
  .el-main {
    margin-top: 0px;
    /* color: #0000; */
    text-align: center;
    /* line-height:15px; */
  }
  
  .el-container {
    height: 999px;
    margin-bottom: 0px;
    flex-shrink: 0 !important;
  }

</style>