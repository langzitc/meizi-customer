<template>
  <div class="common-wrap">
      <div class="works-info-wrap">
        <group :gutter="0">
                <flexbox :gutter="0">
                    <flexbox-item :span="1/5" class="winfo-img"> 
                        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                    </flexbox-item>   
                    <flexbox-item :span="3/5" class="zxs-select-right">
                        <p>
                            {{data.employee_name}}<span class="tag tag-primary">{{data.employee_job_title_label}}</span>  
                        </p>                    
                        <p class="text-muted" style="font-size:12px;margin-top:5px">{{store.name}}</p>
                    </flexbox-item>      
                    <flexbox-item :span="1/5" class="text-right"> 
                        <x-button type="primary" mini @click.native="yuyue">预约</x-button>    
                    </flexbox-item>                                 
                </flexbox>    
        </group>  
        <div class="winfo-body">
            {{data.description}}
            <div class="tag-box">
                <span class="tag-item" v-if="data.tags" v-for="(item,index) in data.tags" :key="index">
                    #{{item.label}}
                </span>
            </div>
            <div v-if="data.images" v-for="(item,index) in data.images" class="text-center imgs-item" :key="index">
                <img :src="item.url" alt="">
            </div>
            <div class="text-muted works-hits">
                <x-icon type="ios-eye" style="fill:#ddd;vertical-align:bottom" size="26px"></x-icon>
                <span>{{data.hits}}次浏览</span>
            </div>                
        </div>  
        <group :title="data.employee_name+'的更多作品'" v-if="data.employee_id">
            <div style="height:100%">
                <works-list :no_loading="true" :employee_id="data.employee_id"></works-list>
            </div>
        </group>
      </div>
      <foot></foot>  
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Group, XButton } from 'vux'
import { mapState } from 'vuex'
import WorksList from './works_list'
export default {
    name: 'works-info',
    data () {
        return {
            data: {}
        }
    },
    mounted () {
        let query = this.$route.query;
        if(query.id){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            }); 
            this.$http.post('/shop/employeeWorks/info',{
                id: query.id,
                is_inc_hits: 1
            }).then(res=>{
                this.data = res.data;
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                }); 
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                 
            })            
        }else{
            this.$router.go(-1);
        }
    },
    computed: {
        ...mapState({
            store: state => state.appointment.store
        })
    },
    methods: {
        yuyue () {
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });                
            let id = this.data.id;
            this.$http.post('/shop/employee/info',{
                id
            }).then(res=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                }); 
                let items = this.$store.state.appointment.order.items;
                items[0].employees = [{
                    employee_id: res.data.id
                }];                
                this.$store.commit('setZaoxinshi',res.data);      
                localStorage.setItem(this.$store.getters.prefix+"-zaoxinshi",JSON.stringify(res.data));      
                this.$store.dispatch('updateOrder',{
                    items
                });
                this.$router.push({
                    name: 'appointment_time'
                });                                   
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                    
            })
        }
    },
    components: {
        Group,
        Flexbox,
        FlexboxItem,
        XButton,
        WorksList
    }
}
</script>

<style lang="less">
    .works-info-wrap{
        padding: 15px;
        background: #fff;
        box-sizing: border-box;
    }
    .winfo-img{
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;       
            margin-top: 5px;     
        }
    }
    .winfo-body{
        padding: 15px 0;
        box-sizing: border-box;
    }
    .tag-box{
        padding: 15px 0;
        box-sizing: border-box;
    }
    .tag-item{
        color: #2db7f5;
        margin-right: 15px;
    }   
    .imgs-item{
        margin-bottom: 15px;
        img{
            width: 100%;
        }
    }
    .works-hits{
        height: 24px;
        line-height: 24px;
    }    
</style>
