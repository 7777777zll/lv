<template>
  <div class="about_inStorage">
    <div class="right_top_section">
      <div class="drop_choose" @click="dialogVisible = !dialogVisible">
        <img src="../assets/choose.png">
        <span>{{activeKf}}</span>
      </div>
      <div class="right_head_switch">
        <span class="left_cell" :class="{headCellChoosed:headNum==0}" @click="headSwitch(0)">退货</span>
        <span class="right_cell" :class="{headCellChoosed:headNum==1}" @click="headSwitch(1)">退货耗材</span>
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
      <div class="inStoragelist" v-show="headNum==0">
        <div class="reason_group">
          <label>退货原因:</label>
          <ul class="reason_wrap">
            <li v-for="(item,index) in optionsReback" :class="{reasonChoosed:index == reasonNum}"
                @click="reasonChoose(item,index)">{{item.reasonText}}
            </li>
          </ul>
        </div>
        <div class="byEpc">
          <label>EPC:</label>
          <input type="text" class="ipt_epc" placeholder="请输入卡号">
          <button class="epc_btn" @click="searchList">确定</button>
        </div>
        <div class="table_view pass_first_th" v-if="!dataVisible">
          <el-table :data="tableData" height="400" ref="multipleTable" style="width: 100%" @selection-change="checkedRow" border
                    :default-sort="{prop: 'opt_date', order: 'descending'}" @row-click="clickRow">
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
            <!--  <el-table-column prop="opt_date" label="操作时间" width="100" sortable show-overflow-tooltip>
                    </el-table-column> -->
          </el-table>
        </div>
        <div class="foot_btn_group">
          <span class="foot_btn disabled" :class="{receive:isOpen}" @click="save" v-if="!dataVisible">确认退货</span>
          <span class="foot_btn stopScan" @click="stopScan" v-if="!dataVisible">{{openText}}</span>
        </div>
      </div>
      <div class="table_view" v-show="headNum==1&&!dataVisible">
        <div class="mescroll" id="mescroll">
          <div id="dataList" class="data-list">
            <el-table :data="tableData2" height="550" style="width: 100%" border v-loading="isLoading" element-loading-text="加载中">
              <el-table-column prop="sku" label="名称" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="epc" label="EPC" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="guige" label="品规" width="200" show-overflow-tooltip>
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
              <el-table-column prop="reason" label="退货原因" width="120" show-overflow-tooltip>
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
    <!-- 科室选择 -->
    <kfChoose v-if="dialogVisible" :dialogVisible="dialogVisible" @closeKf="closeKf"
              @othercloseKf="othercloseKf"></kfChoose>
    <!-- 提示框 -->
    <alertTipNew v-if="tipVisible" :tipVisible="tipVisible" :alertText="alertText"
                 @othercloseTip="othercloseTip"></alertTipNew>
    <finishTipNew v-if="finishVisible" :statusFlag="statusFlag" :passNum="passNum" :finishVisible="finishVisible"
                  @othercloseF="othercloseF"></finishTipNew>
  </div>
