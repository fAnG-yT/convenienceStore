<template>
<div style="display:flex">
<div class="left">
    <!--页头-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!--商品列表-->
     <el-table
        v-loading="loading"
        :data="itemsData"
        @row-dblclick="addTab"
        style="width: 80%;margin:auto"
        stripe 
        highlight-current-row
        >
        <el-table-column align="center" type="index" width="60">
        </el-table-column>
        <el-table-column align="center" sortable prop="goodsId" label="商品号" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="goodsName" label="商品" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="value" label="单价" min-width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="classId | join" label="类别" min-width="120">
            <template slot-scope="scope">{{ scope.row.classId | join }}</template>
        </el-table-column>
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
        <el-tab-pane>
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
        </el-tab-pane>
        <el-tab-pane label="消息中心">
            <span slot="label"><i class="el-icon-date"></i>查询</span>
                <el-form :model="searchForm" class="user-search" >
                    <el-form-item>
                        <el-input size="small" v-model="searchForm.goodsId" placeholder="输入商品号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input size="small" v-model="searchForm.goodsName" placeholder="输入商品名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-cascader size="small" v-model="searchForm.classId" ref="cascaderAddr" filterable clearable
                        :show-all-levels="true"
                        :options="options"
                        :props="{ checkStrictly: true }" >
                        </el-cascader> 
                    </el-form-item>
                    <el-form-item>
                        <el-button  size="small" icon="el-icon-search" type="primary"  plain @click="search(searchForm)">搜索</el-button>
                    </el-form-item>
                </el-form>
        </el-tab-pane>
            
    </el-tabs>
    <!--编辑标签页-->
    <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" >
        <span v-if="editableTabs.length===0">双击列表行可编辑对应的商品信息</span>
        <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
        >   
             <el-form label-width="60px" :model="item.content">
                    <el-form-item>
                    <div style="margin:auto">
                        <el-image :size="100" fit="fill" :src="item.content.url"></el-image>
                    </div>
                    </el-form-item>
                    <el-form-item label="商品号" prop="goodsId">
                    <el-input size="small" v-model="item.content.goodsId" auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="商品名" prop="goodsName">
                    <el-input size="small" v-model="item.content.goodsName" auto-complete="off" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价" prop="value">
                    <el-input size="small" v-model="item.content.value" auto-complete="off" placeholder="请输入商品价格" ></el-input>
                    </el-form-item>
                    <el-form-item label="商品类">
                            <el-cascader size="small" v-model="item.content.classId" ref="cascaderAddr" filterable 
                            :show-all-levels="true"
                            :options="options"
                            :placeholder="item.content.classId | join">
                            </el-cascader> 
                    </el-form-item>
                <el-form-item>
                    <!-- <el-button size="small" >删除</el-button> -->
                    <el-button size="small" type="primary" plain @click="save(item.content)">保存</el-button>
                </el-form-item>
                </el-form>
        </el-tab-pane>
    </el-tabs>
    
</div>

     
     </div>
</template>

<script>
import {getItem,addItem,searchItem,saveItem,getClass} from '../net/req'
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
          goodsId:'',
          goodsName:'',
          classId:[]
      },
      //动态标签页
        editableTabsValue: '',
        editableTabs: [],
        tabIndex: 0,
    }
    },
    created(){
        //获取全部列表
        this.getDataList()
        this.getClassList()
    },
    methods: {
        //初始列表
        getDataList(){
            this.loading=true

           getItem().then(res=>{
            
            this.allData = res.data.list
            this.total = this.allData.length
            this.count = Math.ceil(this.total/this.page_size)
            this.currentPage()
           }).catch(err=>
                this.$message({
                    message:'出错啦，请稍后再试',
                    type:'error'
           }))
        },
        //商品类别列表
        getClassList(){
            getClass().then(res=>{
                console.log(res)
                this.options=res.data.classList
            }).catch(()=>{
                this.$message({
                    message:'出错啦，请稍后再试',
                    type:'error'
           })
           })
            
        },

        //添加商品
        addnewItem(addForm){
            addForm.goodsId=addForm.goodsId.toString()
            addItem(addForm).then(res=>{
                this.allData.push(addForm)
                this.total++
                this.count = Math.ceil(this.total/this.page_size)
                this.clear()
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });              
            }).catch(()=>this.$message({
                message:"出错啦，请稍后再试",
                type:'error'}))
        },
        //清空addForm
        clear(){
            this.addForm={
                goodsId: '',
                goodsName: '',
                value: '',
                classId:[],
                url:'',
                
            }
            this.imageUrl=''

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

        //修改
        save(item){
            saveItem(item).then((res)=>{
                console.log(res)
                if(res.data.message==='succeed'){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });  
                
                }
                else throw e
            }).catch(()=>{this.$message({
                message:"出错啦，请稍后再试",
                type:'error'
            })})
        },
        //分页
        currentPage(){
            this.itemsData = this.allData.slice(this.page_size*(this.current_page-1),this.page_size*this.current_page)
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
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
            title: index.goodsName,
            name: newTabName,
            content: index
            });
            this.editableTabsValue = newTabName;
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
      }
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
    margin: 0 20px;
    /* margin-bottom: 20px; */
    width: 1500px;
}
.right{
    width: auto;
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
    margin-top: 0px;
    height:500px;
    width: 400px;
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
</style>