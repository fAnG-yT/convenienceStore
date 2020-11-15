<template>
<div style="display:flex">
<div class="left">
    <!--页头-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!--订单列表-->
     <el-table
        v-loading="loading"
        :data="orderData"
        @row-dblclick="addTab"
        style="width: 80%;margin:auto"
        stripe 
        highlight-current-row
        >
        <el-table-column align="center" type="index" width="60">
        </el-table-column>
        <el-table-column align="center" sortable prop="orderId" label="订单号" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="total" label="总价" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="account" label="折扣" min-width="80">
        </el-table-column>
        <el-table-column align="center" sortable prop="pay" label="支付金额" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="payway" label="支付方式" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="status" label="状态" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="date" label="时间" min-width="150">
        </el-table-column>
        <!-- <el-table-column align="center" sortable prop="classId | join" label="类别" min-width="120">
            <template slot-scope="scope">{{ scope.row.classId | join }}</template>
        </el-table-column> -->
        <!-- <el-table-column  align="center" sortable prop="url" label="图片" min-width="120">
        </el-table-column> -->
    </el-table>
    <!--分页-->
    <el-pagination
        :page-size="page_size"
        :current-page.sync="current_page"
        :pager-count="5"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentPage()"
        >
    </el-pagination>
    
</div>
    <!--标签页-->
<div style="right">
    <el-tabs type="border-card">
        <!-- <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i>添加</span>
                <el-form label-width="60px" :model="addForm" ref="addForm">
                    <el-form-item>
                        <el-upload
                        class="avatar-uploader"
                        action="http://localhost:3333/post"
                        list-type="picture-card"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="商品号" prop="goodsId">
                        <el-input size="small" v-model="addForm.goodsId" auto-complete="off" placeholder="请输入商品号" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品名" prop="goodsName">
                        <el-input size="small" v-model="addForm.goodsName" auto-complete="off" placeholder="请输入商品名称" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品价" prop="value">
                        <el-input size="small" v-model="addForm.value" auto-complete="off" placeholder="请输入商品价格" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品类" prop="classId">
                            <el-cascader size="small" v-model="addForm.classId" ref="cascaderAddr" filterable 
                            :show-all-levels="true"
                            :options="options"

                            >
                            </el-cascader> 
                    </el-form-item>
                </el-form>
                <div>
                    <el-button size="small" plain @click="clear()">清空</el-button>
                    <el-button size="small" type="primary" plain @click="addnewItem(addForm)">保存</el-button>
                </div>
        </el-tab-pane> -->
        <el-tab-pane label="消息中心">
            <span slot="label"><i class="el-icon-date"></i>查询</span>
                <el-form :model="searchForm" class="user-search" >
                    <el-form-item>
                        <el-input size="small" v-model="searchForm.orderId" placeholder="输入订单号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select size="large" v-model="searchForm.payway" placeholder="请选择支付方式" style="width:200px">
                            <el-option v-for="way in paywayOptions" :label="way.value" :value="way.value" :key="way.value" ></el-option>
                        </el-select> 
                    </el-form-item>
                    <el-form-item>
                        <el-select size="large" v-model="searchForm.status" placeholder="请选择订单状态" style="width:200px">
                            <el-option v-for="status in statusOptions" :label="status.value" :value="status.value" :key="status.value" ></el-option>
                        </el-select> 
                    </el-form-item>
                    <el-form-item>
                        <el-button  size="small" icon="el-icon-search" type="primary"  plain @click="search(searchForm)">搜索</el-button>
                    </el-form-item>
                </el-form>
        </el-tab-pane>
            
    </el-tabs>
    <!--查看标签页-->
    <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" >
        <span v-if="editableTabs.length===0">双击列表行可查看详细的订单信息</span>
        <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
        >   
             <el-form label-width="60px" :model="item.content">
                <div slot="header" class="clearfix">
                    <span>订单{{item.title}}</span>
                </div>
                    <!-- <div v-if="ifaccount" style="text-align:left">会员:{{phonenumber}}</div> -->
                    <div class="information">
                            <span type="text">商品名</span>
                            <span type="text">单价</span>
                            <span type="text">折扣价</span>
                            <span type="text">数量</span>
                            <span type="text" class="subtotal">小计</span>
                    </div>
                    <div v-for="(i) in item.content" :key="i.goodsId" >
                        <div class="information">
                            <span type="text">{{i.goodsName}}</span>
                            <span type="text"><s>{{i.value}}</s></span>
                            <span type="text">{{i.unitvalue}}</span>
                            <span type="text">×{{i.count}}</span>
                            <span type="text" class="subtotal">{{getSubtotal(i.unitvalue,i.count)}}</span>
                        </div>
                        <!-- <div v-else class="information" >
                            <span type="text">{{i.goodsName}}</span>
                            <span type="text">{{i.value}}</span>
                            <span type="text">×{{i.count}}</span>
                            <span type="text" class="subtotal">{{getSubtotal(i.value,i.count)}}</span>
                        </div> -->
                    </div>
                <el-form-item>
                    <el-button size="small" >删除</el-button>
                    <!-- <el-button size="small" type="primary" plain @click="save(item.content)">保存</el-button> -->
                </el-form-item>
                </el-form>
        </el-tab-pane>
    </el-tabs>
    
