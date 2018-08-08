<template>
    <div class="recovery_page">
        <!-- 科室选择 -->
        <el-dialog
          :visible.sync="recoveryVisible"
          width="30%"
          @close="modalClose"
          >
         <P class="title">出库耗材</P>
         <div class="recovery_wrap">
             <table class="recovery_table">
                 <tr>
                   <td width="50">名称</td>
                   <td width="100">{{recoveryData.sku}}</td>
                 </tr>
                  <tr>
                   <td  width="50">EPC</td>
                   <td width="100">{{recoveryData.epc}}</td>
                 </tr>
                  <tr>
                   <td  width="50">品规</td>
                   <td width="100">{{recoveryData.guige}}</td>
                 </tr>
                  <tr>
                   <td  width="50">数量</td>
                   <td width="100">1/{{recoveryData.qty}}PCS</td>
                 </tr>
                  <tr>
                   <td  width="50">批次</td>
                   <td>
                     <div v-if="Array.isArray(recoveryData.batch)" width="100">
                       <p v-for="(item,index) in recoveryData.batch">{{item}}</p>
                     </div>
                     <div v-else width="100">
                       <p>{{recoveryData.batch}}</p>
                     </div>
                   </td>
                 </tr>
                 <tr>
                   <td  width="50">效期</td>
                   <td width="100">{{recoveryData.expire_date}}</td>
                 </tr>
             </table>
         </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    export default {
        data () {
            return {
              tableData:[],
            }
        },
        props: ['recoveryVisible','recoveryData'],
        mounted(){
          console.log(this.recoveryData)
          var number = this.recoveryData.qty.split('/');
          this.recoveryData.qty = number[1].substr(0, number[1].indexOf('P'))
        },
        methods: {
            modalClose:function(){
                this.$emit('closeRecovery')
            },
        },
    }
</script>
<style lang="scss">
    .recovery_page{
        .el-dialog__body{
            padding:0;
        }
        .title{
            text-align:center;
            color:#333;
            font-size:20px;
            font-weight:bold;
            padding-bottom:20px;
        }
        .recovery_wrap{
          padding:0 25px 25px;
        }
        .recovery_table{
            width:100%;
            margin:auto;
            border-collapse: collapse;
            // border: 1px solid black;
            th,td{
              border-bottom: 1px solid #e8e7e4;
              background:#F7F7F7;
              color:#333333;
              padding:9px 9px;
              word-wrap: break-word;
              word-break: break-all;
              text-align:center;
            }
            tr td:nth-child(1){
              background:#27A094;
              color:#fff;
            }
        }
    }
</style>
