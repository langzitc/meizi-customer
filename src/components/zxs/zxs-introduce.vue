<template>
  <div class="common-wrap">
      <msg v-if="!data.description" icon="info" title="TA很懒，什么都没写"></msg>
      <div v-if="data.description">
          {data.description}
      </div>
      <foot></foot>  
  </div>
</template>

<script>
import { Msg } from 'vux'
export default {
    name: 'zxs-introduce',
    data () {
        return {
            data: {

            }      
        }
    },
    components: {
        Msg
    },
    mounted () {
        let query = this.$route.query;
        if(query.id){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });             
            this.$http.post('/shop/employee/info',{
                id: query.id
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
    }
}
</script>

<style>

</style>
