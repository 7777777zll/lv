<template>
    <div class="finishTipNew">
        <!-- 科室选择 -->
        <el-dialog
          :visible.sync="visible"
          width="30%"
          @close="modalClose"
          >
          <div class="title_Tip">
            <div class="table_null"  v-if="statusFlag==1">
                <img src="../assets/finish_in.png">
                <p class="text">已有{{passNum}}件耗材完成入库</p>
            </div>
            <div class="table_null"  v-if="statusFlag==2">
                <img src="../assets/finish_reback.png">
                <p class="text">已有{{passNum}}件耗材完成退货</p>
            </div>
            <div class="table_null"  v-if="statusFlag==3">
                <img src="../assets/finish_out.png">
                <p class="text">已有{{passNum}}件耗材完成出库</p>
            </div>
        </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    export default {
        data () {
            return {
              visible:this.finishVisible
            }
        },
        props: ['finishVisible','statusFlag','passNum'],
        sockets:{
        },
        mounted(){

        },
        watch: {
          finishVisible () {
            this.visible = this.finishVisible;
          }
        },
        methods: {
            modalClose:function(){
                this.$emit('othercloseF')
            }
        },
    }
</script>
<style lang="scss">
    .finishTipNew{
        .table_null{
            margin:auto;
        }
    }
</style>
