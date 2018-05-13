import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/main',
            component: function (resolve) {
                require(['../components/Main'], resolve)
            },
            children: [{
                path: '',
                redirect: {
                    path: 'appointment_time'
                }
            },{
                path: 'home',
                name: 'home',
                meta: {
                    title: '预约'
                },
                component: function (resolve) {
                    require(['../components/Home'], resolve)
                }                
            },{
                path: 'appointment_store',
                name: 'appointment_store',
                meta: {
                    title: '选择门店'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_store'], resolve)
                }                
            },{
                path: 'appointment_time',
                name: 'appointment_time',
                meta: {
                    title: '选择到店时间'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_time'], resolve)
                }
            },{
                path: 'appointment_zxs',
                name: 'appointment_zxs',
                meta: {
                    title: '选择造型师'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_zxs'], resolve)
                }                
            },{
                path: 'appointment_fwxm',
                name: 'appointment_fwxm',
                meta: {
                    title: '选择服务项目'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_fwxm'], resolve)
                }                   
            },{
                path: 'appointment_confirm',
                name: 'appointment_confirm',
                meta: {
                    title: '确认订单'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_confirm'], resolve)
                }                   
            },{
                path: 'appointment_pay',
                name: 'appointment_pay',
                meta: {
                    title: '支付'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_pay'], resolve)
                }                   
            },{
                path: 'appointment_paysuccess',
                name: 'appointment_paysuccess',
                meta: {
                    title: '支付成功'
                },
                component: function (resolve) {
                    require(['../components/appointment/appointment_paysuccess'], resolve)
                }                   
            },{
                path: 'select_quan',
                name: 'select_quan',
                meta: {
                    title: '选择奖金券'
                },
                component: function (resolve) {
                    require(['../components/common/select-quan'],resolve);
                }
            },{
                path: 'zxs_info',
                name: 'zxs_info',
                meta: {
                    hidetitle: true
                },
                component: function (resolve) {
                    require(['../components/zxs/zxs-info'],resolve);
                }
            },{
                path: 'zxs_introduce',
                name: 'zxs_introduce',
                meta: {
                    title: '造型师介绍'
                },
                component: function (resolve) {
                    require(['../components/zxs/zxs-introduce'],resolve);
                }
            },{
                path: 'zxs_rate',
                name: 'zxs_rate',
                meta: {
                    title: '全部评价'
                },
                component: function (resolve) {
                    require(['../components/zxs/zxs-rate'],resolve);
                }
            },{
                path: 'zxs_jmb',
                name: 'zxs_jmb',
                meta: {
                    title: '价目表'
                },
                component: function (resolve) {
                    require(['../components/zxs/zxs-jmb'],resolve);
                }
            },{
                path: 'store_map',
                name: 'store_map',
                meta: {
                    title: '门店地图'
                },
                component: function (resolve) {
                    require(['../components/common/store-map'],resolve);
                }
            },{
                path: 'order_list',
                name: 'order_list',
                meta: {
                    title: '我的订单'
                },
                component: function (resolve) {
                    require(['../components/order/order-list'],resolve);
                }
            },{
                path: 'order_tklc',
                name: 'order_tklc',
                meta: {
                    title: '退款流程'
                },
                component: function (resolve) {
                    require(['../components/order/order-tklc'],resolve);
                }
            },{
                path: 'order_talk',
                name: 'order_talk',
                meta: {
                    title: '发表评价'
                },
                component: function (resolve) {
                    require(['../components/order/order-talk'],resolve);
                }
            },{
                path: 'order_talk_success',
                name: 'order_talk_success',
                meta: {
                    title: '评价成功'
                },
                component: function (resolve) {
                    require(['../components/order/order-talk-success'],resolve);
                }
            },{
                path: 'order_info',
                name: 'order_info',
                meta: {
                    title: '订单详情'
                },
                component: function (resolve) {
                    require(['../components/order/order-info'],resolve);
                }
            },{
                path: 'member_card',
                name: 'member_card',
                meta: {
                    title: '会员卡'
                },
                component: function (resolve) {
                    require(['../components/member/member-card.vue'],resolve);
                }
            },{
                path: 'member_card_kkcz',
                name: 'member_card_kkcz',
                meta: {
                    title: '充值开卡'
                },
                component: function (resolve) {
                    require(['../components/member/member-card-kkcz'],resolve);
                }
            },{
                path: 'member_card_ordersure',
                name: 'member_card_ordersure',
                meta: {
                    title: '确认订单'
                },
                component: function (resolve) {
                    require(['../components/member/member-card-ordersure'],resolve);
                }
            },{
                path: 'member_card_orderinfo',
                name: 'member_card_orderinfo',
                meta: {
                    title: '订单详情'
                },
                component: function (resolve) {
                    require(['../components/member/member-card-orderinfo'],resolve);
                }
            },{
                path: 'member_card_accountinfo',
                name: 'member_card_accountinfo',
                meta: {
                    title: '账单明细'
                },
                component: function (resolve) {
                    require(['../components/member/member-card-accountinfo'],resolve);
                }
            },{
                path: 'quan',
                name: 'quan',
                meta: {
                    title: '我的奖金券'
                },
                component: function (resolve) {
                    require(['../components/common/quan'],resolve);
                }
            },{
                path: 'set',
                name: 'set',
                meta: {
                    title: '设置'
                },
                component: function (resolve) {
                    require(['../components/common/set'],resolve);
                }
            },{
                path: 'set_name',
                name: 'set_name',
                meta: {
                    title: '修改昵称'
                },
                component: function (resolve) {
                    require(['../components/common/set-name'],resolve);
                }
            },{
                path: 'works_list',
                name: 'works_list',
                meta: {
                    title: '作品'
                },
                component: function (resolve) {
                    require(['../components/works/works_list'],resolve);
                }
            },{
                path: 'works_info',
                name: 'works_info',
                meta: {
                    title: '作品详情'
                },
                component: function (resolve) {
                    require(['../components/works/works_info'],resolve);
                }
            },{
                path: 'select_zsj',
                name: 'select_zsj',
                meta: {
                    title: '使用赠送金'
                },
                component: function (resolve) {
                    require(['../components/common/select_zsj'],resolve);
                }
            }]
        },
        {
            path: '/login',
            name: 'login',
            component: function (resolve) {
                require(['../components/Login'], resolve)
            }
        },
        {
            path: '/',
            redirect: {
                path: '/login'
            }
        }             
    ]
})