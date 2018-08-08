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
      <div class="inStoragelist" v-show="!dataVisible">
        <div class="table_view">
          <div class="mescroll" id="mescroll">
            <div id="dataList" class="data-list">
              <el-table :data="tableData" height="550" style="width: 100%" border v-loading="isLoading" element-loading-text="加载中">
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
      </div>
      <div class="noData" v-if="dataVisible">
        <tableNoData></tableNoData>
      </div>
    </div>
    <!-- 科室选择 -->
    <kfChoose v-if="dialogVisible" :dialogVisible="dialogVisible" @closeKf="closeKf"
              @othercloseKf="othercloseKf"></kfChoose>
  </div>
</template>
<script type="text/javascript">
  import {OutStorage} from '../config/api'
  import kfChoose from '../components/kfChoose'
  import tableNoData from '../components/tableNoData'
  export default {
    data () {
      return {
        num: 0,
        tableData: [],
        dialogVisible: false,
        activeKf: '',
        kfNum: '',
        headNum: 0,
        voice: false,
        intervalid: '',
        closeVoice: false,
        isLoading: true,
        dataVisible: false,
        page: 1,
        sumCount: 0,
        posList: 0,
        voiceFlag: this.global.closeVoice,
        // 库房选择
        choosedStore: {
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
      }
    },
    props: ['topText'],
    components: {kfChoose, tableNoData},
    mounted(){
      this.activeKf = this.global.kfNow.departmentName
      this.onSubmit()
//      this.intervalid = setInterval(() => {
//        if (this.sumCount > (this.page - 1) * 10) {
//          this.onSubmit()
//        }
//      }, 1000)
    },
    updated: function () {
      // console.log('updata')
      var par = document.getElementById("mescroll")
      var list=par.getElementsByClassName('el-table__body-wrapper')[0]
      list.scrollTop = this.posList
      list.addEventListener('scroll', this.listScroll, false)
    },
    watch: {
      voiceFlag: function (val) {
        console.log(val)
      }
    },
    beforeDestroy () {
      clearInterval(this.intervalid)
    },
    methods: {
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice
        this.voiceFlag = this.global.closeVoice
        // console.log(this.voiceFlag)
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
      othercloseKf: function () {
        this.dialogVisible = false
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
      getScrollTop: function () {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        console.log(scrollTop)
        return scrollTop;
      },

      //获取当前可视范围的高度
      getClientHeight: function () {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
          clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
      },

      //获取文档完整的高度
      getScrollHeight: function () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
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
        this.outParams.inventorySerialVo.departmentCode = this.global.kfNow.departmentCode
        this.outParams.pageModel.pageNo = this.page
        OutStorage.get({params: this.outParams})
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
                this.tableData.push(cell)
              })
//              var hash = {};
//              this.tableData = this.tableData.reduce(function (item, next) {
//                hash[next.index] ? '' : hash[next.index] = true && item.push(next);
//                return item
//              }, [])
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
