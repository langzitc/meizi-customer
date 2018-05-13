<template>
    <div class="drop-modal-mask" v-bind:class="modalState ? 'show-mask' : 'hide-mask'" @click.prevent="handleClick">
        <div style="padding: 15px;background:#fff">
            <flexbox>
                <flexbox-item class="drop-modal-item" v-for="(el,index) in tagList" :key="index" v-bind:class="index === activeValue ? 'active' : ''">
                    <x-button @click.native="dropModalClick(index)" class="drop-modal-btn">{{el.label}}
                        <x-icon v-show="activeValue !== index" class="drop-icon" size="1.2em" type="android-arrow-dropdown"></x-icon>
                        <x-icon v-show="activeValue === index" class="drop-icon" size="1.2em" type="android-arrow-dropup"></x-icon>
                    </x-button>
                </flexbox-item>                                 
            </flexbox>
            <div class="drop-check-box" v-if="modalState">
                <div class="drop-check-item" v-if="tagList[activeValue]&&tagList[activeValue].children.length" v-for="(el,index) in tagList[activeValue].children" :key="index">
                    <div class="check-item-text">
                        {{el.label}}
                    </div>
                    <div class="check-item-icon">
                        <check-icon :value.sync="el.checked" @click.native="handleCheck(el,tagList[activeValue])"></check-icon>
                    </div>
                </div>
            </div>
            <flexbox style="margin-top:20px" v-if="modalState">
                <flexbox-item>
                    <x-button class="fl-btn-l" @click.native="clearAll">清空</x-button>
                </flexbox-item>
                <flexbox-item style="margin-left:0;">
                    <x-button style="background:#000;color:#fff;" class="fl-btn-r" @click.native="sure">确认</x-button>
                </flexbox-item>                
            </flexbox>
        </div>        
    </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, CheckIcon } from 'vux'
export default {
    name: 'drop-modal',
    props: {
        tagList: {
            type: Array,
            default: ()=>{
                return [];
            }
        }
    },
    data () {
        return {
            activeValue: 0,
            modalState: false
        }
    },
    methods: {
        dropModalClick (index) {
            this.activeValue = index;
            this.modalState = true;
        },
        handleCheck (el,data) {
            if(el.checked){
                if(data.children){
                    data.children.forEach(e=>{
                        if(e.value!==el.value){
                            e.checked = false;
                        }
                    })
                }
            }
        },
        handleClick (e) {
            if(e.target.className.includes('drop-modal-mask')){
                this.modalState = false;
            };
        },
        clearAll () {
            this.tagList.forEach(e=>{
                if(e.children){
                    e.children.forEach(e2=>{
                        e2.checked = false;
                    })
                }
            })
        },
        sure () {
            let arr = [];
            this.tagList.forEach(e=>{
                if(e.children){
                    e.children.forEach(e2=>{
                        if(e2.checked){
                            arr.push({
                                type: e.type,
                                value: e2.value
                            });
                        }
                    })
                }
            })
            this.$emit('on-change',arr);
            this.modalState = false;
        }
    },
    components: {
        XButton,
        Flexbox,
        FlexboxItem,
        CheckIcon
    }
}
</script>

<style lang="less">
    .show-mask{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        z-index: 9999;
    }
    .hide-mask{
        
    }
    .drop-modal-item{
        padding: 2px;
        box-sizing: border-box;
        .weui-btn{
            height: 30px;
            line-height: 30px;
        }
        .drop-modal-btn{
            font-size: 0.8em;
            .drop-icon{
                vertical-align: text-bottom;
                margin-left: 5px;
            }
        }
    }
    .weui-btn.fl-btn-l{
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }
    .weui-btn.fl-btn-r{
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }    
    .drop-check-box{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 90%;
        margin: 20px auto;
    }
    .drop-check-item{
        width: 45%;
        display: flex;
        flex-wrap: no-wrap;
        justify-content: space-around;
        margin: 10px 0;
    }
    .check-item-text{
        width: 50%;
    }
    .check-item-icon{
        text-align: right;
        width: 50%;
        .weui-icon-success-circle{
            color: rgb(139, 27, 68);
            font-size: 18px;
        }
        .weui-icon-success{
            color: rgb(139, 27, 68);
            font-size: 18px;
        }   
        .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
            color: rgb(139, 27, 68);
            font-size: 18px;
        }  
        .weui-icon-circle{
            font-size: 18px;
        }          
    }
    .active{
        button{
            color: #891E47;
        }
        .drop-icon{
            fill: #891E47;
        }
    }
</style>
