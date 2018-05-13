<template>
  <div class="common-wrap">
      <div class="jmb-box">
          <div v-for="(item,index) in data" :key="index">
                <p class="jmb-title"><micon style="vertical-align:middle;margin-right:20px" name="service" scale="4"></micon>{{item.name}}</p>
                <x-table :content-bordered="false" :cell-bordered="false">
                    <thead>
                        <tr class="text-muted">
                            <th style="text-align:left;" class="text-elips">项目</th>
                            <th style="text-align:left">原价</th>
                            <th style="text-align:right">现价</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(el,index2) in item.items" :key="index2">
                            <td style="text-align:left">{{el.name}}</td>
                            <td style="text-align:left" v-if="!el.advanced_prices.length">￥{{el.origin_price | money}}</td>
                            <td style="text-align:right" v-if="!el.advanced_prices.length">￥{{el.price | money}}</td>
                            <td v-if="el.advanced_prices.length" colspan="3">
                                <flexbox v-for="(el2,index3) in el.advanced_prices" :key="index3">
                                    <flexbox-item :span="1/2">
                                        {{el2[el2.keys]}}
                                    </flexbox-item>
                                    <flexbox-item :span="1/2" style="text-align:right;margin-left:0">
                                        ￥{{el2.price | money}}
                                    </flexbox-item>                                    
                                </flexbox>    
                            </td>
                        </tr>               
                    </tbody>
                </x-table>               
          </div>
      </div>
      <foot></foot>
  </div>
</template>

<script>
import { XTable, Flexbox, FlexboxItem } from 'vux'
export default {
    name: 'zxs-jmb',
    data () {
        return {
            data: []
        }
    },
    components: {
        XTable,
        Flexbox,
        FlexboxItem
    },
    mounted () {
        let query = this.$route.query;
        if(query.employee_id){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            }); 
            this.$http.post('/shop/service/serviceList',{employee_id: query.employee_id,type_code:'service'}).then(res=>{
                let d = res.data.items;
                d.forEach(element => {
                    element.items.forEach(element2 => {
                        let code = element2.price_attributes_detail.map(e=>{
                            return e.code;
                        });
                        element2.advanced_prices.forEach(element3 => {
                            code.forEach(e2=>{
                                if(element3.attributes[e2]){
                                    element3.keys = e2;
                                    element3[e2] = element3.attributes[e2].label;
                                }
                            })
                        })
                    })   
                });
                this.data = d;
                console.log(d);
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
    }
}
</script>

<style lang="less">
    .jmb-box{
        width: 100%;
        padding: 20px 15px;
        box-sizing: border-box;
        background-color: #fff;
    }
    .jmb-title{
        font-size: 20px;
        margin: 20px 0;
    }
</style>
