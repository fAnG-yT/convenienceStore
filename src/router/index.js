import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Item from '../views/Item.vue'
import Warehouse from '../views/Warehouse.vue'
import Order from '../views/Order.vue'
import Pos from '../views/Pos.vue'
import OrderLimit from '../views/Orderlimit.vue'
import Pay from '../views/Pay.vue'
import charts from '../views/Charts.vue'

Vue.use(Router)

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {//登录
    path:'/login',
    component:Login,
    name:'login'
  },
  {//首页
    path:'/index',
    component: Index,
    name:'index',
    children:[
      {
        path: '',
        // name: '商品管理',
        redirect:'item'
    },
      {
        path: 'item',
        // name: '商品管理',
        component: Item,
    }, {
        path: 'warehouse',
        // name: '仓库管理',
        component: Warehouse,
    }, {
        path: 'order',
        name: '交易订单',
        component: Order,
    }, {
        path: 'pos',
        // name: '下单',
        component: Pos,
    }, {
        path: 'orderLimit',
        // name: '挂单',
        component: OrderLimit,
    }, {
      path: 'pay',
        // name: '支付配置',
        component: Pay,
    }, {
        path: 'charts',
        // name: '数据可视化',
        component: charts,
    }]
  }
] 

var router = new Router({
  mode:'history',
  routes,
  linkActiveClass:'active'
})

router.beforeEach((to,from,next)=>{
  //未登录
  if(!store.state.loading){
    if(to.path==='/login'){
        next()
    }
    next('/login')
  }
  //只有收银员身份可以下单
  else if(to.path==='/index/pos'&&store.state.user.identity!=='cashier'){
    next('/')
  }
  //只有经理可以查看报表
  else if(to.path==='/index/charts'&&store.state.user.identity!=='manager'){
    next('/')
  }
  next()
})

export default router
