/**
 * 销售 下单
 */
<template>
<div>
<div v-if="!start" style="background-color:#fff;display:flex;height:1000px">
  <el-button type="info" icon="iconfont icon-cat-skuQuery" circle
  @click="startToShop"
  class="startbtn">开始下单</el-button>
</div>
<div v-else style="display:flex">
  <div class="base">
    <!-- 面包屑导航 -->
    <!--页头-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">下单</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="user-search">
        <span prop="goodsId" align="center" label="商品号：">
            <el-input style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);width:200px" 
            size="large"  
            v-model="goodsId" 
            auto-complete="off" autofocus 
            placeholder="请输入商品号" 
            @keyup.enter.native="getGoods">
            </el-input>
        </span>
        <span>
            <el-button size="large" type="info" @click="handleEdit()">结算</el-button>
            <el-button size="large" type="info" @click="cancel()">取消</el-button>
            <!-- <el-button size="large" type="primary" plain icon="el-icon-search" >扫码</el-button> -->
        </span>
    </div>
  
    <!--商品-->
  
    <el-form>
    <!-- <el-form-item v-if="list.orderId!=''" label="订单号" >
        {{list.orderId}}
    </el-form-item> -->
    </el-form>
    <el-form v-if="list.length!=0">
    <el-row :data="list" v-for="(o, index) in list" :key="o.goodsId" :offset="index > 0 ? list.size : 0">
        <el-card :body-style="{ padding: '0px' }">
            <div>
                <div class="bottom clearfix">
                    <img :src="o.url" class="image" >
                <div v-if ="ifaccount" class="information">
                    <span type="text" >{{o.goodsName}}</span>
                    <span type="text" ><s>{{o.value}}</s></span>
                    <span type="text" >{{o.unitvalue}}</span>
                    <span type="text" >×{{o.count}}</span>
                    <span type="text" class="subtotal">{{getSubtotal(o.unitvalue,o.count)}}</span>
                </div>
                <div v-else class="information">
                    <span type="text" >{{o.goodsName}}</span>
                    <span type="text" >{{o.value}}</span>
                    <span type="text" >×{{o.count}}</span>
                    <span type="text" class="subtotal">{{getSubtotal(o.value,o.count)}}</span>
                </div>
                <el-input-number v-model="o.count" :min="1" :max="100"></el-input-number>
                </div>
            </div>
        </el-card>
    </el-row>
    </el-form>
    </div>
    <!-- <el-form v-else style="margin-left:38%;margin-top:20px">暂无数据
    </el-form> -->
    <!-- 结算界面 -->
    <el-dialog  :title="title" :visible.sync="editFormVisible" width="45%" @click="closeDialog('editForm')">
          <el-form label-width="100px" :model="editForm" ref="editForm">
            <el-form-item>
            <div>
                <span>合计：{{editForm.total}}</span>
            </div>
            </el-form-item>
            <el-form-item prop="way" label="支付方式">
              <el-select size="large" v-model="editForm.way" placeholder="请选择" style="width:200px">
                <el-option v-for="way in way" :label="way.value" :value="way.value" :key="way.value" ></el-option>
              </el-select>
            </el-form-item >
            <el-form-item v-if="editForm.way=='现金'" prop="value" align="right" label="现金" >
                <el-input v-model="money"  size="large" auto-complete="off" style="width:200px"></el-input>
                找零：{{change}}     
            </el-form-item>
            <el-form-item>
              <el-button size="large" type="primary" @click="save" style="margin-left:70px">完成</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>
      <!--  <el-form-item label="订单号">
          <el-input size="small" v-model="editForm.orderId" auto-complete="off" width="150" disabled></el-input>
          </el-form-item>-->
    <!--订单信息-->
    <div class="right">
      <el-form>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
              <span>订单{{orderId}}</span>
              <el-button style="float: right; padding: 3px 0" type="text">挂单</el-button>
              </div>
              <div v-if="ifaccount" style="text-align:left">会员:{{phonenumber}}</div>
              <div class="information">
                            <span type="text">商品名</span>
                            <span type="text">单价</span>
                            <span type="text">折扣价</span>
                            <span type="text">数量</span>
                            <span type="text" class="subtotal">小计</span>
                </div>
            <div :data ="list"  v-for="(i,index) in list" :key="i.goodsId" 
            :offset="index > 0 ? list.size : 0" >
                
                <div v-if ="ifaccount" class="information">
                    <span type="text">{{i.goodsName}}</span>
                    <span type="text"><s>{{i.value}}</s></span>
                    <span type="text">{{i.unitvalue}}</span>
                    <span type="text">×{{i.count}}</span>
                    <span type="text" class="subtotal">{{getSubtotal(i.unitvalue,i.count)}}</span>
                </div>
                <div v-else class="information" >
                    <span type="text">{{i.goodsName}}</span>
                    <span type="text">{{i.value}}</span>
                    <span type="text">×{{i.count}}</span>
                    <span type="text" class="subtotal">{{getSubtotal(i.value,i.count)}}</span>
                </div>
            </div>
            <div>
                <span style="float:left;margin:20px">合计：{{getTotal}}</span>
            </div>
            </el-card>
  
    </el-form>
    
    </div>
  </div>
</div>
</template>

