<template>
  <div class="foot-tab-box">
        <div class="foot-tab-left">
            <div class="foot-tab-left-title">预约时间</div>
            <div class="foot-tab-left-con zdy-time">{{times}}</div>
        </div>
        <div class="foot-tab-right">
            <x-button type="primary" @click.native="sure">确定</x-button>
        </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
export default {
    name: 'foot-tab',     
    data () {
        return {

        }
    },
    props: {
        times: {
            type: String,
            default: '请选择'
        }
    },
    components: {
        XButton
    },
    methods: {
        sure () {
            if(this.times !== '请选择'){
                this.$emit('on-change',this.times);
            }else{
                this.$emit('on-change',false);
            }   
        }
    }
}
</script>

<style scoped lang="less">
    @import '../../theme/variable.less';
    .foot-tab-box{
        background-color: #fff;
        box-sizing: border-box;
        padding: 15px;
        width: 100%;
        margin-top: 15px;
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        justify-content: space-between;
        .foot-tab-right{
            text-align: right;
            width: 100px;
        }
    }
</style>
