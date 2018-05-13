<template>
    <div class="common-wrap" style="background-color: #fff">
        <drop-modal v-if="!employee_id" :tagList="tagList" @on-change="paramsChange"></drop-modal>
        <div v-if="no_loading">
                    <divider v-if="data.length === 0">暂无作品</divider>
                    <div class="works-item" v-for="(item,index) in data" :key="index" v-if="vertical === 'row'" @click="worksInfo(item)">
                        <div class="zxs-select">
                            <flexbox :gutter="15">
                                <flexbox-item :span="1/4" class="zxs-select-ava" style="height:100%"> 
                                    <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                                </flexbox-item>   
                                <flexbox-item :span="3/4" class="zxs-select-right">
                                    <p>
                                        {{item.employee_name}}<span class="tag tag-primary">{{item.employee_job_title_label}}</span>  
                                    </p>                    
                                    <p class="text-muted" style="font-size:12px;margin-top:5px">{{store.name}}</p>
                                </flexbox-item>                     
                            </flexbox>        
                        </div> 
                        <div class="works-img-list" v-bind:class="item.images&&item.images.length>1 ? 'many' : 'single'">
                            <img :src="img.url" v-for="(img,index) in item.images" :key="index">
                        </div>    
                        <div class="text-muted works-hits">
                            <x-icon type="ios-eye" style="fill:#ddd;vertical-align:bottom" size="26px"></x-icon>
                            <span>{{item.hits}}次浏览</span>
                        </div>    
                    </div>  
                    <div class="works2-wrap clearfix">
                        <div class="works-item2" v-for="(item,index) in data" :key="index" v-if="vertical === 'col'" @click="worksInfo(item)">
                            <div class="works-pic-top">
                                <img :src="item.images[0].url" alt="" v-if="item.images&&item.images.length">
                                <div class="works-pic-tip" v-show="item.images.length>1">
                                    <img src="../../../static/piclist.png" alt="">
                                </div>
                            </div>
                            <div class="works-pic-bottom">
                                <flexbox :gutter="20">
                                    <flexbox-item :span="1/4" class="zxs-select-ava2" style="height:100%"> 
                                        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                                    </flexbox-item>   
                                    <flexbox-item :span="3/4" class="zxs-select-right2">
                                        <div>
                                            {{item.employee_name}}  
                                        </div>                    
                                        <div class="text-muted works-hits">
                                            <x-icon type="ios-eye" style="fill:#ddd;vertical-align:bottom;" size="26px"></x-icon>
                                            <span>{{item.hits}}</span>
                                        </div>
                                    </flexbox-item>                     
                                </flexbox>                                   
                            </div>
                        </div>                         
                    </div>  
        </div>
        <div style="height:100%;overflow:hidden" v-else>
            <page-scroller
            ref="scroll"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="parseInt(startY)"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"             
             >
            <div slot>
                <div style="height:100%">
                    <divider v-if="data.length === 0">暂无作品</divider>
                    <div class="works-item" v-for="(item,index) in data" :key="index" v-if="vertical === 'row'" @click="worksInfo(item)">
                        <div class="zxs-select">
                            <flexbox :gutter="15">
                                <flexbox-item :span="1/4" class="zxs-select-ava" style="height:100%"> 
                                    <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                                </flexbox-item>   
                                <flexbox-item :span="3/4" class="zxs-select-right">
                                    <p>
                                        {{item.employee_name}}<span class="tag tag-primary">{{item.employee_job_title_label}}</span>  
                                    </p>                    
                                    <p class="text-muted" style="font-size:12px;margin-top:5px">{{store.name}}</p>
                                </flexbox-item>                     
                            </flexbox>        
                        </div> 
                        <div class="works-img-list" v-bind:class="item.images&&item.images.length>1 ? 'many' : 'single'">
                            <img :src="img.url" v-for="(img,index) in item.images" :key="index">
                        </div>    
                        <div class="text-muted works-hits">
                            <x-icon type="ios-eye" style="fill:#ddd;vertical-align:bottom" size="26px"></x-icon>
                            <span>{{item.hits}}次浏览</span>
                        </div>    
                    </div>  
                    <div class="works2-wrap clearfix">
                        <div class="works-item2" v-for="(item,index) in data" :key="index" v-if="vertical === 'col'" @click="worksInfo(item)">
                            <div class="works-pic-top">
                                <img :src="item.images[0].url" alt="" v-if="item.images&&item.images.length">
                                <div class="works-pic-tip" v-show="item.images.length>1">
                                    <img src="../../../static/piclist.png" alt="">
                                </div>
                            </div>
                            <div class="works-pic-bottom">
                                <flexbox :gutter="20">
                                    <flexbox-item :span="1/4" class="zxs-select-ava2" style="height:100%"> 
                                        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                                    </flexbox-item>   
                                    <flexbox-item :span="3/4" class="zxs-select-right2">
                                        <div>
                                            {{item.employee_name}}  
                                        </div>                    
                                        <div class="text-muted works-hits">
                                            <x-icon type="ios-eye" style="fill:#ddd;vertical-align:bottom;" size="26px"></x-icon>
                                            <span>{{item.hits}}</span>
                                        </div>
                                    </flexbox-item>                     
                                </flexbox>                                   
                            </div>
                        </div>                         
                    </div>               
                </div>
            </div>
            </page-scroller>               
        </div>                  
    </div>
