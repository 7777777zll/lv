<template>
  <div class="metarialDetail">
    <div class="metarial_top_section">
      <div class="drop_choose topReback" @click="reback">
        <img src="../assets/reback.png">
        <span class="text">返回</span>
      </div>
      耗材详情
      <div class="info_login" v-if="global.loginer!==''">
        <span class="login_name">欢迎, {{global.loginer}}</span>
        <span class="login_out" @click="backOut">退出</span>
      </div>
      <div class="voice" @click="closeVoice=!closeVoice">
        <img src="../assets/voice.png" v-if="voiceFlag==false">
        <img src="../assets/shutDown.png" v-if="voiceFlag">
      </div>
    </div>
    <div class="table_view" v-if="!dataVisible">
      <el-table :data="tableData" height="550" stripe style="width: 100%" border v-loading="isLoading" element-loading-text="加载中">
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
    <div class="noData" v-if="dataVisible">
      <tableNoData></tableNoData>
    </div>
  </div>
</template>
<script type="text/javascript">
  import tableNoData from '../components/tableNoData'
  import {store} from '../config/api'
  export default {
    data () {
      return {
        closeVoice: false,
        tableData: [],
        dataVisible: false,
        voiceFlag: this.global.closeVoice,
        paramesCode: {
          cstCode: '',
          departmentCode: '',
        },
        isLoading: true,
      }
    },
    sockets: {
    },
    mounted(){
      this.paramesCode.cstCode = this.$route.params.cstCode
      this.paramesCode.departmentCode = this.$route.params.departmentCode
      console.log(this.paramesCode)
      this.cstcodeDetail(this.paramesCode)
      //this.$socket.emit('cstcode_Detail', this.paramesCode);
    },
    components: {tableNoData},
    methods: {
      backOut:function(){
        this.$router.go(-1)
        this.loginOut()
      },
      reback:function(){
        this.$router.go(-1)
        this.global.rebackFlag=1
      },
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice
        this.voiceFlag = this.global.closeVoice
      },
      cstcodeDetail: function (paramesCode) {
        store.consumablesDetail({inventoryDetailVo: paramesCode})
          .then(data => {
            if (data.length > 0) {
              this.isLoading = false
              this.dataVisible = false
              this.tableData = data
            }
            else {
              this.dataVisible = true
            }
          }, response => {
            console.info('fail')
          })
      }
    }
  }
</script>
<style lang="scss">
  .metarialDetail {
    margin-top: 44px;
    .metarial_top_section {
      background: #fff;
      text-align: center;
      height: 44px;
      line-height: 44px;
      color: #1C6573;
      font-size: 17px;
      font-weight: bold;
      box-shadow: 0 0 10px #ccc;
      padding: 0 15px;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      .right_head_switch {
        display: inline-block;
        span {
          display: inline-block;
          width: 100px;
          height: 28px;
          line-height: 28px;
          color: #27A094;
          border: solid 1px #979797;
          background: #f8f7f6;
          font-size: 16px;
          cursor: pointer;
        }
        .right_cell {
          border-radius: 0 25px 25px 0;
          margin-left: -10px;
        }
        .left_cell {
          border-radius: 25px 0 0 25px;
        }
        .middle_cell {
          margin-left: -10px;
        }
        .headCellChoosed {
          color: #fff;
          border: solid 1px #27A094;
          background: #27A094;
        }
      }
      .voice {
        float: right;
        margin-top: 3px;
        img {
          width: 20px;
        }
      }
    }
    .table_view {
      text-align: center;
      padding: 20px;
    }
    .info_login{
      top:0;
    }
  }

</style>