<script>
import { ifVIP, getItem, pay,startShop,OrderDelete} from '../net/reqpost'
// import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      start:false,
      ifaccount:true,
      account:0.9,
      orderId:'',
      money:0,
      list:[],
      phonenumber:'12345678910',
      goodsId:'',
      currentDate: new Date(),
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '结算',
      way: [
        { key: '现金', value: '现金' },
        { key: '支付宝', value: '支付宝' },
        { key: '微信', value: '微信' },
        { key: 'POS通', value: 'POS通' },
        { key: '闪付', value: '闪付'},
        { key: '银联二维码', value: '银联二维码' },
      ],
      editForm: {
        way:"",
        total:'',
      },
    
      userparm: [], //搜索权限
    }
  },
  
  /**
   * 数据发生改变
   */

      computed: {
        //找零
        change:function(){
          
            this.money = parseFloat(this.money)||0
            return (this.money-this.getTotal).toFixed(2)>0.00?(this.money-this.getTotal).toFixed(2):0.00
          },
          //总价
        getTotal:function(){
            if(this.list.length===0)return 0.00
            return this.list.reduce((pre,v)=>{
                if(this.ifaccount)return pre+(v.unitvalue*v.count)
                return pre+(v.value*v.count)
            },0).toFixed(2)
            
        }
    },
  /**
   * 创建完毕
   */
  created() {
    
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    //开始销售
    startToShop(){
      this.start=!this.start
      startShop().then(res=>{
        this.orderId=res.data
      })
    },


    //小计
    getSubtotal(value,count){
      console.log(typeof value,typeof count)
      return (value*count).toFixed(2)
    },



    //查看是否是会员
    findPhone(){
      this.loading = true

      //调用接口
      ifAccount(this.phonecount)
        .then(res=>{
          this.loading = false
          this.formInline.account = res.account
        })
    },

    //获取商品信息并加入订单-商品表
    getGoods(){
      this.loading = true
      console.log(this.goodsId)
      //调用接口
      getItem(this.goodsId)
         .then(res => {
           this.loading = false
           if (res.data.length ===0) {
             this.$message({
               type: 'info',
               message: '无此商品'
             })
           } else {
            console.log(res.data)
            res.data[0].count=1
             if(this.ifaccount){
               res.data[0].unitvalue=(res.data[0].value*this.account).toFixed(2)
             }
             this.list.push(res.data[0])
           
           }
         })
         .catch(err => {
           this.loading = false
           this.$message.error('出错啦，请稍后再试！')
         })
    },

    // 获取订单列表
    save() {
      this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      //支付
     pay(this.orderId,this.list,this.editForm)
         .then(res => {
           this.loading = false
           if (res.data.length ===0 ) {
             this.$message({
               type: 'info',
               message: "出错啦，请稍后再试"
             })
           } else {
             this.$message({
               message:res.data.message
             })
             this.orderId=''
             this.list=[]
             this.start=false
             this.ifaccount=false
             this.editFormVisible = false
           }
         })
         .catch(err => {
           this.loading = false
           this.$message.error('支付失败，请稍后再试！')
         })
    },


//显示结算界面
    handleEdit: function() {
      this.editFormVisible = true
      this.editForm.total=this.getTotal
      //this.editForm = row

      
    },


    // 删除订单
    cancel() {
      this.$confirm('确定要取消此次购物吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.seletedata.ids = this.list.orderId
          OrderDelete(this.orderId)
            .then(res => {
              if (res.data.length!==0) {
                this.orderId=''
                this.list=[]
                this.ifaccount=false
                this.start=false

                this.$message({
                  type: 'success',
                  message: '订单已取消!'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: '出错啦，请稍后再试'
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('订单取消失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(formName) {
      this.editFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>


.el-breadcrumb{
    line-height: 30px;
    margin-top: 20px;
    margin-left: 20px;
    /* margin: 20px; */
    font-size: 15px;
    font-weight: 100;
}

.startbtn{
  margin:auto;
  
  width:200px;
  height:200px;
  font-size:25px;
}

.startbtn:hover{
  transform:translateY(-10px);
  box-shadow:1px 1px 20px #000;
  /* transition:all 2s */
}

.base{
    background-color: #fff;
    box-shadow: 2px 2px 20px #dddd;
    height: 1000px;

    /* margin-bottom: 20px; */
    width: 1600px;
}

.right{
  background-color: #fff;
  box-shadow: 2px 2px 20px #dddd;
  /* margin: auto; */
  width: 100%;
  overflow: auto;
  margin-left: 20px;
  min-height: 1000px;
}

.user-search {
  margin: 20px auto;
  width: 400px;

}
.userRole {
  width: 100%;
}
/* @import url("//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css"); */
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .subtotal {
    padding: 0;
    float: right;
    margin-right: 20px;
  }

  .image {
    width: 100px;
    height:100px;
    display: block;
    margin-left: 20px;
    border-radius: 5px;
    float: left;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

 .text {
    font-size: 14px;
  }

  /* .item {
    margin-bottom: 18px;
  } */

  /* .information{
    margin-top: 30px;
    text-align: left;
  }
  .information span{
    margin-left:25px;

  } */

  .information{
    margin-top: 30px;
    text-align: left;
    /* min-width: 10px; */
  }
  .information span{
    margin-left:25px;
    display: inline-block;
    width: 80px;
  }
  .box-card {
    width: 100%;
  }

  .el-input-number {
    float:left;
    /* margin-left: 10px; */
    margin: 10px;
    width: 120px;
  }

  /* span.el-input-number__increase{
    width: 20px !important;
  } */
</style>

 
 

 