</template>

<script>
import DropModal from '../common/drop-modal'
import { mapState } from 'vuex'
import { Flexbox, FlexboxItem, Divider } from 'vux'
import PageScroller from '../common/page-scroller'
let _this,isChange = false;
export default {
    name: 'works_list',
    data () {
        return {
            tagList: [],
            params: {
                page: 1,
                limit: 9,
                category_id: '',
                face_model_id: '',
                gender: '',
                tag_id: ''
            },
            scrollbar: true,
            scrollbarFade: true,
            pullDownRefresh: true,
            pullUpLoadMoreTxt: 'scrollComponent.defaultLoadTxtMore',
            pullUpLoadNoMoreTxt: 'scrollComponent.defaultLoadTxtNoMore',            
            pullDownRefreshThreshold: 90,
            pullDownRefreshStop: 40,
            pullUpLoad: true,
            pullUpLoadThreshold: 0,
            startY: 0,
            scrollToX: 0,
            scrollToY: -200,
            scrollToTime: 700,
            scrollToEasing: 'bounce',
            scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],            
            data: []          
        }
    },
    watch: {
        params: {
            deep: true,
            handler (){
                if(!isChange){
                    this.getList();
                }
            }
        },
        scrollbarObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        pullDownRefreshObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        pullUpLoadObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        startY() {
            this.rebuildScroll()
        }        
    },
    computed: {
        scrollbarObj: function () {
            return this.scrollbar ? {fade: this.scrollbarFade} : false
        },
        pullDownRefreshObj: function () {
            return this.pullDownRefresh ? {
            threshold: parseInt(this.pullDownRefreshThreshold),
            stop: parseInt(this.pullDownRefreshStop)
            } : false
        },
        pullUpLoadObj: function () {
            return this.pullUpLoad ? {
            threshold: parseInt(this.pullUpLoadThreshold),
            txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
            } : false
        },          
        ...mapState({
            store: state => state.appointment.store,
            vertical: state => state.common.vertical
        })
    },
    props: {
        employee_id: {
            type: String,
            default: ''
        },
        no_loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        paramsChange (categoryArr) {
            let g='',c='',f='',t='';
            categoryArr.forEach(e=>{
                switch(e.type){
                    case 'GENDER': 
                        g = e.value;
                    break;
                    case 'CATEGORY': 
                        c = e.value;
                    break;
                    case 'FACE_MODEL': 
                        f = e.value;
                    break;
                    case 'TAG': 
                        t = e.value;
                    break;
                }
            });
            isChange = true;
            this.params.category_id = c;
            this.params.gender = g;
            this.params.face_model_id = f;
            this.params.tag_id = t;
            this.params.page = 1;
            this.params.limit = 5;
            isChange = false;
            this.getList();
        },
        getList (scroll,refresh=false) {
            return new Promise((resolve,reject)=>{       
                let params = JSON.parse(JSON.stringify(this.params));
                for(let k in params){
                    if(!params[k]){
                        delete params[k];
                    }
                }      
                if(refresh){
                    params.page = 1;
                    params.limit = this.data.length;
                }else{
                    params.limit = 9;
                }
                this.$http.post('/shop/employeeWorks/list',params).then(res=>{
                    if(!scroll){
                        this.data = res.data.items;
                    }else{
                        this.data = this.data.concat(res.data.items);
                    }
                    resolve(res.data.items.length === 0);
                }).catch(e=>{ 
                    resolve();                
                })                
            })
        },
        scrollTo() {
            this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime, ease[this.scrollToEasing])
        },
        onPullingDown() {
            if(!isChange){
                isChange = true;
                this.getList(true,true).then(()=>{
                    this.$refs.scroll.forceUpdate();
                    isChange = false;
                }).catch(e=>{
                    isChange = false;
                })                
            }
        },
        onPullingUp() {
            // 加载数据
            if(!isChange){
                isChange = true;
                this.params.page++;
                this.getList(true).then((flag)=>{
                    if(flag){
                        this.params.page--;
                    }
                    this.$refs.scroll.forceUpdate();
                    isChange = false;
                }).catch(()=>{
                    isChange = false;
                })                
            }
        },
        rebuildScroll() {
            Vue.nextTick(() => {
            this.$refs.scroll.destroy()
            this.$refs.scroll.initScroll()
            })
        },
        worksInfo (item) {
            this.$router.push({
                name: 'works_info',
                query: {
                    id: item.id
                }
            })
        }        
    },
    mounted () {               
        _this = this;
        if(this.employee_id){
            this.$set(this.$data.params,'employee_id',this.employee_id);
        }
        this.getList();
        if(!this.no_loading){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });  
            this.$http.post('/shop/store/optionInfo').then(res=>{
                let d = res.data;
                let arr = d.map(e=>{
                    return {
                        value: e.id,
                        label: e.label,
                        type: e.code,
                        children: e.children.map(e2=>{
                            return {
                                value: e2.id,
                                label: e2.label,
                                checked: false
                            }
                        })
                    }
                })
                arr.push({
                    label: '性别',
                    value: '0',
                    type: 'GENDER',
                    children:[{
                        label: '男',
                        value: '1',
                        checked: false
                    },{
                        label: '女',
                        value: '2',
                        checked: false
                    }]
                });            
                this.tagList = arr;
                if(!this.no_loading){
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                 
                }              
            }).catch(e=>{
                if(!this.no_loading){
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                 
                }              
            })            
        }         
    },
    components: {
        DropModal,
        Flexbox,
        FlexboxItem,
        PageScroller,
        Divider
    }
}
</script>

