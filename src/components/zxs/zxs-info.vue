<template>
    <div class="common-wrap" style="position:relative;padding-bottom:100px">
        <view-box>
        <div class="zxs-info-wtop">
            <blur :height="300" :blur-amount=40 url="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg">
                <p class="zxs-info-per text-center"><img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg"></p>
                <p class="text-center" style="color:#fff;margin-top:20px">
                     {{data.name}}<span class="tag tag-primary">{{data.job_title_name}}</span>
                </p>
                <flexbox style="color:#fff;margin-top:30px">
                    <flexbox-item class="text-center">
                        <p style="font-size:1.2em">{{data.work_seniority}}</p>
                        <p style="font-size:0.8em;margin-top:5px">从业年限</p>
                    </flexbox-item>
                    <flexbox-item class="text-center">
                        <p style="font-size:1.2em">{{data.order_number}}</p>
                        <p style="font-size:0.8em;margin-top:5px">订单量</p>                    
                    </flexbox-item>
                    <flexbox-item class="text-center">
                        <p style="font-size:1.2em">{{data.works_number}}</p>
                        <p style="font-size:0.8em;margin-top:5px">作品</p>                    
                    </flexbox-item>
                </flexbox>                
            </blur>              
        </div>
        <div class="zxs-info-wbottom">
            <group>
                <cell is-link :link="{name:'zxs_introduce',query:{id:employee_id}}">
                    <h3 slot="title">造型师介绍</h3>
                    <span class="text-amount">全部介绍</span>
                </cell>
                <cell-box>
                    <p class="text-muted" style="font-size:0.8em;text-indent:2em;">
                        {{data.description}}
                    </p>
                </cell-box>
                <cell is-link :link="{name: 'zxs_jmb',query: {employee_id}}">
                    <h3 slot="title">服务项目</h3>
                    <span class="text-amount">查看价目表</span>
                </cell>     
                <cell v-for="(item,index) in formatFwxmList" :key="index" style="font-size:0.8em">
                    <span slot="title">
                        {{item.name}}
                    </span>
                    <span slot="default">
                        ￥{{item.origin_price | money}}&nbsp;￥{{item.price | money}}
                    </span>
                </cell>  
            </group>
            <group>
                <cell isLink link="store_map" style="font-size:0.8em">
                    <span slot="title" class="text-elips">{{full_address}}</span>
                    <span slot="icon" style="margin-right:15px">
                        <micon name="location" scale="2" class="text-bottom"></micon>  
                    </span>
                </cell>  
                <cell style="font-size:0.8em" isLink @click.native="tel('tel:'+service_tel)">
                    <span slot="title" class="text-elips">{{service_tel}}</span>
                    <span slot="icon" style="margin-right:20px">
                        <micon name="tel" scale="1.5" class="text-bottom"></micon>  
                    </span>
                </cell>                  
            </group>
            <group v-if="pjList.length === 0" title="顾客评价">
                <divider>暂无评价</divider>
            </group>
            <group v-for="(item,index) in pjList" :key="index">
                <cell-box>
                    <div>
                        <h3>顾客评价</h3>
                        <p class="gkpj-p" style="margin-top: 15px;font-size:14px;">
                            <span class="gkpj-label">综合评分</span>
                            <rater :value="rate" :font-size="14"></rater>
                        </p>
                        <p class="gkpj-p">
                            <span class="gkpj-label">专业技能</span>
                            <span class="gkpj-score">5.0</span>
                            <span class="text-muted">高于平均水平100%</span>
                        </p>
                        <p class="gkpj-p">
                            <span class="gkpj-label">服务态度</span>
                            <span class="gkpj-score">5.0</span>
                            <span class="text-muted">高于平均水平100%</span>
                        </p>
                        <p class="gkpj-p">
                            <span class="gkpj-label">洗发体验</span>
                            <span class="gkpj-score">5.0</span>
                            <span class="text-muted">高于平均水平100%</span>
                        </p>                                                                        
                    </div>
                </cell-box>   
                <cell-box @click.native="goRate">
                    <div class="guke-box">
                        <img class="guke-avatar circle" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg" alt="">
                        <flexbox>
                            <flexbox-item>
                                <p style="line-height:30px">顾客姓名</p>
                                <p style="line-height:30px" class="text-muted">2018-02-01</p>
                            </flexbox-item>
                            <flexbox-item class="text-right">
                                <rater :value="5" :font-size="14"></rater>
                            </flexbox-item>
                        </flexbox>                                            
                    </div>
                </cell-box>              
                <div class="text-muted" style="font-size:0.8em;width:100%;padding: 15px;box-sizing: border-box;">
                    时间卡的哈萨克等哈看书就打瞌睡                        
                </div>    
                <div class="zuopin-box">
                    <img class="zuopin" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg" alt="">
                    <img class="zuopin" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg" alt="">
                    <img class="zuopin" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=629930144,1308499944&fm=27&gp=0.jpg" alt="">
                </div>       
                <div class="text-center" style="margin:15px 0">
                    <x-button :link="{name: 'zxs_rate',query:{employee_id: employee_id}}" style="width:50%">查看全部评价</x-button>
                </div>                                              
            </group>
            <group title="TA的作品" v-if="employee_id">
                <div style="height:100%" @click="goWorks" v-if="employee_id">
                    <works-list :employee_id="employee_id" :no_loading="true"></works-list>
                </div>
            </group>     
            <foot></foot>         
        </div>
        <x-icon type="ios-arrow-left" @click.native="back" class="backBtn" size="26"></x-icon>            
        </view-box>
        <div class="common-foot-tab">
            <x-button type="primary" @click.native="selectZxs">选择造型师</x-button>
        </div>        
    </div>
