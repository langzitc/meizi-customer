
import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import appointment from './appointment'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        common,
        appointment
    }
})