 <template>
    <div class="reason_container">
	    <section class="reason_text_container">
            <p class="tip_text">请选择退货原因:</p>
            <el-radio-group v-model="reason" @change="choosed()">
                <el-radio :label="1">仓库不够用</el-radio>
                <el-radio :label="2">送错</el-radio>
                <el-radio :label="3">其他</el-radio>
            </el-radio-group>
            <div class="confrim" @click="closeIptTip">确认</div>
        </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
                reason:'',
                reasonPass:'',
            }
        },
        mounted(){
      
        },
        props: ['iptText'],
        methods: {
            closeIptTip(){
                this.$emit('closeIptTip',this.reasonPass)
            },
            choosed(){
                console.log(this.reason)
                if(this.reason==1){
                    this.reasonPass='仓库不够用'
                }
                if(this.reason==2){
                    this.reasonPass='送错'
                }
                if(this.reason==3){
                    this.reasonPass='其他'
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/base/mixin';
    .reason_container{
        background:rgba(0,0,0,0.5);
    	position: fixed;
    	top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
    }
    .reason_text_container{
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        width: 30%;
        background-color: rgba(255,255,255,1);
        border: 1px;
        padding-top: 10px;
        border: 1px;
        border-radius: 4px;
        text-align: center;
        .tip_text{
            @include sc(14px, #333);
            line-height: 24px;
            text-align: center;
            margin: 15px 0;
            padding: 0 0 0 15px;
            text-align: left;
        }
        .confrim{
            @include sc(14px, #fff);
            font-weight: bold;
            margin: 28px;
            background-color: #4cd964;
            padding:7px 17px;
            text-align: center;
            border-radius:4px;
            width: 30%;
            float: right;
            // float:right;
        }
        .textarea_reason{
            width:80%;
            height:120px;
            resize:none;
            border:solid 1px #ccc;
            margin:20px 0;
            padding:15px;
        }
    }
    
</style>
