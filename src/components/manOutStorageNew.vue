<template>
  <div class="about_inStorage">
    <div class="right_top_section">
      <div class="drop_choose" @click="dialogVisible = !dialogVisible">
        <img src="../assets/choose.png">
        <span>{{activeKf}}</span>
      </div>
      <span>{{topText}}</span>
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
      <div class="inStoragelist">
        <div class="byEpc">
          <label>EPC:</label>
          <input type="text" class="ipt_epc" placeholder="请输入卡号">
          <button class="epc_btn" @click="searchList">确定</button>
        </div>
        <div class="table_view pass_first_th" v-if="!dataVisible">
          <el-table :data="tableData"  height="450" ref="multipleTable" style="width: 100%" border @selection-change="checkedRow"
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
                      v-if="!scope.row.isExpire&&!scope.row.isCloseToExpire">{{scope.row.expire_date}}</span>
              </template>
            </el-table-column>
            <!--   <el-table-column prop="opt_date" label="操作时间" width="100" sortable show-overflow-tooltip>
                     </el-table-column> -->
          </el-table>
        </div>
        <div class="foot_btn_group">
          <div class="foot_btn receive" v-if="!dataVisible" @click="save">确认出库</div>
        </div>
      </div>
      <div class="noData" v-if="dataVisible">
        <tableNoData></tableNoData>
      </div>
    </div>
    <!-- 科室选择 -->
    <kfChoose v-if="dialogVisible" :dialogVisible="dialogVisible" @closeKf="closeKf" @othercloseKf="closeKf"></kfChoose>
    <!-- 提示框 -->
    <alertTipNew v-if="tipVisible" :tipVisible="tipVisible" :alertText="alertText" @closeTip="closeTip"
                 @othercloseTip="othercloseTip"></alertTipNew>
    <!-- 成功提示 -->
    <finishTipNew v-if="finishVisible" :statusFlag="statusFlag" :passNum="passNum" :finishVisible="finishVisible"
                  @othercloseF="othercloseF"></finishTipNew>
  </div>
</template>
<script type="text/javascript">
  import kfChoose from '../components/kfChoose'
  import alertTipNew from '../components/alertTipNew'
  import tableNoData from '../components/tableNoData'
  import finishTipNew from '../components/finishTipNew'
  import {store,confirmSubmit} from '../config/api'
  export default {
    data () {
      return {
        tab: ['全部', '过期耗材', '缺货耗材', '近效期耗材', '正常耗材'],
        num: 0,
        tableData: [],
        dialogVisible: false,
        activeKf: '',
        kfNum: '',
        headNum: 0,
        closeVoice: false,
        tipVisible: false,
        finishVisible: false,
        passNum: 0,
        alertText: '',
        statusFlag: 3,
        dataVisible: true,
        epcPrames: {
          epc: '',
        },
        outEpc: {
          epc: [],
        },
        tableFlag: '',
        tmpArr: [],
        tableLength: 0,
        newDataEpc: '',
        voiceFlag: this.global.closeVoice,
        // 库房选择
        choosedStore: {
          departmentCode: '',
        },
      }
    },
    props: ['topText'],
    components: {kfChoose, alertTipNew, tableNoData, finishTipNew},
    sockets: {

    },
    mounted(){
      this.activeKf = this.global.kfNow.departmentName
    },
    watch: {
      voiceFlag: function (val) {
        console.log(val)
      }
    },
    updated: function () {
      this.tableFlag = this.$refs.multipleTable
      if (this.tableData.length > 0) {
        this.tableData.forEach(cell => {
          // if(this.newDataEpc==cell.epc){
          this.$refs.multipleTable.toggleRowSelection(cell, true);
          // }
        })
      }
    },
    methods: {
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice
        this.voiceFlag = this.global.closeVoice
        // console.log(this.voiceFlag)
      },
      searchEpc: function (code) {
        store.byEpc({params: code})
          .then(data => {
            if (data === null||data === '') {
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
      conditionFind: function (item, index) {
        this.num = index
      },
      closeKf: function (data) {
        this.dialogVisible = false
        this.activeKf = data.departmentName
        this.choosedStore.departmentCode = data.departmentCode
        this.$socket.emit('set_department', this.choosedStore)
      },
      closeTip: function (data) {
        this.tipVisible = false
      },
      othercloseTip: function (data) {
        this.tipVisible = false
      },
      othercloseKf: function () {
        this.dialogVisible = false
      },
      clickRow: function (row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      othercloseF: function () {
        this.finishVisible = false
      },
      dedupe: function (array) {
        return Array.from(new Set(array));
      },
      save: function () {
        if (this.passNum == 0) {
          this.tipVisible = !this.tipVisible
          this.alertText = '请选择出库耗材!'
        }
        else {
          this.submitOut(this.outEpc)
          //this.$socket.emit('submit_OutStock', this.outEpc); //在这里触发connect事件
        }
      },
       submitOut:function(code){
        confirmSubmit.submitOut({params: code})
          .then(data => {
            if (data.isSubmit) {
              this.finishVisible = true
              this.dataVisible = true
              this.tableData=[]
              document.getElementsByClassName('ipt_epc')[0].value = ''
              console.log(document.getElementsByClassName('ipt_epc')[0].value)
              if (!this.voiceFlag) {
                var audio = new Audio(
                  'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=已有' + this.passNum + '件耗材完成出库'
                ).play();
              }
              setTimeout(() => {
                this.finishVisible = false
              }, 10000)
            }
            else{
                this.tipVisible=!this.tipVisible
          	    this.alertText='出库失败!'
            }
          }, response => {
            console.info('fail')
          })
      },
      checkedRow: function (row) {
        this.outEpc.epc.length = 0
        row.forEach(cell => {
          this.outEpc.epc.push(cell.epc)
        })
        this.passNum = this.outEpc.epc.length
      },
      headSwitch: function (data) {
        if (data === 0) {
          this.headNum = 0
        }
        else if (data === 1) {
          this.headNum = 1
        }
      },
    },
  }
</script>
<style lang="scss">

</style>
