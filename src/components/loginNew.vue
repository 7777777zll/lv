<template>
  <div class="about_kfChoose">
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="closeFunc"
      :close-on-press-escape="closeFunc"
      :show-close="closeIcon"
      width="30%"
      @close="modalClose"
      class="modal_kf modal_login">
      <div class="title_kf" v-if="this.global.isLoginer">用户登录</div>
      <div class="title_kf" v-if="!this.global.isLoginer">确认人登录</div>
      <ul class="kf_wrap">
        <li class="kf_cell">
          <div class="login_icon">
            <img src="../assets/username.png">
          </div>
          <input type="text" class="login_ipt username">
          <p class="userError login_error" v-show="checkUsername">{{userText}}</p>
        </li>

        <li class="kf_cell">
          <div class="login_icon">
            <img src="../assets/password.png">
          </div>
          <input type="password" class="login_ipt password">
          <p class="passwordError login_error" v-show="checkPassword">{{passwordText}}</p>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="kfConfirm">{{this.global.isLoginer?'确认登录':'确认'}}</el-button>
		  </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import { login } from '../config/api'
  export default {
    data () {
      return {
        nowKf:'',
        loginForm:{
          username:'',
          password:'',
          loginType:0,
        },
        userText:'',
        passwordText:'',
        checkUsername:false,
        checkPassword:false,
        successFlag:false,
        closeIcon:true,
        closeFunc:true,
        isShow:this.loginVisible,
      }
    },
    sockets:{

    },
    props: ['loginVisible'],
    mounted(){
        console.log(this.loginVisible)
        if(this.global.isLoginer){
          this.closeIcon=false
          this.closeFunc=false
        }
        else{
          this.closeIcon=true
          this.closeFunc=true
          this.loginForm.loginType=1
        }
    },
    methods: {
      kfConfirm:function(){
        var value1=document.getElementsByClassName('username')[0].value
        var value2=document.getElementsByClassName("password")[0].value
        this.userText=''
        this.passwordText=''
        if(value1==null||value1==''){
          this.checkUsername=true
          this.userText='请输入用户名!'
          return false
        }
        else if(value2==null||value2==''){
          this.checkPassword=true
          this.passwordText='请输入密码!'
          return false
        }
        else{
          this.loginForm.username=value1
          this.loginForm.password=value2
          this.login(this.loginForm)
        }
      },
      login:function(code){
        login.get({params:code})
          .then(data => {
            console.log(data)
            let isSuccess=Object.keys(data)
            if(isSuccess.length > 0){
              this.successFlag=true
              if(data.userName==null){
                data.userName=''
              }
              if(this.global.isLoginer){
                this.global.loginer=data.userName
              }
              this.$emit('closeLogin')
            }
            else{
              this.successFlag=false
              this.checkPassword=true
              this.passwordText='登录失败!'
            }
            this.connected = true;
          }, response => {
            console.info('fail')
          })
      },
      modalClose:function(){
        this.global.isLoginer=false
        this.$emit('closeOtherLogin')
      }
    },
  }
</script>
<style lang="scss">
  .main .modal_login .el-dialog__footer button{
    margin-top:30px;
    width:300px;
  }
  .login_ipt{
    width:100%;
    height:100%;
    border:0;
    padding:9px 40px;
    outline:none;
    color:#333;
    font-size:16px;
    display:block;
  }
  .login_icon{
    width:13px;
    height:15px;
    position:absolute;
    left:15px;
    top:0;
    img{
      width:100%;
    }
  }
  .modal_login .kf_wrap .kf_cell{
    width:300px;
    position:relative;
    margin:30px auto 0;
    padding:10px;
  }
  .login_error{
    font-size:13px;
    color:#F5222D;
    position:absolute;
    left:0;
    bottom:-36px;
  }
  // .modal_login .el-dialog__header .el-dialog__headerbtn{
  // 	display:none;
  // }
</style>
