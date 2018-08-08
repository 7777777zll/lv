<template>
	<div class="about_kfChoose">
		<!-- 科室选择 -->
		<el-dialog
		  :visible.sync="visible"
		  width="30%"
		  @close="modalKfClose"
		  class="modal_kf">
		  <div class="title_kf">请选择库房</div>
		  <ul class="kf_wrap" v-for="(item,index) in optionsStore">
		  	<li class="kf_cell" :class="{kfChoosed:index == kfNum}" @click="kfFind(item,index)">{{item.departmentName}}</li>
		  </ul>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="kfConfirm">确认</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script type="text/javascript">
  import {store} from '../config/api'
	export default {
	    data () {
	        return {
	        	kfNum:'',
	        	nowKf:'',
	        	// 库房选择
	        	optionsStore:[],
            visible:this.dialogVisible,
            choosed:'',
	        }
	    },
	    props: ['dialogVisible'],
	    sockets:{
	    },
	    mounted(){
	    	this.kfNum=this.global.chooseTab
	    	this.optionsStore=this.global.kfAll
	    },
      watch: {
        dialogVisible () {
          this.visible = this.dialogVisible;
        }
      },
	    methods: {
	    	kfFind:function(item,index){
	    		this.kfNum=index
          this.choosed=item
	    		this.global.chooseTab=index
	    	},
	    	kfConfirm:function(){
          if(this.choosed!==''){
            this.global.kfNow=this.choosed
          }
          console.log(this.global.kfNow.departmentCode)
          this.setDepartment(this.global.kfNow.departmentCode)
//          根据当前库房设置推送设备标识
//          this.global.identify= this.global.identifyArr[1][0]
//          console.log(this.global.identify)
//          this.$socket.emit('client-send-identification',this.global.identify)
	    		this.$emit('closeKf',this.global.kfNow)
	    	},
        setDepartment: function (code) {
          store.setClientStoreHouseCode({params: code})
            .then(data => {
              console.info('set store')
            }, response => {
              console.info('fail')
            })
        },
	    	modalKfClose:function(){
	    		this.$emit('othercloseKf')
	    	}
	    },
	}
</script>
