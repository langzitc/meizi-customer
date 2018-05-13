<template>
    <div class="common-wrap">
        <group>
            <x-input v-model="nickName" is-type="china-name" required placeholder="输入昵称"></x-input>
        </group>
        <x-button style="margin-top:40px" :show-loading="loading" type="primary" @click.native="save">保存</x-button>
    </div>
</template>

<script>
import { Group, XInput, XButton } from 'vux'
export default {
    name: 'set-name',
    data () {
        return {
            loading: false,
            nickName: ''
        }
    },
    methods: {
        save () {
            this.loading = true;
            this.$store.dispatch('updateAccount',{
                name: this.nickName
            }).then(name=>{
                this.nickName = name;
                this.loading = false;
                this.$router.go(-1);
            }).catch(e=>{
                this.loading = false;
            });
        }
    },
    mounted () {
        this.nickName = this.$store.state.common.member.name;
    },
    components: {
        Group,
        XInput,
        XButton
    }
}
</script>

<style>

</style>
