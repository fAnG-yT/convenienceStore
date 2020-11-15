import axios from 'axios'

const instance1  = axios.create({
    baseURL: 'http://localhost:8080',
    method:"post",
    timeout:5000
})

export function request(config){
    return instance1(config)
    // return new Promise(resolve=>{
    //     instance1(config).then(res=>resolve(res))
    //     })
    }

