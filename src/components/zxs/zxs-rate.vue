<template>
    <div class="common-wrap">
        <div style="background:#fff">
            <group :gutter="0" v-for="(item,index) in data" :key="index">
                    <cell-box>
                        <div>
                            <p class="gkpj-p" style="margin-top: 15px;font-size:14px;">
                                <span class="gkpj-label">综合评分</span>
                                <rater :value="5" :font-size="14"></rater>
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
            </group>   
            <msg icon="info" title="还没有评价" v-if="data.length===0"></msg>          
        </div>
    </div>
</template>

<script>
import { Rater, Group, CellBox, Flexbox, FlexboxItem, Msg } from 'vux'
export default {
    name: 'zxs-rate',
    data () {
        return {
            data: [],
            params: {
                page: 1,
                page_size: 10                
            }
        }
    },
    components: {
        Rater,
        Group,
        CellBox,
        Flexbox,
        FlexboxItem,
        Msg
    },
    methods: {
        getList () {
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });      
            let params = JSON.parse(JSON.stringify(this.params));       
            this.$http.post('/shop/review/list',params).then(res=>{
                this.data = res.data.items;
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
        let query = this.$route.query;
        if(query.employee_id){
            this.params.employee_id = query.employee_id;
            this.getList();
        }else{
            this.$router.go(-1);
        }
    }
}
</script>

<style>

</style>