</template>

<script>
import { Blur, Flexbox, FlexboxItem, Cell, CellBox, Group, Rater, XButton, ViewBox, Divider } from 'vux'
import DefaultAvatar from '../../../static/avatar2.png'
import WorksList from '../works/works_list'
export default {
    name: 'zxs-info',
    data () {
        return {
            data: {},
            fwxmList: [],
            employee_id: '',
            pjList: []
        }
    },
    computed: {
        rate () {
            return parseInt(this.data.overall_rating)||5;
        },
        full_address () {
            return this.data.store ? this.data.store.full_address : '';
        },
        service_tel () {
            return this.data.store ? this.data.store.service_tel : '';
        },
        formatFwxmList () {
            let arr = [];
            this.fwxmList.forEach(e=>{
                e.items.forEach(e2=>{
                    arr.push(e2);
                })
            })
            return arr;
        }        
    },
    methods: {
        loaderror (e) {
            e.target.src = DefaultAvatar;
        },
        tel () {
            window.location.href = 'tel:'+this.service_tel;
        },
        back () {
            this.$router.go(-1);
        },
        goRate () {
            this.$router.push({
                name: 'zxs_rate'
            });
        },
        selectZxs () {
            this.$store.commit('setZaoxinshi',this.data);      
            localStorage.setItem(this.$store.getters.prefix+"-zaoxinshi",JSON.stringify(this.data));      
            this.$router.push({
                name: 'appointment_fwxm'
            });            
        },
        goWorks () {
            this.$router.push({
                name: 'works_list'
            })
        }
    },
    components: {
        Blur,
        Flexbox,
        FlexboxItem,
        Cell,
        CellBox,
        Group,
        Rater,
        XButton,
        WorksList,
        ViewBox,
        Divider
    },
    mounted () {
        let query = this.$route.query;
        if(!query.id){
            this.$router.go(-1);
        }else{
            this.employee_id = query.id;
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });             
            this.$http.post('/public/batchRequest',[{
                path: '/shop/employee/info',
                data: {
                    id: query.id                      
                },
                key: 'zxsinfo'                
            },{
                path: '/shop/service/serviceList',
                data: {
                    type_code: 'service',
                    employee_id: query.id                      
                },
                key: 'zxsfwxm'                  
            },{
                path: '/shop/review/list',
                data: {
                    employee_id: query.id
                },
                key: 'zxspj'
            }]).then(res=>{
                res.data.forEach(e=>{
                    if(e.key === 'zxsinfo'){
                        this.data = e.data.data;
                    }else if(e.key === 'zxsfwxm'){
                        this.fwxmList = e.data.data.items;
                    }else{
                        this.pjList = e.data.data.items;
                    }
                })
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            })          
        }
    }
}
</script>

<style lang="less">
    .zxs-info-wtop{
        height: 300px;
    }
    .zxs-info-per{
        margin-top: 60px;
        img{
            width: 100px;
            height: 100px;
            border-radius: 50%;  
            border: 2px solid #fff;      
        }
    }    
    .backBtn{
        position: absolute;
        fill: #fff;
        top: 15px;
        left: 15px;
    }
</style>
