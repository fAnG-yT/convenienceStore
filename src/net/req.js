import {request} from './index.js'

export function login(userForm){
    return request({
        url:'/ConvenienceStore_war_exploded/users',
        data:userForm
    })
}

//获取商品列表
export function getItem(){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/goodsList",
        // data:{
        //     currentpage,
        //     papgeSize
        //     }
        })
}

//获取类别列表
export function getClass(){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/classList",
    })
}
//添加商品
export function addItem(addform){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/add",
        data:addform
        })
}

//搜索商品
export function searchItem(searchForm){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/search",
        data:searchForm
    })
}

//修改商品信息
export function saveItem(item){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/save",
        data:item
    })
}
