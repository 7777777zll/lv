import Mock from 'mockjs'
// 出库流水
Mock.mock('http://127.0.0.1:8088/api/OutStorage/OutStorageList', {
  'content|1-5': [{
    'index|+1': 1,
    'epc|+1': 100,
    'type': '@name',
    'code|+1': 1,
    'stockoutTime': '@date',
  }],
  'totalElements': 3
})
// 耗材统计
Mock.mock('http://127.0.0.1:8088/api/InStorage/InStorageList', {
  'content|1-5': [{
    'index|+1': 1,
    'type': '@name',
    'needNum|+1': 1,
    'plusNum|+1': 1,
    'prepareNum|+1': 1,
  }],
  'totalElements': 3
})
// rfid卡耗材数量
Mock.mock('http://127.0.0.1:8088/api/needSupplies/needSuppliesList', {
  'content|1-5': [{
    'index|+1': 1,
    'type': '@name',
    'code|+1': 1,
    'epc|+1': 1,
  }],
  'totalElements': 3
})