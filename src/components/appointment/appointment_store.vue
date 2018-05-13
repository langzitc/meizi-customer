<template>
  <div class="common-wrap">
      <div id="locgdmap" style="display:none"></div>        
      <store-list :data="storeList"></store-list>   
      <msg v-if="storeList.length === 0" icon="waiting" title="暂无门店"></msg>  
  </div>
</template>

<script>
import util from '../../until'
import { Panel,Msg } from 'vux'
import StoreList from '../common/store-list'
export default {
    name: 'appointment_store',     
    data () {
        return {     
        }
    },
    computed: {
        storeList () {
            return this.$store.state.common.storeList;
        }
    },
    mounted () {
        util.useMap().then(res=>{
            let map, geolocation;
            map = new AMap.Map('locgdmap', {
                resizeEnable: true
            });
            map.plugin('AMap.CitySearch',()=>{
                let citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity((status, result)=>{
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            this.$store.commit('updateCity',result);
                            this.$store.dispatch('getStoreList');
                        }
                    }
                }); 
            });    
        })
    },
    components: {
        StoreList,
        Msg
    }    
}
</script>

<style>

</style>
