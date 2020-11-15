/**左侧导航
 */
<template>
<div>
  <el-menu router :default-active="$route.path" 
  class="el-menu-vertical-demo" 
  @open="handleOpen" 
  @close="handleClose" 
  :collapse="isCollapse"
  >
    <div>
      <!-- <el-button type="info" circle></el-button> -->
      <i class="show" v-on:click="change" :class="isCollapse?showout:showin"></i>
      <!-- <el-button type="info" circle><i  ></i></el-button> -->
    </div>
    <el-submenu  v-for="submenu in allmenu" :key="submenu.menusId" :index='submenu.menusId'>
      <template slot="title" >
        <!--使用iconfont需引入iconfont类-->
        <i :class="submenu.icon" class="iconfont"></i>
        <span slot="title">{{submenu.name}}</span>
      </template>
      <el-menu-item v-for="item in submenu.menus" :key="item.menusId" :index="item.url">
        <i :class="item.icon" class="iconfont"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
  </div>   
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: false,
        allmenu:[],
        showout:'el-icon-d-arrow-right',
        showin:'el-icon-d-arrow-left',
        managerMenu:[
        {
          menusId: "1",
          icon: 'li-icon-xiangmuguanli',
          name: '基础管理',
          url:'/index',
          menus: [
            {
              menusId: "11",
              icon: 'icon-cat-skuQuery',
              name: '商品信息',
              url: '/index/item',
            },
            {
             menusId: "12",
              icon: 'icon-order-manage',
              name: '订单信息',
              hasThird: 'N',
              url: '/index/order',
              menus: null
            },
            {
              menusId: "13",
              icon: 'icon-cs-manage',
              name: '仓库信息',
              hasThird: 'N',
              url: '/index/warehouse',
              menus: null
            },
          ]
        },
        {
          menusId: "2",
          icon: 'li-icon-shangchengxitongtubiaozitihuayuanwenjian91',
          name: '图表',
          menus: [
            {
              menusId: "21",
              icon: 'icon-provider-manage',
              name: '销售情况',
              hasThird: 'N',
              url: '/index/charts',
              menus: null
            }
          ]
        }
      ],
    Cashier:[
             {
          menusId: "1",
          icon: 'li-icon-xiangmuguanli',
          name: '基础管理',
          hasThird: null,
          menus: [
            {
              menusId: "12",
              icon: 'icon-cat-skuQuery',
              name: '商品信息',
              hasThird: 'N',
              url: '/index/item',
              menus: null
            },
            {
             menusId: "13",
              icon: 'icon-order-manage',
              name: '订单信息',
              hasThird: 'N',
              url: '/index/order',
            },
            {
              menusId: "14",
              icon: 'icon-cs-manage',
              name: '仓库信息',
              hasThird: 'N',
              url: 'index/warehouse',
              menus: null
            },
          ]
        },
        {
          menusId: "3",
          icon: 'li-icon-dingdanguanli',
          name: 'Pos机',
          menus: [
            {
              menusId: "31",
              icon: 'icon-cat-skuQuery',
              name: '下单',
              hasThird: 'N',
              url: "/index/pos",//'pay/Order',
            }, 

          ]
        }] 
      }  
    },

    created(){
      if(this.$store.state.user.identity==='cashier'){
        this.allmenu=this.Cashier
      }
      else this.allmenu=this.managerMenu
    },

    methods: {
      change(){
        this.isCollapse=!this.isCollapse
        this.$emit('change',this.isCollapse)
        // console.log(this.isCollapse)
      },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    /* min-height: 400px; */
  }
  .el-menu{
    /* margin-top: -100px; */
    background-color: #fff;
    height: 100%;
    
  }
  
  .el-menu-item{
    text-align: center;
    font-size: 15px;
  }

  .el-submenu__title{
    font-size: 15px;
  }
  
  .el-submenu{
    text-align: left;
    

  }

div::after{
  content: '';
  display: table;
  clear: both;
}

.show{
  float:right;
  margin-right: -20px;
}

  .active{
    color: blanchedalmond;
  }
</style>
