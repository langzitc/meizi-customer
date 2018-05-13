<template>
  <div class="upload-box">
        <p>{{title}}&nbsp;&nbsp;<span class="text-muted" style="font-size:0.8em">(&nbsp;&nbsp;{{desc}}&nbsp;&nbsp;)</span></p>
        <div class="upload-img-box">
            <div class="upload-img-item" v-for="(el,index) in uploadList" :key="index">
                <img :src="el.full_url" alt="">
                <x-icon @click.native="delFile(index)" class="del-icon" type="minus-circled" size="25"></x-icon>
            </div>  
            <div class="upload-img-item">
                <div class="upload-img-btn">
                    <input @change="onUpload" v-if="!loading" type="file" capture='camera' ref="fileinput" accept="image/*" style="position:absolute;width:100%;height:60px;left:0;right:0;opacity:0">
                    <x-progress :percent="percent" :show-cancel="false" v-if="loading" style="margin-top:30px"></x-progress>
                    <div v-if="!loading">
                        <div style="margin-top:5px">
                            <x-icon type="camera" size="30"></x-icon>
                        </div>
                        <div style="font-size:0.8em">
                            {{btnText}}
                        </div>                          
                    </div>                              
                </div>
            </div>                                                                         
        </div>
  </div>
</template>

<script>
import { XProgress, cookie } from 'vux'
import { setInterval, clearInterval } from 'timers';
export default {
    name: 'upload',
    data () {
        return {
            loading: false,
            percent: 0,
            uploadList: []
        }
    },
    props: {
        max: {
            type: Number,
            default: 1
        },
        maxSize: {
            type: Number,
            default: 1024*5
        },
        title: {
            type: String,
            default: '添加图片'
        },
        btnText: {
            type: String,
            default: '点击添加'
        }
    },
    computed: {
        desc () {
            return `您最多可以上传${this.max}张图片`;
        }
    },
    methods: {
      onUpload: function (e) {
            if(this.uploadList.length>(this.max-1)){
                this.$vux.alert.show({
                    title: '提示',
                    content: `最多可以上传${this.max}张图片`
                })                 
                return false;
            }
            let file = e.target.files[0];
            if (!/image\/\w+/.test(file.type)) {
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择图片'
                }) 
                return false;
            }
            // 通过canvas压缩图片
            var reader = new FileReader();
            reader.readAsDataURL(file);
            var img = new Image;
            this.loading = true;
            let per = setInterval(()=>{
                if(this.percent<90){
                    this.percent+=1;
                }
            },200)
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
                    if (res.code == 200) {
                        this.uploadList.push(res.data.file)
                    }else{
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.message
                        })                         
                    }
                    this.percent = 100;
                    clearInterval(per);
                    this.loading = false;
                    this.percent = 0;                    
                }).catch(e=>{
                    this.$vux.alert.show({
                        title: '提示',
                        content: '上传失败'
                    })                     
                    clearInterval(per);
                    this.loading = false;  
                    this.percent = 0;                    
                    throw new Error(e);
                });
            }, 1000);
        },
        // base64转文件
        dataURItoBlob: function (dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },      
        delFile (index) {
            this.uploadList.splice(index,1);
        }
    },
    components: {
        XProgress
    }
}
</script>

<style lang="less">
    .upload-box{
        width: 100%;
    }
    .upload-img-box{
        padding: 15px 0;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .upload-img-item{
            width: 25%;
            height: 80px;
            text-align: center;
            position: relative;
            .upload-img-btn{
                border: 1px dashed #ddd;
                position: relative;
            }
            img{
                border: 1px solid #ddd;
            }
            .upload-img-btn,img{
                height: 80%;
                width: 80%;
                margin: auto;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;                
            }
            .del-icon{
                position: absolute;
                fill: #891E47;
                top: 0;
                right: 0;
            }
        }
    }
</style>
