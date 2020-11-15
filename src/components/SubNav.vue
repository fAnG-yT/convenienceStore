<template>
<el-tabs type="border-card">
  <el-tab-pane>
    <span slot="label"><i class="el-icon-date"></i>添加</span>
        
        <el-form label-position="left" label-width="80px" :model="addform">
            <el-form-item v-for="additem in addForm" :key="additem.labelname" :label="addiem.labelname">
                <el-input v-model="additem.value"></el-input>
            </el-form-item>
        </el-form>
  </el-tab-pane>
  <el-tab-pane label="消息中心">查询</el-tab-pane>
</el-tabs>
</template>

<script>
export default {
    data(){
        return {
            addform:[{
                name:'商品名称',
                value:""

            },{
                name:'商品号',
                value:''
            },{
                name:'商品类别',
                value:''
            },{
                name:'图片',
                value:''
            }
            ],

            
        }
    }

    
}
</script>

<style>

</style>