<style lang="less">
    .zxs-select{
        height: 70px;
        box-sizing: border-box;
        background:#fff;
        .vux-flexbox{
            height: 100%;
        }
    }
    .zxs-select-ava{
        box-sizing: border-box;
        text-align: center;
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid #fdfdfd;
            margin-top:7px;
        }
    }
    .works-item{
        border-bottom: 1px solid #dfdfdf;
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
    }
    .works2-wrap{
        width: 100%;
        position: relative;
        padding: 15px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .works-item2{
        border: 1px solid #dfdfdf;
        width: 47%;
        position: relative;
        margin-bottom: 20px;
        height: 300px;
        &:nth-child(2){
            height: 260px;
            img{
                height: 200px;
            }
        }
        &:nth-child(2n+4){
            top: -40px;
        }
        img{
            width: 100%;
            height: 240px;
        }
        .works-pic-bottom{
            padding: 5px 15px;
            box-sizing: border-box;
            height: 60px;
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }
    }    
    .works-pic-top{
        position: relative;
        .works-pic-tip{
            position: absolute;
            width: 35px;
            height: 35px;
            top: 10px;
            right: 10px;
            border-radius: 50%;
            background-color: rgba(0,0,0,.3);
            text-align: center;          
            img{
                width: 20px;
                height: 20px;
                margin-top: 8px;
            }
        }
    }
    .works-hits{
        height: 24px;
        line-height: 24px;
    }
    .works-img-list{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        img{
            box-sizing: border-box;
            margin-bottom: 15px;
        }   
        &.many{
            img{
                width: 120px;
                height: 150px;                
            }
        }  
        &.single{
            img{
                width: 250px;
                height: 300px;                
            }
        }   
    }
</style>
