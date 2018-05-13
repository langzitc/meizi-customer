<template>
    <div class="common-wrap">
        <div class="store-box-wrap text-center">
            <x-icon @click.native="selectStore" type="plus-circled" size="70" class="icon-primary"></x-icon>
            <p class="text-center">
                请选择服务门店
            </p>                  
        </div>
    </div>
</template>

<script>
export default {
    name: 'home',
    data () {
        return {

        }
    },
    methods: {
        selectStore () {
            this.$router.push({
                name: 'appointment_store'
            });
        }
    },
    mounted () {
        if(this.$store.state.appointment.store.id){
            this.$router.push({
                name: 'appointment_time'
            });
        }
    }
}
</script>

<style scoped lang="less">
    .store-box-wrap{
        margin-top: 100px;
    }
</style>