</template>
<script type="text/javascript">
  import {backGoods, store,confirmSubmit} from '../config/api'
  import kfChoose from '../components/kfChoose'
  import alertTipNew from '../components/alertTipNew'
  import tableNoData from '../components/tableNoData'
  import finishTipNew from '../components/finishTipNew'
  export default {
    data () {
      return {
        mescroll: null,
        tab: ['全部', '过期耗材', '缺货耗材', '近效期耗材', '正常耗材'],
        num: 0,
        tableData: [],
        tableData2: [],
        dialogVisible: false,
        activeKf: '',
        kfNum: '',
        headNum: 0,
        reasonNum: 0,
        alertText: '',
        closeVoice: false,
        optionsReback: [],
        tipVisible: false,
        dataVisible: true,
        isLoading: true,
        passNum: 0,
        finishVisible: false,
        statusFlag: 2,
        epcPrames: {
          epc: '',
        },
        inventoryRecall: {
          reasonSerial: '',
          epc: [],
        },
        newDataEpc: '',
        page: 1,
        sumCount: 0,
        closeIcon: false,
        posList: 0,
        voiceFlag: this.global.closeVoice,
        // 库房选择
        choosedStore: {
          departmentCode: '',
        },
        backParams: {
          inventorySerialVo: {
            departmentCode: '',
          },
          pageModel: {
            pageNo: 1,
          }
        },
        push:{
          identification: '',
          op:3,
        },
        isOpen:false,
        openText:'停止扫描',
      }
    },
    props: ['topText'],
    watch: {
      voiceFlag: function (val) {
//        console.log(val)
      }
    },
    components: {kfChoose, alertTipNew, tableNoData, finishTipNew},
    sockets: {
      message_Back: function (data) {
        this.addMessage(data.reduceDetailVoList)
      },
    },
    mounted(){
      this.activeKf = this.global.kfNow.departmentName;
      this.push.identification=this.global.identify;
      this.getReason();
      //this.$socket.emit('get_Back_Reason');
      //this.$socket.emit('messagectl');
      this.messagectl(this.push);
      this.$socket.emit('message_Back');
    },
    updated: function () {
      this.tableFlag = this.$refs.multipleTable;
      if (this.tableData.length > 0 && !this.isOpen) {
        this.tableData.forEach(cell => {
          // if(this.newDataEpc==cell.epc){
          this.$refs.multipleTable.toggleRowSelection(cell, true);
          // }
        })
      }
      var par = document.getElementById("mescroll");
      var list=par.getElementsByClassName('el-table__body-wrapper')[0];
      list.scrollTop = this.posList;
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
          this.push.op=3
          this.messagectl(this.push)
          this.openText='停止扫描'
        }
      },
      getReason: function () {
        backGoods.reason()
          .then(data => {
            this.optionsReback = data;
            this.inventoryRecall.reasonSerial = data[0].reasonSerial
          }, response => {
            console.info('fail')
          })
      },
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice;
        this.voiceFlag = this.global.closeVoice
      },
      addMessage: function (data) {
        data.forEach(row => {
          // 临时变更需求,扫描累计加,后扫描不到的也不再减少
          if (row.departmentCode===this.global.kfNow.departmentCode) {
            this.dataVisible = false;
            this.tableData.push(row);
            var hash = {};
            this.tableData = this.tableData.reduce(function (item, next) {
              hash[next.epc] ? '' : hash[next.epc] = true && item.push(next);
              return item
            }, [])
          }
//          else {
//            for (var i = 0; i < this.tableData.length; i++) {
//              if (this.tableData[i].epc == row.epc) {
//                this.tableData.splice(i, 1)
//              }
//              if (this.tableData.length == 0) {
//                this.dataVisible = true
//              }
//              else {
//                this.dataVisible = false
//              }
//            }
//          }
        })
      },
      conditionFind: function (item, index) {
        this.num = index
      },
      clickRow: function (row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      closeKf: function (data) {
        this.dialogVisible = false
        this.activeKf = data.departmentName
        this.choosedStore.departmentCode = data.departmentCode
        this.$socket.emit('set_department', this.choosedStore)
      },
      othercloseF: function () {
        this.closeIcon = true
        this.finishVisible = false
        this.isOpen=false
        this.openText='停止扫描'
        this.push.op=3
        this.messagectl(this.push)
      },
      reasonChoose: function (item, index) {
        this.reasonNum = index
        this.inventoryRecall.reasonSerial = item.reasonSerial
      },
      othercloseKf: function () {
        this.dialogVisible = false
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
        this.backParams.inventorySerialVo.departmentCode = this.global.kfNow.departmentCode
        this.backParams.pageModel.pageNo = this.page
        backGoods.get({params: this.backParams})
          .then(response => {
            if (response.rows.length == 0 && this.tableData.length == 0) {
              this.dataVisible = true
            }
            else {
              this.dataVisible = false
              this.sumCount = response.total
              this.isLoading = false
              response.rows.forEach(cell => {
                cell.opt_date = this.GMTToStr(cell.opt_date)
                this.tableData2.push(cell)
              })
            }
          }, response => {
            console.info('fail')
          })
      },
      headSwitch: function (data) {
        this.tableData = []
        this.dataVisible = true
        if (data === 0) {
          this.isOpen=false
          this.openText='停止扫描'
          document.getElementsByClassName('ipt_epc')[0].value = ''
          this.headNum = 0
          this.push.op=3
          this.messagectl(this.push)
        }
        else if (data === 1) {
          this.page = 1
          this.isLoading = true
          this.tableData2 = []
          this.dataVisible = false
          this.onSubmit()
          this.push.op=2
          this.messagectl(this.push)
          this.headNum = 1
        }
      },
      save: function () {
        if(this.isOpen) {
          if (this.passNum == 0) {
            this.tipVisible = !this.tipVisible
            this.alertText = '请选择退货耗材!'
          }
          else {
            this.closeIcon = false
            this.submitBack(this.inventoryRecall)
            //this.$socket.emit('submit_Back', this.inventoryRecall); //在这里触发connect事件
          }
        }
      },
      submitBack:function(code){
        confirmSubmit.submitBack({inventoryRecall: code})
          .then(data => {
            if (data.isSubmit) {
              this.finishVisible = true
              this.dataVisible = true
              this.tableData=[]
              document.getElementsByClassName('ipt_epc')[0].value = ''
              if (!this.voiceFlag) {
                var audio = new Audio(
                  'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + this.passNum + '件耗材完成退货'
                ).play();
              }
              setTimeout(() => {
                if (!this.closeIcon) {
                  this.isOpen=false
                  this.openText='停止扫描'
                  this.push.op=3
                  this.messagectl(this.push)
                  this.finishVisible = false
                }
              }, 10000)
            }
            else {
              this.tipVisible = !this.tipVisible
              this.alertText = '退货失败!'
            }
          }, response => {
            console.info('fail')
          })
      },
      checkedRow: function (row) {
          this.inventoryRecall.epc.length = 0
          row.forEach(cell => {
            this.inventoryRecall.epc.push(cell.epc)
          })
          this.passNum = this.inventoryRecall.epc.length
      },
      searchList: function () {
        var iptEpc = document.getElementsByClassName('ipt_epc')[0].value
        if (iptEpc == '') {
          this.tipVisible = !this.tipVisible
          this.alertText = '请输入EPC号!'
        }
        else {
          this.epcPrames.epc = iptEpc
          this.searchEpc(this.epcPrames.epc)
          //this.$socket.emit('search_epc', this.epcPrames)
        }
      },
      searchEpc: function (code) {
        store.byEpc({params: code})
          .then(data => {
            if (data.length == 0) {
              if (this.tableData.length == 0) {
                this.dataVisible = true
              }
              else {
                this.dataVisible = false
              }
              this.tipVisible = !this.tipVisible
              this.alertText = '请输入正确epc号!'
            }
            else {
              this.dataVisible = false
              this.tableData.push(data)
              this.newDataEpc = data.epc
              var hash = {};
              this.tableData = this.tableData.reduce(function (item, next) {
                hash[next.epc] ? '' : hash[next.epc] = true && item.push(next);
                return item
              }, [])
            }
          }, response => {
            console.info('fail')
          })
      },
    },
  }
</script>
<style lang="scss">
  .reason_group {
    margin-bottom: 18px;
    .reason_wrap {
      display: inline-block;
      li {
        display: inline-block;
        padding: 3px 11px;
        background: #fff;
        color: #585858;
        border-radius: 15px;
        border: solid 1px #ccc;
        margin-right: 10px;
        cursor: pointer;
      }
      .reasonChoosed {
        background: #27A094;
        color: #fff;
        border-radius: 15px;
        border: solid 1px #27A094;
      }
    }
  }
</style>
