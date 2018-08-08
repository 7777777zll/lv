<template>
  <div>
    <div class="main" v-if="!bigScreen">
      <div class="left_section">
        <div class="logo">
          <img src="../assets/logo.png">
        </div>
        <a class="menu_cell" :class="{itemChoosed:index == num}" v-for="(item,index) in menu"
           @click="loadComponent(item,index)">
          <div class="menu_wrap">
            <div class="menu_img">
              <img :src='item.src'>
            </div>
            <span class="menu_text">{{item.text}}</span>
          </div>
          <div class="arrow-right" v-show="index == num"></div>
        </a>
      </div>
      <!-- <transition name="router-fade" mode="out-in"> -->
      <div class="right_section">
        <transition name="router-fade" mode="out-in">
          <storageDetailNew v-if="menu0" :topText='topText'></storageDetailNew>
          <inStorageNew v-if="menu1" :topText='topText'></inStorageNew>
          <outStorageNew v-if="menu2" :topText='topText'></outStorageNew>
          <manOutStorageNew v-if="menu3" :topText='topText'></manOutStorageNew>
          <rebackNew v-if="menu4" :topText='topText'></rebackNew>
        </transition>
      </div>
      <!-- </transition> -->
      <!-- 登录 -->
      <loginNew v-if="outForShow" :loginVisible="outForShow" @closeLogin="closeLogin"
               ></loginNew>
      <div class="noData" v-if="dataVisible">
        <tableNoData></tableNoData>
      </div>
    </div>
    <div class="bigScreen" v-if="bigScreen">
      <div class="bigScreen_top_section">
        <div class="drop_choose">
          <img src="../assets/header_logo.png">
        </div>
        {{bigName}}出入库流水

        <div class="voice" @click="bigcloseVoice=!bigcloseVoice">
          <img src="../assets/voice.png" v-if="bigcloseVoice==false">
          <img src="../assets/shutDown.png" v-if="bigcloseVoice">
        </div>
      </div>
      <div class="table_view" v-if="!dataVisible">
        <el-table :data="tableData" stripe style="width: 100%" border
                  :default-sort="{prop: 'opt_date', order: 'descending'}" v-loading="isLoading"
                  element-loading-text="加载中">
          <el-table-column width="55">
            <template slot-scope="scope">
              <p v-if="scope.row.type==0" class="bigIcon">
                <img src="../assets/inIcon.png">
              </p>
              <p v-if="scope.row.type==0" class="bigText">入库</p>
              <p v-if="scope.row.type==1" class="bigIcon">
                <img src="../assets/outIcon.png">
              </p>
              <p v-if="scope.row.type==1" class="bigText">出库</p>
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="名称" width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="epc" label="EPC" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="guige" label="品规" width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="location_id" label="货位" width="80" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="qty" label="数量" width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="批次" width="130" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{ scope.row.batch[0] }}</p>
              <p>{{ scope.row.batch[1] }}</p>
            </template>
          </el-table-column>
          <el-table-column label="效期" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="text" size="small">{{scope.row.expire_date}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opt_date" label="操作时间" width="100" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 回收卡片 -->
    <recoveryNew v-if="recoveryVisible" :recoveryData="recoveryData" :recoveryVisible="recoveryVisible"
                 @closeRecovery="closeRecovery"></recoveryNew>
    <!-- 成功提示 -->
    <finishTipNew v-if="finishVisibleIn" :statusFlag="statusFlag" :passNum="bigNum" :finishVisible="finishVisibleIn"
                  @othercloseF="othercloseF"></finishTipNew>
  </div>
</template>
<script>
  import storageDetailNew from '../components/storageDetailNew'
  import inStorageNew from '../components/inStorageNew'
  import outStorageNew from '../components/outStorageNew'
  import manOutStorageNew from '../components/manOutStorageNew'
  import recoveryNew from '../components/recoveryNew'
  import rebackNew from '../components/rebackNew'
  import loginNew from '../components/loginNew'
  import finishTipNew from '../components/finishTipNew'
  import tableNoData from '../components/tableNoData'
  import {OutStorage, InStorage, store} from '../config/api'
  import { Message } from 'element-ui'
  import { login } from '../config/api'
  export default {
    data () {
      return {
        menu: [{
          src: require('../assets/storageDetail_icon.png'),
          text: '库存详情'
        }, {
          src: require('../assets/inStore.png'),
          text: '入库'
        }, {
          src: require('../assets/outStorage_icon.png'),
          text: '出库'
        }, {
          src: require('../assets/man_outStorage.png'),
          text: '手动出库'
        }, {
          src: require('../assets/reback_goods.png'),
          text: '退货'
        }],
        num: 0,
        tableData: [],
        tableData1: [],
        tableData2: [],
        recoveryData: '',
        topText: '库存详情',
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        menu0: false,
        nowKf: '',
        finishVisibleIn: false,
        statusFlag: 1,//0:无数据,1:完成入库,2:完成退货,3:完成出库
        headNum: 0,
        dataVisible: true,
//        loginVisible: true,
        outFlag: false,
        recoveryVisible: false,
        rebackFlag: false,
        bigScreen: false,
        bigcloseVoice: false,
        bigNum: 0,
        intervalid: '',
        interoutIn: '',
        interoutOut: '',
        table1Num: 0,
        table2Num: 0,
        bigName: '',
        isLoading: true,
        isFlag: 0,
        isFlag2: 0,
        page: 1,
        sumCount: 0,
        // 设置库房
        storeType: 3,
        // 库房选择
        choosedStoreIndex: {
          departmentCode: '',
        },
        outParams: {
          inventorySerialVo: {
            departmentCode: '',
          },
          pageModel: {
            pageNo: 1,
          }
        },
        inParams: {
          inventorySerialVo: {
            departmentCode: '',
          },
          pageModel: {
            pageNo: 1,
          }
        },
        audios:'1',
        socketOn:true,
        isIndexLogin:true,
        outForShow:true,
      }
    },
    sockets: {
      'server-request-client-identification': function (serverData){
        console.log(serverData);
//        console.log(this.global.identify)
        //发送identification
        this.$socket.emit('client-send-identification',this.global.identify)
      },
      message_reader: function (mes){
          if(!mes && this.socketOn){
            this.socketOn=mes
            Message.error({
              message: '连接reader通讯异常,请检查重试'
            })
          }
          else{
            this.socketOn=mes
          }
      },
      message_Push: function (data) {
        console.log(data.reduceDetailVoList[0])
        if(data.reduceDetailVoList[0].departmentCode===this.global.kfNow.departmentCode) {
          this.recoveryVisible = true
          this.recoveryData = data.reduceDetailVoList[0]
          var width = window.screen.width
          if (width < 1200) {
            if (!this.bigcloseVoice) {
              this.audios = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=' + this.recoveryData.sku + '耗材已完成出库'
              ).play();
            }
          }
          else {
            if (!this.global.closeVoice) {
              this.audios = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=' + this.recoveryData.sku + '耗材已完成出库'
              ).play();
              console.log(this.audios)
            }
          }
          this.interoutOut = setTimeout(() => {
            this.recoveryVisible = false
          }, 3000)
        }
      },
      // 大屏出库
      submit_OutStock: function (data) {
        var width = window.screen.width
        if (width < 1200) {
          this.bigNum = data.count
          this.statusFlag = 3
          if (data.isSubmit) {
            this.finishVisibleIn = true
            if (!this.bigcloseVoice) {
              var audio = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + data.count + '件耗材完成出库'
              ).play();
            }
            setTimeout(() => {
              this.finishVisibleIn = false
            }, 5000)
          }
          else {
            this.finishVisibleIn = true
            if (!this.bigcloseVoice) {
              var audio = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + data.count + '件耗材出库失败'
              ).play();
            }
          }
        }
      },
      // 大屏退货
      submit_Back: function (data) {
        var width = window.screen.width
        if (width < 1200) {
          this.statusFlag = 2
          this.bigNum = data.count
          if (data.isSubmit) {
            this.finishVisibleIn = true
            if (!this.bigcloseVoice) {
              var audio = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + data.count + '件耗材完成退货'
              ).play();
            }
            setTimeout(() => {
              this.finishVisibleIn = false
            }, 5000)
          }
          else {
            if (!this.bigcloseVoice) {
              var audio = new Audio(
                'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + data.count + '件耗材退货失败'
              ).play();
            }
          }
        }
      },
      // 大屏入库
      bigscreencount: function (data) {
        var width = window.screen.width
        this.finishVisibleIn = false
        if (width < 1200) {
          this.statusFlag = 1
          this.finishVisibleIn = true
          this.bigNum = data.count
          if (!this.bigcloseVoice) {
            var audio = new Audio(
              'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + this.bigNum + '件耗材完成入库'
            ).play();
          }
          this.interoutIn = setTimeout(() => {
            this.finishVisibleIn = false
          }, 5000)
        }
      },
    },
    mounted(){
      // tv:962*541 pad:1280*800
      // var height=window.screen.height
      var width = window.screen.width
      // alert(width+'*'+height)
      if (width < 1200) {
//        this.bigScreen = true
//        this.intervalid = setInterval(() => {
//          this.isFlag = 0
//          this.tableData1 = []
//          this.tableData2 = []
//          this.bigInStore()
//          this.bigOutStore()
//        }, 2000)
//        this.bigInStore()
//        this.bigOutStore()
      }
      else {
        this.bigScreen = false
      }
      if(this.global.rebackFlag===0){
          console.log('00')
        this.global.isLoginer=true
        this.outForShow=true
      }
      else{
        this.dataVisible=false
        this.menu0=true
        this.global.isLoginer=false
        this.outForShow=false
        this.global.rebackFlag=0
      }
      this.global.identifyArr=[]
      this.getDepartmentList(this.storeType);
//      this.global.identify='000000000000000000240DE6'
//      获取客户标识
      if(typeof webclient !== 'undefined' && webclient.getDeviceSerial && typeof webclient.getDeviceSerial === 'function'){
        console.log('ity---->'+webclient.getDeviceSerial())
        this.global.identify= webclient.getDeviceSerial();
      }
      else{
        this.global.identify= '000000000000000000240DE6';
      }
//      console.log(this.global.identify)
    },
    components: {
      finishTipNew,
      tableNoData,
      storageDetailNew,
      inStorageNew,
      outStorageNew,
      manOutStorageNew,
      rebackNew,
      loginNew,
      recoveryNew
    },
    methods: {
      getDepartmentList: function (storeType) {
        store.findStoreHouseList({params: storeType})
          .then(data => {
            var width = window.screen.width
            if (width > 1200) {
              this.choosedStoreIndex.departmentCode = data[0].departmentCode
              this.setDepartment(this.choosedStoreIndex.departmentCode)
              data.forEach((cell)=>{
                this.global.identifyArr.push(cell.identificationList)
              })
//              this.global.identify= this.global.identifyArr[0][0]
              if(!this.global.kfNow){
                this.global.kfNow = data[0]
              }
              this.global.kfAll = data
//              if (this.num == 0) {
//                this.menu0 = true
//                this.dataVisible=false
//              }
            }
          }, response => {
            console.info('fail')
          })
      },
      setDepartment: function (code) {
        store.setClientStoreHouseCode({params: code})
          .then(data => {
            var width = window.screen.width
            if (width < 1200) {
              this.bigName = data.name
            }
          }, response => {
            console.info('fail')
          })
      },
      loadComponent: function (item, index) {
        this.menu0 = false
        this.menu1 = false
        this.menu2 = false
        this.menu3 = false
        this.menu4 = false
        this.num = index
        this.topText = item.text
        this.dataVisible=false
        if (index == 0) {
          this.menu0 = true
        }
        if (index == 1) {
          this.menu1 = true
        }
        if (index == 2) {
          this.menu2 = true
        }
        if (index == 3) {
    			 this.menu3=true
        }
        if (index == 4) {
    			 this.menu4=true
        }
      },
      closeLogin: function () {
        this.outForShow=false
        this.global.isLoginer=false
        this.global.isLoginOut=false
        this.menu0 = true
        this.dataVisible=false
      },
      closeOtherLogin: function () {
        this.menu0 = true
        this.menu1 = false
        this.menu2 = false
        this.menu3 = false
        this.menu4 = false
        this.num = 0
        this.topText = '库存详情'
      },
      closeRecovery: function () {
        this.recoveryVisible = false
      },
      othercloseF: function () {
        this.finishVisibleIn = false
      },
      // 格式化获取的时间
      GMTToStr: function (time) {
        let date = new Date(time)
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let min = date.getMinutes()
        min = min < 10 ? ('0' + min) : min
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
      },
      bigInStore: function () {
        this.inParams.inventorySerialVo.departmentCode = this.global.kfNow.departmentCode
        this.inParams.pageModel.pageNo = this.page
        InStorage.get({params: this.inParams})
          .then(response => {
            if (response.rows.length > 0) {
              this.dataVisible = false
            }
            this.tableData1 = response.rows
            for (var i = 0; i < this.tableData1.length; i++) {
              this.tableData1[i].opt_date = this.GMTToStr(this.tableData1[i].opt_date)
            }
            this.tableData1.forEach(row => {
              this.tableData.push(row)
            })
            var hash = {};
            this.tableData = this.tableData.reduce(function (item, next) {
              hash[next.index] ? '' : hash[next.index] = true && item.push(next);
              return item
            }, [])
          }, response => {
            console.info('fail')
          })
      },
      bigOutStore: function () {
        this.outParams.inventorySerialVo.departmentCode = this.global.kfNow.departmentCode
        this.outParams.pageModel.pageNo = this.page
        OutStorage.get({params: this.outParams})
          .then(response => {
            if (response.rows.length > 0) {
              this.dataVisible = false
              this.isLoading = false
            }
            else {
              this.isLoading = false
            }
            this.tableData2 = response.rows
            for (var i = 0; i < this.tableData2.length; i++) {
              this.tableData2[i].opt_date = this.GMTToStr(this.tableData2[i].opt_date)
            }
            this.tableData2.forEach(row => {
              this.tableData.push(row)
            })
            var hash = {};
            this.tableData = this.tableData.reduce(function (item, next) {
              hash[next.index] ? '' : hash[next.index] = true && item.push(next);
              return item
            }, [])
            if (this.tableData.length == 0) {
              this.dataVisible = true
            }
          }, response => {
            console.info('fail')
          })
      },
    },
  }
