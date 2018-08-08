<template>
  <div class="alertTip_page">
    <!-- 科室选择 -->
    <el-dialog
      :visible.sync="visible"
      width="30%"
      @close="modalClose"
    >
      <div class="title_Tip">
        <img src="../assets/warn.png" class="warn_icon">
        <span>提示</span>
      </div>
      <p class="tip_cnt">{{alertText}}</p>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {store} from '../config/api'
  export default {
    data () {
      return {
        kfNum: '',
        nowKf: '',
        // 设置库房
        storeType: 3,
        // 库房选择
        optionsStore: [],
        visible:this.tipVisible,
      }
    },
    props: ['tipVisible', 'alertText'],
    sockets: {

    },
    mounted(){

    },
    watch: {
      tipVisible () {
        this.visible = this.tipVisible;
      }
    },
    methods: {
      modalClose: function () {
        this.$emit('othercloseTip')
      }
    },
  }
</script>
<style lang="scss">
  .alertTip_page {
    font-size: 15px;
    .el-dialog {
      border: solid 1px #FAAD14;
      border-radius: 8px;
      outline: 0;
      background: #fffbe4;
    }
    .el-dialog__header {
      padding: 0;
    }
    .title_Tip {
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 8px;
    }
    .el-dialog__body {
      padding: 33px 20px;
    }
    .warn_icon {
      width: 20px;
      margin-right: 10px;
      display: inline-block;
      vertical-align: middle;
    }
    .tip_cnt {
      padding-left: 35px;
    }
  }
</style>
