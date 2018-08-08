<template>
  <div class="about_inStorage">
    <div class="right_top_section">
      <div class="drop_choose" @click="dialogVisible = !dialogVisible">
        <img src="../assets/choose.png">
        <span>{{activeKf}}</span>
      </div>
      <div class="right_head_switch">
        <span class="left_cell" :class="{headCellChoosed:headNum==0}" @click="headSwitch(0)">{{topText}}</span>
        <span class="right_cell" :class="{headCellChoosed:headNum==1}" @click="headSwitch(1)">{{topText}}流水</span>
      </div>
      <div class="info_login" v-if="global.loginer!==''">
        <span class="login_name">欢迎, {{global.loginer}}</span>
        <span class="login_out" @click="loginOut">退出</span>
      </div>
      <div class="voice" @click="voiceCheck">
        <img src="../assets/voice.png" v-if="voiceFlag==false">
        <img src="../assets/shutDown.png" v-if="voiceFlag">
      </div>
    </div>
    <div class="right_cnt">
      <div class="inStoragelist" v-show="headNum==0&&!dataVisible">
        <div class="about_num">
          <div class="inline-block">
            <span>入库种类: </span>
            <span>{{classData.length}}</span>
          </div>
          <div class="inline-block block">
            <span>入库数量: </span>
            <span>{{passNum}}/{{inNumber}}PCS</span>
          </div>
        </div>
        <div class="table_view pass_first_th">
          <el-table :data="tableData" height="450" ref="multipleTable" style="width: 100%" border @selection-change="checkedRow"
                    @row-click="clickRow">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="sku" label="名称" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="epc" label="EPC" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="guige" label="品规" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="location_id" label="货位" width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="qty" label="数量" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="批次" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="Array.isArray(scope.row.batch)">
                  <p v-for="(item,index) in scope.row.batch">{{item}}</p>
                </div>
                <div v-else>
                  <p>{{scope.row.batch}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="效期" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span type="text" size="small" class="expire outdata" v-if="scope.row.isExpire">已过期</span>
                <span type="text" size="small" class="expire insix" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='6个月'">≤{{scope.row.expire_date}}</span>
                <span type="text" size="small" class="expire inthree" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='3个月'">≤{{scope.row.expire_date}}</span>
                <span type="text" size="small" class="expire inone" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='1个月'">≤{{scope.row.expire_date}}</span>
                <span type="text" size="small"
                      v-if="!scope.row.isExpire&&!scope.row.isCloseToExpire&&!scope.row.isOutofStock">{{scope.row.expire_date}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="foot_btn_group">
          <span class="foot_btn disabled" :class="{receive:isOpen}" @click="confirm">确认入库</span>
          <span class="foot_btn stopScan" @click="stopScan">{{openText}}</span>
        </div>
      </div>
      <div class="table_view" v-show="headNum==1&&!dataVisible">
        <div class="mescroll" id="mescroll">
          <div id="dataList" class="data-list">
            <el-table :data="tableData2"   height="550" style="width: 100%" border stripe v-loading="isLoading"
                      element-loading-text="加载中">
              <el-table-column prop="sku" label="名称" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="epc" label="EPC" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="guige" label="品规" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="location_id" label="货位" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="qty" label="数量" width="100" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="批次" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="Array.isArray(scope.row.batch)">
                    <p v-for="(item,index) in scope.row.batch">{{item}}</p>
                  </div>
                  <div v-else>
                    <p>{{scope.row.batch}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="效期" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span type="text" size="small" class="expire outdata" v-if="scope.row.isExpire">已过期</span>
                  <span type="text" size="small" class="expire insix" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='6个月'">≤{{scope.row.expire_date}}</span>
                  <span type="text" size="small" class="expire inthree" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='3个月'">≤{{scope.row.expire_date}}</span>
                  <span type="text" size="small" class="expire inone" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='1个月'">≤{{scope.row.expire_date}}</span>
                  <span type="text" size="small"
                        v-if="!scope.row.isExpire&&!scope.row.isCloseToExpire&&!scope.row.isOutofStock">{{scope.row.expire_date}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="opt_date" label="操作时间" width="100" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="noData" v-if="dataVisible">
        <tableNoData></tableNoData>
      </div>
    </div>
    <!-- 提示框 -->
    <alertTipNew v-if="tipVisible" :tipVisible="tipVisible" :alertText="alertText"
                 @othercloseTip="othercloseTip"></alertTipNew>
    <!-- 科室选择 -->
    <kfChoose v-if="dialogVisible" :dialogVisible="dialogVisible" @closeKf="closeKf"
              @othercloseKf="othercloseKf"></kfChoose>
    <!-- 成功提示 -->
    <finishTipNew v-if="finishVisible" :statusFlag="statusFlag" :passNum="passNum" :finishVisible="finishVisible"
                  @othercloseF="othercloseF"></finishTipNew>
    <!-- 登录 -->
    <loginNew v-if="isInLogin" :loginVisible="isInLogin" @closeLogin="closeLogin" @closeOtherLogin="closeOtherLogin"
    ></loginNew>
  </div>
</template>
<script type="text/javascript">
  import {InStorage,confirmSubmit} from '../config/api'
  import kfChoose from '../components/kfChoose'
  import finishTipNew from '../components/finishTipNew'
  import tableNoData from '../components/tableNoData'
  import alertTipNew from '../components/alertTipNew'
  import loginNew from '../components/loginNew'
  export default {
    data () {
      return {
        tab: ['全部', '过期耗材', '缺货耗材', '近效期耗材', '正常耗材'],
        num: 0,
        // tableData: [{
        //   sku:'酒精',
        //   guige:'500mm',
        //   epc:'00021620180612000044',
        //   batch:[2017,2018],
        //   expire_date:'2019-1-1',
        //   qty:'10',
        //   opt_date:'2018-3-15',
        //   batch:'12',
        //   location_id:'88',
        //  }],
        tableData:[],
        tableData2: [],
        classData: [],
        rowChecked: [],
        dialogVisible: false,
        finishVisible: false,
        activeKf: '',
        kfNum: '',
        headNum: 0,
        voiceFlag: this.global.closeVoice,
        closeVoice: false,
        dataVisible: true,
        passNum: 0,
        inType: 0,
        tipVisible: false,
        inNumber: 0,
        isLoading: true,
        isClick: 0,
        statusFlag: 1,//0:无数据,1:完成入库,2:完成退货,3:完成出库
        inEpc: {
          epc: [],
        },
        tableFlag: 1,
        copyChooseTchIds: [],
        // 库房选择
        choosedStore: {
          departmentCode: '',
        },
        page: 1,
        inParams:{
          inventorySerialVo:{
            departmentCode:'',
          },
          pageModel:{
            pageNo:1,
          }
        },
        push:{
          identification: '',
          op:1,
        },
        sumCount: 0,
        posList: 0,
        closeIcon: false,
        isOpen:false,
        openText:'停止扫描',
        preInArr:[],
        isInLogin:false,
      }
    },
    props: ['topText'],
    watch: {
      voiceFlag: function (val) {
        console.log(val)
      }
    },
    components: {kfChoose, tableNoData, finishTipNew, alertTipNew,loginNew},
    sockets: {
      // 监听epc
      message: function (data) {
//        console.log(data.reduceDetailVoList)
        this.addMessage(data.reduceDetailVoList)
      },
    },
    mounted(){
      this.activeKf = this.global.kfNow.departmentName
      this.push.identification=this.global.identify
      this.tableData = []
      //this.$socket.emit('messagectl');
      this.messagectl(this.push)
      this.$socket.emit('message');
    },
    updated: function () {
      this.tableFlag = this.$refs.multipleTable
      if (this.isClick != 1) {
        if (this.tableData.length > 0) {
          this.tableData.forEach(cell => {
            // if(this.newDataEpc==cell.epc){
            this.$refs.multipleTable.toggleRowSelection(cell, true);
            // }
          })
        }
      }
      var par = document.getElementById("mescroll")
      var list=par.getElementsByClassName('el-table__body-wrapper')[0]
      list.scrollTop = this.posList
      list.addEventListener('scroll', this.listScroll, false)
    },
    methods: {
      messagectl:function(code){
        confirmSubmit.messagectl({params: code})
          .then(response => {

          }, response => {
            console.info('fail')
          })
      },
      stopScan:function () {
        this.isOpen=!this.isOpen
        if(this.isOpen){
          this.openText='开启扫描'
          this.push.op=2
          this.messagectl(this.push)
        }
        else{
          this.push.op=1
          this.messagectl(this.push)
          this.openText='停止扫描'
        }
      },
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice
        this.voiceFlag = this.global.closeVoice
      },
      conditionFind: function (item, index) {
        this.num = index
      },
      closeKf: function (data) {
        this.dialogVisible = false
        this.activeKf = data.departmentName
        this.choosedStore.departmentCode = data.departmentCode
        this.$socket.emit('set_department', this.choosedStore)
        // this.$socket.emit('department_Detail', this.choosedStore);
      },
      othercloseKf: function () {
        this.dialogVisible = false
      },
      othercloseF: function () {
        this.closeIcon = true
        this.finishVisible = false
        this.push.op=1
        this.messagectl(this.push)
        //this.$socket.emit('messagectl');
      },
      headSwitch: function (data) {
        this.tableData = []
        this.dataVisible = true
        if (data === 0) {
          this.headNum = 0
          this.openText='停止扫描'
          this.isOpen=false
          this.push.op=1
          this.messagectl(this.push)
         // this.$socket.emit('messagectl');
        }
        else if (data === 1) {
          this.page = 1
          this.headNum = 1
          this.dataVisible = false
          this.isLoading = true
          this.tableData2 = []
          this.onSubmit();
          this.push.op=2
          this.messagectl(this.push)
          //this.$socket.emit('messagectl');
        }
      },
      //检测epc
      addMessage: function (data) {
        data.forEach(row => {
          // 临时变更需求,扫描累计加,后扫描不到的也不再减少
          if (row.departmentCode===this.global.kfNow.departmentCode) {
            this.isClick = 0
            this.dataVisible = false
            this.tableData.push(row)
            //种类数量统计
            var hash2 = {};
            this.classData = this.tableData.reduce(function (item, next) {
              hash2[next.sku] ? '' : hash2[next.sku] = true && item.push(next);
              return item
            }, [])
            var hash = {};
            this.tableData = this.tableData.reduce(function (item, next) {
              hash[next.epc] ? '' : hash[next.epc] = true && item.push(next);
              return item
            }, [])
            if(this.preInArr.length>0){
              this.preInArr.splice(this.preInArr.findIndex(item => item.epc ===row.epc), 1)
            }
            else{
              this.preInArr=this.tableData
            }
            // 默认本科室选中
            // this.tableData.forEach(row => {
            //  this.$refs.multipleTable.toggleRowSelection(row,true);
            // });
          }
//          else {
////            console.log('row----epc>'+row.epc)
////            console.log('row----status>'+row.status)
//            for (var i = 0; i < this.tableData.length; i++) {
//              if (this.tableData[i].epc == row.epc) {
//                this.tableData.splice(i, 1)
//                var hash2 = {};
//                this.classData = this.tableData.reduce(function (item, next) {
//                  hash2[next.sku] ? '' : hash2[next.sku] = true && item.push(next);
//                  return item
//                }, [])
//                if (this.tableData.length == 0) {
//                  this.dataVisible = true
//                }
//                else {
//                  this.dataVisible = false
//                }
//              }
//            }
//          }
//          console.log('table---->'+this.tableData.length)
        })
      },
      checkedRow: function (row) {
          this.inEpc.epc.length = 0
          this.inNumber = 0
          var number = []
          var num = 0
          row.forEach(cell => {
            this.inEpc.epc.push(cell.epc)
            if (cell.qty != '') {
              number = cell.qty.split('/')
              num = number[1].substr(0, number[1].indexOf('P'))
              this.inNumber += parseInt(num)
            }
          })
          this.passNum = this.inEpc.epc.length
      },
      clickRow: function (row) {
        this.isClick = 1
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      othercloseTip: function () {
        this.tipVisible = false
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
      listScroll: function () {
        var par = document.getElementById("mescroll")
        var list=par.getElementsByClassName('el-table__body-wrapper')[0]
        if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
          this.posList = list.scrollTop
          this.page += 1
          if (this.sumCount > (this.page - 1) * 10) {
            this.onSubmit()
          }
        }
      },
      onSubmit: function () {
        this.inParams.inventorySerialVo.departmentCode=this.global.kfNow.departmentCode
        this.inParams.pageModel.pageNo=this.page
        InStorage.get({params: this.inParams})
          .then(response => {
            if (response.rows.length == 0 && this.tableData.length == 0) {
              this.dataVisible = true
            }
            else {
              this.dataVisible = false
              this.isLoading = false
              this.sumCount = response.total
              response.rows.forEach(cell => {
                cell.opt_date = this.GMTToStr(cell.opt_date)
                this.tableData2.push(cell)
              })
            }
          }, response => {
            console.info('fail')
          })
      },
      //入库确认
      confirm: function () {
        if(this.isOpen) {
          this.isInLogin=true
        }
      },
      closeLogin: function () {
        this.global.isLoginer=false
        if (this.passNum == 0) {
          this.tipVisible = !this.tipVisible
          this.alertText = '请选择入库耗材!'
        }
        else {
          // 点击确认停止监测epc
          this.isInLogin=false
          this.closeIcon = false
          this.push.op = 2
          this.messagectl(this.push)
          //this.$socket.emit('messagectl');
          this.submitIn(this.inEpc)
          //this.$socket.emit('confirm', this.inEpc)
        }
      },
      closeOtherLogin: function () {
        this.isInLogin=false
        this.closeIcon = false
      },
      submitIn:function(code){
        confirmSubmit.submitIn({params: code})
          .then(response => {
            if(response.connected){
              this.finishVisible = true
              this.dataVisible = true
              this.tableData.length = 0
              console.log(this.tableData.length)
              if (!this.voiceFlag) {
                var audio = new Audio(
                  'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + this.passNum + '件耗材完成入库'
                ).play();
              }
              this.openText='停止扫描'
              this.isOpen=false
              // 入库完成重新监测epc
              setTimeout(() => {
                if (!this.closeIcon) {
                  this.tableData.length = 0
                  this.finishVisible = false
                  this.push.op=1
                  this.messagectl(this.push)
                  //this.$socket.emit('messagectl');
                }
              }, 10000)
            }
            else{
                this.tipVisible=!this.tipVisible
                this.alertText='入库失败!'
            }
          }, response => {
            console.info('fail')
          })
      },
    },
  }
</script>
<style lang="scss">

</style>
