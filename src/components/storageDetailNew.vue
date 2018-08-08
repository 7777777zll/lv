<template>
  <div class="about_storage_detail">
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
      <div class="tab_switch">
        <span>筛选: </span>
        <ul class="tab_wrap" v-for="(item,index) in tab">
          <li class="tabCell" :class="{itemChoosed:index == num}" @click="conditionFind(item,index)">{{item}}</li>
        </ul>
      </div>
      <div class="table_view" v-if="!dataVisible">
        <el-table :data="tableData" height="500" stripe style="width: 100%" border @row-click="openDetails" v-loading="isLoading"
                  element-loading-text="加载中">
          <el-table-column prop="sku" label="名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="guige" label="品规" width="220" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="location_id" label="货位" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instock" label="库存数量" width="100" show-overflow-tooltip>

          </el-table-column>
          <el-table-column prop="delivered" label="备货数量" width="100" show-overflow-tooltip>

          </el-table-column>
          <el-table-column  prop="outofstock" label="缺货数量" width="100" show-overflow-tooltip>

          </el-table-column>
          <el-table-column label="最近效期" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="text" size="small" class="expire outdata" v-if="scope.row.isExpire">已过期</span>
              <span type="text" size="small" class="expire insix" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='6个月'">≤{{scope.row.expire_date}}</span>
              <span type="text" size="small" class="expire inthree" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='3个月'">≤{{scope.row.expire_date}}</span>
              <span type="text" size="small" class="expire inone" v-if="scope.row.isCloseToExpire&&!scope.row.isExpire&&scope.row.expire_date==='1个月'">≤{{scope.row.expire_date}}</span>
              <span type="text" size="small"
                    v-if="!scope.row.isExpire&&!scope.row.isCloseToExpire">{{(scope.row.expire_date==''||scope.row.expire_date==null)?'--':scope.row.expire_date}}</span>
            </template>
          </el-table-column>
        </el-table>
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
  import kfChoose from '../components/kfChoose'
  import tableNoData from '../components/tableNoData'
  import {store} from '../config/api'
  export default {
    data () {
      return {
        tableData: [],
        tab: ['全部', '过期耗材', '缺货耗材', '近效期耗材', '正常耗材'],
        num: 0,
        activeKf: '',
        dialogVisible: false,
        dataVisible: false,
        isLoading: true,
        kfNum: 0,
        voiceFlag: this.global.closeVoice,
        statusFlag: 0,//0:无数据,1:完成入库,2:完成退货,3:完成出库
        // 库房选择
        choosedStore: {
          departmentCode: '',
          optkind: 0
        },
        isOut:this.global.isLoginOut,
      }
    },
    props: ['topText'],
    sockets: {

    },
    watch:{
      isOut:function(data){
        console.log(data)
        if(data){
//          this.loginOut()
          this.$root.menu0=false
        }
      }
    },
    mounted(){
      this.choosedStore.departmentCode = this.global.kfNow.departmentCode
      console.log(this.global.kfNow.departmentName)
      this.activeKf = this.global.kfNow.departmentName
      this.storeDetail(this.choosedStore)
      //this.$socket.emit('department_Detail', this.choosedStore);
    },
    components: {kfChoose, tableNoData},
    watch: {
      voiceFlag: function (val) {
        console.log(val)
      }
    },
    methods: {
      conditionFind: function (item, index) {
        console.log( this.global.isLoginOut)
        this.num = index
        this.choosedStore.optkind = index
        this.storeDetail(this.choosedStore)
        //this.$socket.emit('department_Detail', this.choosedStore);
      },
      storeDetail: function (params) {
        store.storeDetail({inventoryDetailVo: params})
          .then(data => {
            this.tableData = data;
            if (data.length > 0) {
              this.dataVisible = false
              this.isLoading = false
            }
            else {
              this.dataVisible = true
            }
          }, response => {
            console.info('fail')
          })
      },
      voiceCheck: function () {
        this.global.closeVoice = !this.global.closeVoice
        this.voiceFlag = this.global.closeVoice
        // console.log(this.voiceFlag)
      },
      closeKf: function (data) {
        this.dialogVisible = false
        this.activeKf = data.departmentName
//        console.log(this.activeKf)
        this.choosedStore.departmentCode = data.departmentCode
        //this.$socket.emit('set_department', this.choosedStore)
        this.storeDetail(this.choosedStore)
        //this.$socket.emit('department_Detail', this.choosedStore);
      },
      othercloseKf: function () {
        this.dialogVisible = false
      },
      openDetails: function (row) {
        //console.log(this.cdParams)
        this.$router.push({path: '/metarialDetailNew/' + row.cstCode + '/' + this.choosedStore.departmentCode})
      }
    },
  }
</script>
<style lang="scss">

</style>
