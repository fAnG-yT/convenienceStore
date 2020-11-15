/*模拟数据*/
import Mock from 'mockjs'
import { Image } from 'element-ui'

//类别列表
var classList=[{
    value: '食品',
    label: '食品',
    children: [{
      value: '速食',
      label: '速食',
      children: [{
        value: '方便面',
        label: '方便面'
      }, {
        value: '粥',
        label: '粥'
      }, {
        value: '面包',
        label: '面包'
      }, {
        value: '火腿肠',
        label: '火腿肠'
      }]
    }, {
      value: '饮料',
      label: '饮料',
      children: [{
        value: '奶茶',
        label: '奶茶'
      }, {
        value: '咖啡',
        label: '咖啡'
      }]
    }]
  },{
    value: '日常用品',
    label: '日常用品',
    children: [{
      value: '护理',
      label: '护理',
      children: [{
        value: '洗发水',
        label: '洗发水'
      }, {
        value: '洗面奶',
        label: '洗面奶'
      }, {
        value: '护手霜',
        label: '护手霜'
      }, {
        value: '沐浴露',
        label: '沐浴露'
      }]
    }, {
      value: '清洁',
      label: '清洁',
      children: [{
        value: '洗洁精',
        label: '洗洁精'
      }, {
        value: '洁厕灵',
        label: '洁厕灵'
      }]
    }]
  }]

//商品列表
var goodsList = Mock.mock({
    "list|50-200":[{
        "goodsId|+1":10021,
        "goodsName":"@title(1)",
        "value|1-200.2":6.50,
        "classId":getClassId(),
        "url":"@dataImage('200x100', 'Hello Mock.js!')"
    }],
    'status':'200 ok'
})



//订单-商品表
var suborderList = Mock.mock({
  "list|50-200":[{
    "orderId|+1":20172541215,
    "goodsList|5-20":[{
        "goodsId|+1":10021,
        "goodsName":"@title(1)",
        "value|1-200.2":6.50,
        "count|1-10":1,
        "classId":getClassId(),
        "url":"@dataImage('200x100', 'Hello Mock.js!')"
    }]
}],
})

//支付方式
var payway=['现金','支付宝','微信','POS通','银联二维码','闪付']

//订单表
var orderList = getOrederList()



//会员表
var customer = Mock.mock({
    "list|20-100":[{
      "phoneNumber":/(^13[0-9])|(^18[0-9])[0-9]{8}/,
      "name":"@cname"
    }]
})

var userList = Mock.mock({
  "list|20-50":[{
    "number|1":/[0-9]{6}/,
    "name":"@cname",
    "identity|1":['cashier','manager'],
    "password":'123'
  }]
})

console.log(userList)

var baseUrl = 'http://localhost:8080/ConvenienceStore_war_exploded'

function getOrederList(){
    var orderList=[]
    suborderList.list.forEach((value,index)=>{
        orderList[index]={}
        orderList[index].orderId=value.orderId
        orderList[index].account=0.9//Math.random().toFixed(1)
        orderList[index].total=value.goodsList.reduce((pre,v,i,arr)=>{
          arr[i].unitvalue=(v.value*orderList[index].account).toFixed(2)
          return pre+v.value*v.count
        },0).toFixed(2)
        orderList[index].date=new Date().toLocaleString()
        orderList[index].payway=payway[Math.round(Math.random()*5)]
        // orderList[index].account=Math.random().toFixed(1)
        orderList[index].pay=(orderList[index].total*orderList[index].account).toFixed(2)
        orderList[index].status="已支付"
    })
    return orderList
}


//模拟网络延时
Mock.setup({
    timeout:500
})

 function getClassId(){
      var classId=[],
      index = Math.floor(Math.random()*classList.length),
      children=classList[index].children
      classId.push(classList[index].value)
      while(children){
          index = Math.floor(Math.random()*children.length)
          classId.push(children[index].value)
          children=children[index].children
      }
      return classId
  }

//身份验证
Mock.mock(`${baseUrl}/users`,function(userForm){
  var data = JSON.parse(userForm.body),number=data.number,password=data.password
  for(var index=0,n=userList.list.length;index<n;index++){
    if(userList.list[index].password==password&&userList.list[index].number==number){
      return userList.list[index]
    }
  }
  return {success:false}
})


//模拟获取商品列表
Mock.mock(`${baseUrl}/goods/goodsList`,function(){
    return goodsList
})

//模拟获取类别列表
Mock.mock(`${baseUrl}/goods/classList`,function(){
    return {classList}
})

//模拟添加商品
Mock.mock(`${baseUrl}/goods/add`,function(addForm){
    console.log(addForm)
    goodsList.list.push(JSON.parse(addForm.body))
    // console.log(addForm)
    return addForm
})

//模拟搜索商品
Mock.mock(`${baseUrl}/goods/search`,function(searchForm){
    console.log(searchForm)
    var list = [],item = JSON.parse(searchForm.body),
    classId=item.classId?item.classId.join('/'):'',
    goodsName=item.goodsName?item.goodsName:''
    goodsList.list.reduce((pre,value)=>{
        if(value.goodsId.toString().includes(item.goodsId)
        &&value.goodsName.includes(goodsName)
        &&value.classId.join('/').includes(classId)){
            pre.push(value)
            console.log(pre)
        }
        return pre
    },list)
    console.log(list)
    return list
})

//模拟修改商品信息商品
Mock.mock(`${baseUrl}/goods/save`,function(item){
    item=JSON.parse(item.body)
    for(var index=0,n=goodsList.list.length;index<n;index++){
        
        if(goodsList.list[index].goodsId==item.goodsId){
            goodsList.list[index]=item
            break
        }
    }
    return {status:'200 ok',message:'succeed'}
})

//开启下单服务
Mock.mock(`${baseUrl}/order/getOrderId`,function(){
  var newOrder = {}
  newOrder.orderId=orderList[orderList.length-1].orderId++
  newOrder.status="待支付"
  orderList.push(newOrder)

  return newOrder.orderId
})


//支付
Mock.mock(`${baseUrl}/order/pay`,function(data){
  var data = JSON.parse(data.body),
  orderId=data.orderId,
  list=data.list,
  way=data.editform.way,
  total=data.editform.total
    for(var index=0,n=orderList.length;index<n;index++){
       if(orderList[index].orderId==orderId){
         orderList[index].payway=way
         orderList[index].total=total
         orderList[index].status="已支付"
         suborderList.list.push({orderId,goodsList:list})
         break
       }
    }
  console.log(suborderList,orderList)
  return {message:"支付成功"}
})

//取消此次购物
Mock.mock(`${baseUrl}/order/delete`,function(data){
  var data = JSON.parse(data.body),
  orderId=data.orderId
    for(var index=0,n=orderList.length;index<n;index++){
       if(orderList[index].orderId==orderId){
         orderList[index]={}
         suborderList.list[index]={}
         break
       }
    }
  console.log(suborderList,orderList)
  return {message:"取消购物"}
})

//获取订单列表
Mock.mock(`${baseUrl}/order/getOrder`,function(){
  // var data = JSON.parse(data.body),
  return orderList
})

//获取订单详细信息
Mock.mock(`${baseUrl}/order/getSubOrder`,function(data){
  var orderId = JSON.parse(data.body).orderId
  for(var index=0,n=suborderList.list.length;index<n;index++){
    if(suborderList.list[index].orderId==orderId){
      console.log(suborderList.list[index].goodsList)
      return suborderList.list[index].goodsList
    }
  }
  return {success:false}
})
