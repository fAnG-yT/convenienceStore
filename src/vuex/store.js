import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        user:{},
        loading:false
    },
    mutations:{
        login(state,payload){
            console.log(payload)
            state.loading=payload.loading
            state.user=payload.user
            
        },
        exit(state){
            state.loading=false
            state.user={}
        }
    },
    getter:{},
    actions:{}
})