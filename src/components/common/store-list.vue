<template>
    <div class="store-list-wrap">
        <div class="store-list-h" v-if="showHeader">
            <slot name="header"></slot>
        </div>
        <div class="store-list-box" v-if="!isSingle">
            <div class="store-list-item" v-for="(el,index) in data" :key="index">
                    <div class="store-list-img">
                        <img :src="el.logo_url" @error="loaderror"/>
                    </div>
                    <div class="store-list-body">
                        <div class="store-list-body-head">
                            <div class="store-list-head-title elips">{{el.name}}</div>
                            <div class="store-list-head-l text-amount">{{el.distance}}km</div>
                        </div>
                        <div class="store-list-body-foot">
                            <div class="store-list-body-foot-l">
                                <p class="text-elips" style="width:160px"><x-icon type="ios-location" size="18" style="margin-right:5px;vertical-align:text-bottom;fill: #777"></x-icon>{{el.address}}</p>
                            </div>
                            <div class="store-list-body-foot-r text-right">
                                <x-button type="primary" style="background-color:#891E47" mini @click.native="selectStore(el)">选择</x-button>
                            </div>
                        </div>
                    </div>
            </div>            
        </div>
        <div class="store-list-box" v-if="isSingle">
            <div class="store-list-item">
                    <div class="store-list-img">
                        <img :src="selectStores.logo_url" @error="loaderror"/>
                    </div>
                    <div class="store-list-body single">
                        <div class="store-list-body-head">
                            <div class="store-list-head-title elips">{{selectStores.name}}</div>
                        </div>
                        <div class="store-list-body-foot">
                            <div class="store-list-body-foot-l">
                                <p class="text-elips" style="font-size:12px;width:140px">
                                <x-icon type="ios-location" size="18" style="margin-right:5px;vertical-align:text-bottom;fill: #777"></x-icon>
                                {{selectStores.address}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="store-list-rt" @click="goStore">
                            <div class="s-ico">
                                <img src="../../../static/s-c.png" style="width: 30px;height:30px">
                            </div>
                            <div>切换门店</div>                     
                    </div>
            </div>            
        </div>        
        <div class="store-list-f" v-if="showFooter">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import { XButton} from 'vux'
import DefaultImg from '../../../static/s-c.png'
export default {
    name: 'store-list',
    data () {
        return {}
    },
    props: {
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        showHeader: {
            type: Boolean,
            default: false
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        isSingle: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        selectStores () {
            return this.$store.state.appointment.store;
        }
    },
    methods: {
        selectStore (el) {
            this.$store.dispatch('updateOrder',{
                store_id: el.id
            });
            this.$store.commit('setStore',el);
            localStorage.setItem(this.$store.getters.prefix+"-store",JSON.stringify(el));
            this.$router.push({
                path: '/main/appointment_time'
            });
        },
        loaderror (e){
            e.target.src = DefaultImg;
        },
        goStore () {
            this.$router.push({
                name: 'appointment_store'
            });
        }
    },
    components: {
        XButton
    }
}
</script>

<style lang="less">
    .store-list-box{
        background-color: #fff;
    }
    .store-list-item{
        padding: 15px;
        box-sizing: border-box;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;
        height: 100px;
        width: 100%;
        padding-left: 120px;
        position: relative;
        .store-list-img{
            position: absolute;
            width: 70px;
            height: 70px;
            text-align: center;
            vertical-align: middle;
            left: 15px;
            top: 24px;
            img{
                width: 60px;
                height: 60px;
            }
        }
        .store-list-body{
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            &.single{
                padding-right: 100px;
            }  
            .store-list-body-head{
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                height: 35px;
                line-height: 35px;
            }   
            .store-list-body-foot{
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                .store-list-body-foot-r{
                    width: 100px;
                }  
                height: 35px;
                line-height: 35px;                              
            }       
        }
        .store-list-rt{
            width: 70px;
            height: 70px;
            border-left: 1px solid #ddd;
            text-align: center;
            position: absolute;
            right: 15px;
            top: 15px;
            .s-ico{
                margin-top: 15px;
            }
            font-size: 12px;
        }
    }
</style>
