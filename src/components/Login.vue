<template>
    <div class="login-wrap">
        <div style="padding: 20px 30px">
            <div class="text-center logo-box">
                <img src="../../static/logo.png" class="logo-img">
            </div>
            <group class="tdskjb">
                <x-input ref="tel" v-model="mobile" name="mobile" :required="true" type="tel" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile">
                    <x-icon slot="label" style="margin-top: 9px;" type="android-phone-portrait" class="zdy-icon"></x-icon>
                </x-input>
            </group>   
            <group class="tsdkja">
                <x-input ref="password" v-model="password" name="code" :required="true" type="number" placeholder="请输入验证码" keyboard="number">
                    <x-icon slot="label"  style="margin-top: 5px;"  type="ios-locked" class="zdy-icon"></x-icon>
                    <span slot="right" v-if="!sendLoading&&!isSend" class="text-amount" @click="send">
                        {{text}}
                    </span>    
                    <span slot="right" v-if="sendLoading">
                        <inline-loading></inline-loading>
                    </span>    
                    <span slot="right" v-if="!sendLoading&&isSend" class="text-muted">
                        {{text}}
                    </span>                                                            
                </x-input>
            </group>                          
        </div>
        <div style="padding:10px 30px">
            <x-button @click.native="login" type="primary" style="border-radius:0;padding: 5px 0" :show-loading="isLogin">登录</x-button>
        </div>
        <div style="color:#777;text-align:center;padding-top:20px;font-size:14px">
            未注册手机号将自动注册为会员
        </div>
        <foot></foot>
    </div>
</template>

<script>
import { XInput, Group, XButton, Cell, XImg, InlineLoading } from 'vux'
export default {
    name: 'login',
    data () {
        return {
            isSend: false,
            isLogin: false,
            mobile: '',
            password: '',
            text: '获取验证码',
            sendLoading: false,
            isRandomCode:true
        }
    },
    mounted: function() {
        this.isRandomCode = false;
        if(1==2 && window.location.href.indexOf("shop.meizitop.com") != -1) {
            setTimeout(()=>{
                this.mobile = "15908149894";
                this.password = "15908149894";

                this.login();
            },300);
        }
    },
    methods: {
        send () {
            this.isRandomCode = true;
            if(this.mobile){
                if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile))){
                    this.$vux.alert.show({
                        title: '提示',
                        content: '手机号错误'
                    });
                    return;                    
                }                
            }else{
                this.$vux.alert.show({
                    title: '提示',
                    content: '请输入手机号'
                })
                return;  
            }
            if(!this.isSend){
                this.sendLoading = true;
                this.$http.post('/shop/member/sendLoginSms',{
                    mobile: this.mobile
                }).then(res=>{
                    let i = 60;
                    this.text = i+"s后重新获取";                    
                    this.sendLoading = false;
                    this.isSend = true;
                    let s = setInterval(()=>{
                        i--;
                        this.text = i+"s后重新获取";
                        if(i === 1){
                            this.isSend = false;
                            clearInterval(s);
                            this.text = "获取验证码";
                        }
                    },1000);
                });                
            }
        },
        login () {
            if(!this.mobile){
                this.$vux.alert.show({
                    title: '提示',
                    content: '手机号不能为空'
                })        
                return;           
            }
            if(!this.mobile){
                this.$vux.alert.show({
                    title: '提示',
                    content: '验证码不能为空'
                })        
                return;                   
            }
            if(this.$refs['tel'].valid&&this.$refs['password'].valid){
                this.isLogin = true;
                this.$http.post('/shop/member/login',{
                    mobile: this.mobile,
                    password: this.password,
                    is_random_code: this.isRandomCode
                }).then(res=>{

                    if(res.code === 200){
                        if(res.data.id) {
                            this.$store.commit('updateLoginStatus',true);
                        }
                        localStorage.setItem('mzmy_member_session',JSON.stringify(res.data));
                        this.$store.commit('updateMember');
                        this.$router.push({
                            name: 'home'
                        })
                    }else{
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.message
                        })                          
                    }
                    this.isLogin = false;                    
                }).catch(e=>{
                    console.log(e)
                    this.isLogin = false;
                    this.$vux.alert.show({
                        title: '提示',
                        content: '登录失败'
                    })                    
                });
            }else{
                this.$vux.alert.show({
                    title: '提示',
                    content: '请输入正确的手机号及验证码'
                })
            }
        }
    },
    components: {
        XInput,
        Group,
        XButton,
        Cell,
        XImg,
        InlineLoading 
    }
}
</script>

<style lang="less">
    .logo-box{
        padding: 15px;
        .logo-img{
            width: 130px;
            height: 130px;
        }
    }
    .tsdkja{
        .weui-cell{
            padding: 8px 15px;
        }      
    }
    .tdskjb{
        .weui-cell{
            padding: 6px 15px;
        }  
    }      
</style>