</script>
<style lang="scss">
  html, body {
    min-height: 100%;
    width: 100%;
    font-family: "Microsoft YaHei";
    background: #f8f7f6;
    // overflow:hidden;
  }

  .bigText {
    font-size: 11px;
    color: #666;
    padding-top: 3px;
  }

  .main {
    // overflow:hidden;
    height: 100%;
    width: 100%;
    // box-shadow:0 0 10px #ccc;
    .left_section {
      width: 130px;
      background: #fff;
      box-shadow: 0 0 10px #ccc;
      height: 100%;
      overflow: hidden;
      text-align: center;
      z-index: 100;
      position: fixed;
      left: 0;
      .logo {
        width: 100%;
        padding: 14px 25px;
        img {
          width: 100%;
        }
      }
      .menu_wrap {
        width: 60px;
      }
      .menu_cell {
        width: 100%;
        padding: 15px 35px;
        background: #fff;
        color: #1B6573;
        display: block;
        cursor: pointer;
        outline: none;
        position: relative;
        .menu_text {
          font-size: 15px;
          display: inline-block;
          margin-top: 10px;
          color: #1B6573;
          font-weight: bold;
        }
        .menu_img {
          width: 39px;
          margin: auto;
          img {
            width: 100%;
          }
        }
        .arrow-right {
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid #27A094;
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translate(0, -50%);
          z-index: 1000;
        }
      }
      .itemChoosed {
        background: #27A094;
        outline: none;
        .menu_text {
          color: #fff;
        }
      }
    }
    .right_section {
      position: relative;
      margin-left: 130px;
    }
    // .right_top_section>span{
    // 	margin-left:-122px;
    // 	display:inline-block;
    // }
    .right_top_section {
      background: #fff;
      text-align: center;
      padding: 12px 15px;
      overflow: hidden;
      color: #1C6573;
      font-size: 17px;
      font-weight: bold;
      box-shadow: 0 0 10px #ccc;
      position: fixed;
      z-index: 99;
      left: 130px;
      right: 0;
      .drop_choose {
        float: left;
        font-size: 15px;
        cursor: pointer;
        top: 16px;
        position: absolute;
        img {
          display: inline-block;
          margin-right: 10px;
          width: 20px;
        }
      }
      .voice {
        position: absolute;
        right: 15px;
        top: 16px;
        img {
          width: 20px;
        }
      }
    }
    .right_cnt {
      padding: 66px 15px 15px;
    }
    .modal_kf {
      text-align: center;
      .el-dialog__header {
        padding: 20px 0 0;
      }
      .title_kf {
        color: #333;
        font-size: 20px;
        font-weight: bold;
      }
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__footer {
        padding: 0 0 20px;
        text-align: center;
        button {
          margin: 62px auto 0;
          width: 250px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          border-radius: 20px;
          background: #27A094;
          border: solid 1px #27A094;
          font-size: 16px;
          padding: 0;
        }
      }
    }
  }

  .bigScreen {
    margin-top: 44px;
    .table_view {
      padding: 15px 20px;
    }
  }
</style>
