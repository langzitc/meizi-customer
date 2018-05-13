import axios  from 'axios';
export default {
    state: {
        order: {
            store_id: '',
            order_type: 0,
            items: [{
                product_id: '',
                product_name: '',
                origin_price: '',
                price: '',
                attributes: [],
                employees: []
            }],
            is_appointment: true,
            appointment_start_at: '',
            appointment_from: 1,
            description: '',
            payment_methods: []            
        },
        zaoxinshi: {},
        store: {},
        czkk: {},
        actual_order: {},
        give_amount: 0
    },
    mutations: {
        updateOrder (state, payload) {
            Object.assign(state.order,payload);
            for(let k in payload){
                if(Array.isArray(payload[k])){
                    state.order[k] = payload[k];
                }
            }
        },
        setZaoxinshi (state, zaoxinshi) {
            Object.assign(state.zaoxinshi,zaoxinshi);
        },
        setStore (state, store) {
            Object.assign(state.store,store);
        },
        setZaoxinshi (state, zaoxinshi) {
            Object.assign(state.zaoxinshi,zaoxinshi);
        },
        setCzkk (state, order) {
            Object.assign(state.czkk, order);
        },
        setActualOrder (state, order) {
            Object.assign(state.actual_order, order);
        },
        useGiveAmount (state, value) {
            state.give_amount = value;
        }                        
    },
    actions: {
        updateOrder (context, payload) {
            return new Promise((resolve,reject)=>{
                context.commit('updateOrder',payload);
                localStorage.setItem(context.getters.prefix+'-order',JSON.stringify(context.state.order));
                resolve();                
            })
        },
        submitOrder (context) {
            return new Promise((resolve,reject)=>{
                let params = JSON.parse(JSON.stringify(context.state.order));
                params.appointment_start_at = params.appointment_start_at+":00";
                axios.post('/shop/checkout/placeOrder',params).then(res=>{
                    if(res.code == 200){
                        context.commit('updateOrder',{
                            items: [{
                                product_id: '',
                                product_name: '',
                                origin_price: '',
                                price: '',
                                attributes: [],
                                employees: []
                            }]
                        })
                        resolve(res);                        
                    }else{
                        reject(res.message);
                    }
                }).catch(e=>{
                    reject('订单提交失败');
                });
            });
        }        
    }
}