</div>

     
     </div>
</template>

<script>
import {getOrder,getSubOrderList} from '../net/reqorder'
  export default {
    data() {
      return {
        loading:true,

        dialogImageUrl: '',
        imageUrl:'',
        dialogVisible: false,
        
        value:[],
        options:[],

        //显示总页数
        count:1,
        //数据总数
        total:0,
        current_page:1,
        page_size:15,


        //列表数据
        allData:[],
        itemsData:[
            // {
            //     goodsId:'1',
            //     goodsName:'hei',
            //     value:"20.0",
            //     classId:'122',
            //     url:"../assets/logo.png"
            // }

        ],
        //添加商品
        addForm: {
        goodsId: '',
        goodsName: '',
        value: '',
        classId:[],
        url:'',
        // token: localStorage.getItem('logintoken')
      },
      //查询商品
      searchForm:
      {
          orderId:'',
          status:'',
          payway:''
      },

      statusOptions:[
        { key: '未支付', value: '未支付' },
        { key: '已支付', value: '已支付' },
        { key: '取消', value: '取消' }
      ],

      paywayOptions:[
        { key: '现金', value: '现金' },
        { key: '支付宝', value: '支付宝' },
        { key: '微信', value: '微信' },
        { key: 'POS通', value: 'POS通' },
        { key: '闪付', value: '闪付'},
        { key: '银联二维码', value: '银联二维码' },
      ],
      //动态标签页
        editableTabsValue: '',
        editableTabs: [],
        tabIndex: 0,
    }
    },

    created(){
        //获取全部列表
        this.getDataList()
    },
    methods: {
        //初始列表
        getDataList(){
            this.loading=true

           getOrder().then(res=>{
            
            this.allData = res.data
            this.total = this.allData.length
            this.count = Math.ceil(this.total/this.page_size)
            this.currentPage()
           }).catch(err=>
                this.$message({
                    message:'出错啦，请稍后再试',
                    type:'error'
           }))
        },


        //搜索
        search(searchForm){
            this.loading=true
            console.log(searchForm.classId)
            searchItem(searchForm).then(res=>{
                this.loading=true
                this.allData = res.data
                this.total = this.allData.length
                this.count = Math.ceil(this.total/this.page_size)
                this.currentPage()
            }).catch(()=>{this.$message({
                message:"出错啦，请稍后再试",
                type:'error'
            })})
        },

        //分页
        currentPage(){
            this.orderData = this.allData.slice(this.page_size*(this.current_page-1),this.page_size*this.current_page)
            this.loading=false
        },

        //上传图片
        handleAvatarSuccess(res, file) {
        console.log(res,file)
        this.imageUrl = URL.createObjectURL(file.raw);
        this.addForm.url=file.url;
        },

        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        //编辑页的添加关闭
        addTab(index,row) {
            getSubOrderList(index.orderId).then(res=>{
                console.log(res.data)
                if(res.data.success===false)throw e      
                else{
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        title: index.orderId,
                        name: newTabName,
                        content: res.data,
                    })
                this.editableTabsValue = newTabName;
            }}).catch(()=>{this.$message({
                message:"出错啦，请稍后再试",
                type:'error'
            })})
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                    activeName = nextTab.name;
                }
                }
            });
            }
            
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        console.log(this.editableTabs)
      },
    
        getSubtotal(value,count){
            console.log(typeof value,typeof count)
            return (value*count).toFixed(2)
        },
    },
    filters:{
        join(value){
            return value.join('/')
        }
    }
  }
  
</script>

<style scoped>
.left{
    background-color: #fff;
    box-shadow: 2px 2px 20px #dddd;
    height: auto;
    margin-right:20px;
    /* margin-bottom: 20px; */
    width: 1300px;
}
.right{
    width: auto;
    /* margin-left: 20px; */
    /* margin-right: 0px; */
}
/* div{
    width: 95%; */
    /* margin: auto; */
    /* background-color: rgba(255,255,255,1);
} */
.el-pagination{
    margin-left: 0;
}
.el-table{
    margin-top: -30px;
    line-height: 10px;
}
.el-breadcrumb{
    line-height: 30px;
    margin-top: 20px;
    margin-left: 20px;
    /* margin: 20px; */
    font-size: 15px;
    font-weight: 100;
}
.el-tabs{
    /* margin-top: 20px; */
    height:500px;
    width: 500px;
    /* display: inline-block; */
    overflow: hidden;

}

.el-tabs .el-form{
    margin: 20px auto auto auto;
    /* flex: 0 0 auto; */
}
.el-tabs .el-form .el-form-item{
    margin:auto;
    min-height: 50px;
    /* display: block; */
    /* width: 70%; */

}

input{
    width: 50px;
}

.el-upload .el-upload--picture-card{
    width: 50px;
    height: 50px;
}

.avatar{
    width: 148px;
    height: 148px;
}
.user-search{
    width: 50%;
}

.el-cascader{
    display:block;
}

.el-image{
    width: 100px;
    height: 100px;
    margin: auto;
}

.subtotal {
    padding: 0;
    float: right;
    margin-right: 20px;
  }

    .information{
    margin-top: 30px;
    text-align: left;
    /* min-width: 10px; */
  }
  .information span{
    margin-left:25px;
    display: inline-block;
    width: 60px;
  }
</style>