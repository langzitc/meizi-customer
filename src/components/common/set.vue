<template>
    <div class="common-wrap">
        <div class="avatar-upload">
            <x-img default-src="../../../static/avatar2.png" :offset="0" :src="avatar" alt="" @click.native="showMenu = true"></x-img>
            <!-- <actionsheet v-model="showMenu" :menus="cameraMenu" @on-click-menu="menuClick" show-cancel></actionsheet> -->
            <input type="file" id="avatar" @change="onUpload" accept="image/*" class="avatar" capture='camera'>
        </div>
        <group :gutter="0">
            <cell title="昵称" is-link link="/main/set_name" :value="name"></cell>
            <cell title="绑定手机" :value="mobile"></cell>
        </group>
        <div class="common-foot-tab">
            <x-button class="btn-ghost" :show-loading="loading" @click.native="loginout">退出登录</x-button>
        </div>
    </div>
</template>

<script>
import { Group, Cell, XButton, XImg } from 'vux';
import { mapState, mapActions } from 'vuex'
export default {
    name: 'set',
    data () {
        return {
            loading: false
        }
    },
    computed: {
        ...mapState({
            mobile: state => state.common.member.mobile,
            name: state => state.common.member.name,
            avatar: state => state.common.member.avatar_url
        })         
    },
    methods: {
        // menuClick (key) {
        //     this.showMenu = false;
        //     if(key === 2){
        //         document.getElementById('avatar').onClick();
        //     }
        // },
        onUpload (e) {
            let file = e.target.files[0];
            if (file&&!/image\/\w+/.test(file.type)) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择图片'
                }) 
                return false;
            }
            // 通过canvas压缩图片
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });              
            var reader = new FileReader();
            reader.readAsDataURL(file);
            var img = new Image;
            reader.onload = (e)=> {
                var width = 1080, //图像大小
                    quality = 0.8, //图像质量
                    canvas = document.createElement("canvas"),
                    drawer = canvas.getContext("2d");
                img.src = this.result;
                img.onload = function () {
                    canvas.width = width;
                    canvas.height = width * (img.height / img.width);
                    drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
                    img.src = canvas.toDataURL("image/png", quality);
                }
            }
            setTimeout(()=> {
                let param = new FormData();
                param.append('file', file);
                this.$http.post('/shop/member/upload',param).then(res=>{
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                      
                    if (res.code == 200) {
                        let path = res.data.file.path;
                        this.$store.dispatch('updateAccount',{
                            avatar: path
                        });
                    }else{
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.message
                        })                         
                    }                  
                }).catch(e=>{                    
                    this.$vux.alert.show({
                        title: '提示',
                        content: '上传失败'
                    })                                      
                    throw new Error(e);
                });
            }, 1000);            
        },
        loginout () {
            this.loading = true;
            this.$store.dispatch('loginOut').then(()=>{
                this.loading = false;
            }).catch(e=>{
                throw new Error(e);
                this.$vux.alert.show({
                    title: '提示',
                    content: '退出失败'
                }) 
                this.loading = false;                  
            });
        }
    },
    mounted () {
       
    },
    components: {
        Group,
        Cell,
        XButton,
        XImg
    }
}
</script>

<style lang="less">
    .avatar-upload{
        background-color: #fff;
        height: 140px;
        box-sizing: border-box;
        text-align: center;
        position: relative;
        img{
            height: 80px;
            width: 80px;
            margin-top: 30px;
            border-radius: 50%;
        }
        .avatar{
            opacity: 1;
            position: absolute;
            left: 0;
            height: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
</style>
