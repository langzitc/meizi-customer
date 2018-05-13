<template>
    <div class="common-wrap">
        <group :gutter="0">
            <cell>
                <div slot="icon" class="circle-img" style="margin-right:15px">
                    <img src="../../../static/avatar.png" alt="">                    
                </div>
                <div slot="title">
                    <p> {{name}} <span class="tag tag-primary">{{job_title_name}}</span></p>
                    <p class="text-muted" style="font-size:0.8em">{{storeName}}</p>
                </div>
            </cell>               
            <cell-box v-for="item in rateItem" :key="item.id">
                <div class="rate-item">
                    <span class="rate-label">{{item.title}}</span>
                    <rater :max="5.0" v-model="item.rate" :font-size="16"></rater>
                </div>
            </cell-box>  
            <cell-box>
                <x-textarea v-model="params.content" :max="100" :height="100" :placeholder="placeholder" show-counter style="width:100%"></x-textarea>
            </cell-box>    
            <cell-box>
                <upload ref="uploads" :max="9"></upload>
            </cell-box>   
            <cell-box>
                <x-button type="primary" :show-loading="loading" @click.native="submit" >发布</x-button>
            </cell-box>             
        </group>
        <foot></foot>  
    </div>
</template>

<script>
import { Group, CellBox, Cell, Rater, XTextarea, XButton} from 'vux'
import { mapState } from 'vuex'
import Upload from '../common/upload'
export default {
    name: 'order-talk',
    data () {
        return {
            placeholder: '造型师满足您的期望吗？说说他的优点和美中不足的地方吧。长度在100字以内',
            loading: false,
            data: {},
            rateItem: [],
            name: '',
            job_title_name: '',
            params: {
                type: 0,
                order_id: '',
                items: [],
                rate: 0,
                content: '',
                images: [],
                employee_id: ''
            }
        }
    },
    computed: {
        storeName () {
            let s = '';
            if(this.store.id){
                s = this.store.name;
            }
            return s;
        },
        ...mapState({
            store: state => state.appointment.store
        })
    },
    methods: {
        submit () {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.params));
            let items = this.rateItem.map(e=>{
                return {
                    id: e.id,
                    rate: e.rate
                }
            });
            params.items = items;
            let images = this.$refs['uploads'].uploadList.map(e=>{
                return e.path;
            });
            params.images = images;
            this.$http.post('/shop/review/create',params).then(res=>{
                console.log(res)
                if(res.code === 200){
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.message,
                        onHide: ()=>{
                            this.$router.push({
                                name: 'order_talk_success',
                                query: {
                                    coupon_id: res.data.coupon ? res.data.coupon.id : 0
                                }
                            })
                        }
                    })                      
                }else{
                    this.$vux.alert.show({
                        title: '提示',
                        content: res.message
                    })                     
                }
                this.loading = false;               
            }).catch(e=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: '评价失败'
                })                 
            })
        }
    },
    mounted () {
        let query = this.$route.query;
        if(query.id){  
            this.params.order_id = query.id;
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });                 
            Promise.all([
                this.$http.post('/shop/customer/order/info',{
                    order_id: query.id
                }),
                this.$http.post('/shop/review/itemList')             
            ]).then(data=>{
                this.data = data[0].data;
                if(data[0].data.order_type != 0&&data[0].data.order_type != 1){
                    this.$router.go(-1);                    
                    return false;
                }
                let employee_id = data[0].data.items[0].employees[0].employee_id;
                this.params.employee_id = employee_id;
                this.$http.post('/shop/employee/info',{
                    id: employee_id
                }).then(res=>{
                    this.name = res.data.name;
                    this.job_title_name = res.data.job_title_name;
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    }); 
                }).catch(e=>{
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                     
                })
                let item = data[1].data;
                item.forEach(e=>{
                    e.rate = 0;
                })
                this.rateItem = item;  
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                   
            });
        }else{
            this.$router.go(-1);
        }
    },
    components: {
        Group,
        CellBox,
        Cell,
        Rater,
        XTextarea,
        XButton,
        Upload
    }
}
</script>

<style lang="less">
    .rate-label{
        display: inline-block;
        width: 80px;
    }
</style>
