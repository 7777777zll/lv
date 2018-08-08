/**
 * Created by Kotori on 2017/5/16.
 * Modify by Athrunsky on 2017//8/2
 */

import axios from 'axios'
import { Message } from 'element-ui'
axios.defaults.withCredentials=true;
// import mock from '../mock/mock'
// let base = 'http://127.0.0.1:5001'
//let base = 'http://192.168.11.12:6015'
// let base = 'http://192.168.10.245:6016'
// let base = '/api'
// 响应拦截器
let base = 'http://192.168.10.245:6016'
console.log('ask action')
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  console.log(error)
  // 对响应错误做点什么
  if(error.message=="Network Error"){
    Message.error({
      message: '网络出小差了,请稍后再试'
    })
  }
  if (error.response) {
    if (error.response.status === 500||error.response.status === 400) {
      console.log(error.response.data.message)
      Message.error({
        message: '网络出小差了,请稍后再试'
      })
    }
  } else {
    return Promise.reject(error)
  }
})
export const OutStorage = {
  get: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventorySerial/searchOutSerials`, params.params).then(res => res.data)
  }
}
export const InStorage = {
  get: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventorySerial/searchInSerials`, params.params).then(res => res.data)
  }
}
export const backGoods = {
  get: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventorySerial/searchBackSerials`, params.params).then(res => res.data)
  },
  reason: () => {
    return axios.post(`${base}/inventory/api/consumables/sysDict/getBackReason`).then(res => res.data)
  }
}
export const login = {
  get: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesRecall/login`, params.params).then(res => res.data)
  },
  loginOut: () => {
    return axios.post(`${base}/inventory/api/consumables/consumablesRecall/loginOut`).then(res => res.data)
  }
}

export const store = {
  //库房列表
  findStoreHouseList: (params) => {
    return axios.post(`${base}/inventory/api/store/storeHouse/findStoreHouseList?storeType=${params.params}`).then(res => res.data)
  },
  //设置库房
  setClientStoreHouseCode: (params) => {
    return axios.post(`${base}/inventory/api/store/storeHouse/setClientStoreHouseCode?departmentCode=${params.params}`).then(res => res.data)
  },
  //库存详情
  storeDetail: (params) => {
    return axios.post(`${base}/inventory/api/store/departmentStoreHouse/findInventoryDetail`, params).then(res => res.data)
  },
  //耗材详情
  consumablesDetail: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventory/findConsumablesDetail`, params).then(res => res.data)
  },
  //查询epc号对应产品信息
  byEpc: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventory/searchConsumablesByEpc?epc=${params.params}`).then(res => res.data)
  },
}
export const confirmSubmit = {
  //提交入库
  submitIn: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventory/confirm`, params.params).then(res => res.data)
  },
  //提交出库
  submitOut: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesInventory/submitOutStock`, params.params).then(res => res.data)
  },
  //提交退货
  submitBack: (params) => {
    return axios.post(`${base}/inventory/api/consumables/consumablesRecall/submitBack`, params).then(res => res.data)
  },
  //入库/退货推送前触发
  messagectl: (params) => {
    //{'identification': '000000000000000000240DE6','op':1}
    return axios.post(`${base}/inventory/api/consumables/consumablesInventory/messagectl`, params.params).then(res => res.data)
  },
}
