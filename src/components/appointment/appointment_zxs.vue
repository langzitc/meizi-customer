<template>
    <div class="common-wrap" style="overflow-x:hidden">
        <flexbox :gutter="20" class="zxs-list" v-for="el in list" :key="el.id" v-if="isAllow(el.allow_appointment)">
            <flexbox-item :span="6/24" class="zxs-list-item" @click.native="zxsinfo(el.id)">
                <x-img default-src="../../../static/avatar2.png" alt=""></x-img>
            </flexbox-item>
            <flexbox-item :span="9/24" class="zxs-list-item" @click.native="zxsinfo(el.id)">
                <flexbox orient="vertical" class="zxs-child-box">
                    <flexbox-item class="cl-item" style="font-size:14px" @click.native="zxsInfo(el.id)">{{el.name}}<span class="tag">{{el.job_title_name}}</span></flexbox-item>
                    <flexbox-item class="cl-item">
                        <rater :value="rate(el.overall_rating)" :font-size="10"></rater>
                        <span class="text-muted2">已预约{{el.order_number}}次</span>
                    </flexbox-item>
                    <flexbox-item class="cl-item" style="font-size:12px"><span class="text-muted2">洗剪吹&nbsp;￥&nbsp;{{el.min_price | money}}</span></flexbox-item>
                    <flexbox-item class="cl-item"><span class="text-muted2 text-elips">擅长：{{el.description}}</span></flexbox-item>
                </flexbox>
            </flexbox-item>
            <flexbox-item :span="9/24" class="zxs-list-item">
                <flexbox orient="vertical" align-items="stretch" align-content="space-around" class="zxs-child-box">
                    <flexbox-item class="cl-item">
                        <span class="text-primary"><x-icon type="lock-combination" size="12"></x-icon>&nbsp;等待60分钟</span>
                    </flexbox-item>
                    <flexbox-item class="cl-item text-center">
                        <x-button v-if="isAllow(el.allow_appointment)" mini type="primary" style="padding: 0px 10px;margin-top:10px" @click.native="selectZxs(el)">选择</x-button>
                        <x-button v-if="!isAllow(el.allow_appointment)" mini type="default" disabled style="padding: 0px 10px;margin-top:10px">已满</x-button>
                    </flexbox-item>
                </flexbox>                
            </flexbox-item>            
        </flexbox>    
        <!-- <flexbox :gutter="20" class="zxs-list">
            <flexbox-item :span="5/24" class="zxs-list-item">
                <img src="../../../static/avatar2.png" alt="">
            </flexbox-item>
            <flexbox-item :span="11/24" class="zxs-list-item">
                <flexbox orient="vertical" class="zxs-child-box">
                    <flexbox-item class="cl-item" style="font-size:14px">造型师李牧<span class="tag">资深</span></flexbox-item>
                    <flexbox-item class="cl-item">
                        <rater :value="5" :font-size="10"></rater>
                        <span class="text-muted2">已预约200次</span>
                    </flexbox-item>
                    <flexbox-item class="cl-item" style="font-size:12px"><span class="text-muted2">洗剪吹&nbsp;￥&nbsp;68</span></flexbox-item>
                    <flexbox-item class="cl-item"><span class="text-muted2 text-elips">擅长：基础造型 染烫 可爱风</span></flexbox-item>
                </flexbox>
            </flexbox-item>
            <flexbox-item :span="8/24" class="zxs-list-item">
                <flexbox orient="vertical" align-items="stretch" align-content="space-around" class="zxs-child-box">
                    <flexbox-item class="cl-item">
                        <span class="text-primary"><x-icon type="lock-combination" size="12"></x-icon>&nbsp;等待60分钟</span>
                    </flexbox-item>
                    <flexbox-item class="cl-item text-center">
                        <x-button mini type="default" disabled style="padding: 0px 10px;margin-top:10px">已满</x-button>
                    </flexbox-item>
                </flexbox>                
            </flexbox-item>            
        </flexbox>                   -->
    </div>
</template>

<script>
import { Flexbox , FlexboxItem, Rater, XButton, XImg } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'appointment_zxs',
    data () {
        return {
            list: []
        }
    },
    computed: {
        ...mapState({
            store_id: state => state.appointment.order.store_id
        })
    },
    watch: {
        store_id (n,o) {
            if(n){
                this.getList();
            }
        }
    },
    methods: {
        isAllow (value) {
            return Boolean(parseInt(value));
        },
        zxsinfo (id) {
            this.$router.push({
                name: 'zxs_info',
                query: {
                    id
                }
            });
        },
        rate (value) {
            return parseInt(value);
        },
        zxsInfo (id) {
            this.$router.push({
                name: 'zxs_info',
                query: {
                    id
                }
            })
        },
        selectZxs (el) {
            this.$store.commit('setZaoxinshi',el);      
            localStorage.setItem(this.$store.getters.prefix+"-zaoxinshi",JSON.stringify(el));      
            this.$router.push({
                name: 'appointment_fwxm'
            });
        },
        getList () {
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });            
            this.$http.post('/shop/employee/list',{
                store_id: this.store_id
            }).then(res=>{
                this.list = res.data.items;
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            })
        }
    },
    mounted () {
        if(this.store_id){
            this.getList();
        }
    },
    components: {
        Flexbox,
        FlexboxItem,
        Rater,
        XButton,
        XImg
    }
}
</script>

<style lang="less">
    .zxs-list{
        height: 140px;
        background-color:#fff;
        box-sizing: border-box;
        padding: 20px 15px;
        & + &{
            border-top: 1px solid #ddd;
        }
        .zxs-list-item{
            overflow: hidden;
            height: 100%;
            text-align: center;
            img{
                width: 80px;
                height: 80px;
                margin-top: 8px;
            }
        }
        .cl-item{
            margin-top: 2px!important;
            font-size: 12px;
        }
        .zxs-child-box{
            height:100%;
            box-sizing: border-box;
            padding: 5px 0;
        }
    }
</style>
