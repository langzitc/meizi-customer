import axios  from 'axios';
export default {
    state: {
        isLoading: false,
		direction: 'forward',
		loginStatus: false,
		brandStoreInfo: {},//品牌
		member: {},
        route: {},
        path: '',
        deviceready: '',
		demoTop: '',
		title: '',
		showTitle: true,
		location: {
			city: '',
			bounds: {}
		},
		storeCity: [],
		city: {
			province: [],
			city: [],
			dist: []
		},
		storeList: [],
		memberInfo: {},
		couponList: [],
		avaliableCouponList: [],
		vertical: 'col',//列表形式 'col' 'row'
    },
    mutations: {
	    updateLoadingStatus (state, payload) {
	      state.isLoading = payload.isLoading
		},
		updateVartical (state, value) {
		  state.vertical = value;
		},
	    updateDirection (state, payload) {
	      state.direction = payload.direction
		},
		updateTitle (state, payload) {
			state.title = payload.title;
		},
		updateShowTitleStatus (state, status) {
			state.showTitle = status;
		},
		updateLoginStatus (state, status) {
			state.loginStatus = status;
		},
		updateCity (state, result) {
			Object.assign(state.location, result);
		},
		setCity (state, payload) {
			switch (payload.level){
				case 1: 
					state.city.province = payload.data;
				break;
				case 2: 
					state.city.city = payload.data;
				break;
				case 3: 
					state.city.dist = payload.data;
				break;
			}
		},
		clearCity (state, type) {
			switch (type) {
				case 1: 
					state.city = {
						province: [],
						city: [],
						dist: []							
					}
				break;
				case 2: 
					state.city.city = [];
					state.city.dist = [];
				break;
				case 3: 
					state.city.dist = [];
				break;
			}
		},
		setStoreList (state, list) {
			state.storeList = list;
		},
		setStoreCity (state, list) {
			state.storeCity = list;
		},
		updateMember (state) {
			let session = localStorage.getItem('mzmy_member_session');
			if(session){
				state.member = JSON.parse(session);
			}else{
				state.member = {};
			}
		},
		setMemberInfo (state, data) {
			state.memberInfo = data;
		},
		setCoupon (state, data) {
			state.couponList = data;
		},
		setAvaliableCouponList (state, data) {
			state.avaliableCouponList = data;
		},
		setBrandStoreInfo (state, data){
			Object.assign(state.brandStoreInfo,data);
		} 	
    },
	actions: {
			getCity ({commit}, params) {
				axios.get('/region/list',{params: {pid: params.pid}}).then(res=>{
					commit('setCity',{
						level: params.level,
						data: res.data
					});
				})
			},
			getStoreList ({commit,state}, params) {
				commit('updateLoadingStatus',{
					isLoading: true
				});
				let longitude,latitude;
				let d = state.location.rectangle.split(';');
				if(d.length){
					let c = d[0].split(',');
					if(c.length){
						longitude = c[0];
						latitude = c[1];
					}
				}
				axios.post('/shop/store/list',{
					longitude,
					latitude,
					...params
				}).then(res=>{
					commit('setStoreList',res.data);
					commit('updateLoadingStatus',{
						isLoading: false
					});					
				}).catch(e=>{
					commit('updateLoadingStatus',{
						isLoading: false
					});					
				})
			},
			getStoreCity ({commit}) {
				axios.get('/shop/store/cityList').then(res=>{
					commit('setStoreCity',res.data);
				})
			},
			loginOut ({commit}) {
				return new Promise((resolve,reject)=>{
					axios.post('/shop/member/logout').then(res=>{
						if(res.code == 200){
							localStorage.removeItem('mzmy_member_session');
							commit('updateMember',res.data);
							resolve();
						}else{
							reject(res.message);
						}
					}).catch(e=>{
						reject(e);
					})
				})
			},
			updateAccount ({commit,state}, params) {
				params.member_id = state.member.member_id;
				return new Promise((resolve,reject)=>{
					axios.post('/shop/customer/account/update',params).then(res=>{
						if(res.code == 200){
							localStorage.setItem('mzmy_member_session',JSON.stringify(res.data));
							commit('updateMember');
							resolve(res.data.name);
						}else{
							reject(res.message);
						}
					}).catch(e=>{
						reject(e);
					})
				})					
			},
			getMemberInfo ({commit,state}) {
				if(!state.memberInfo.id){
					axios.post('/shop/checkout/customerInfo').then(res=>{
						commit('setMemberInfo',res.data);
					})
				}
			},
			getCoupon ({commit, state},params = {}) {
				if(!state.couponList.length || 1==1){ //强制刷新，不然在不同条件下不会去取新的数据
					axios.post('/shop/customer/account/cashCouponList',params).then(res=>{
						if(Object.keys(params).length){
							commit('setCoupon',res.data);
							return;
						}
						commit('setAvaliableCouponList',res.data);
					})
				}
			},
			getBrandStoreInfo ({commit},force = false) {
				// if(!force){
				// 	let brandStore = localStorage.getItem('mzmy-brand-store');
				// 	if(brandStore){
				// 		commit('setBrandStoreInfo',JSON.parse(brandStore));
				// 		return;
				// 	}
				// }
				axios.post('/shop/store/brandStoreInfo').then(res=>{
					if(res.code === 200){
						commit('setBrandStoreInfo',res.data);
					}
				})
			}
	},
    getters: {
		isLogin  (state) {
			let flag = false;
			if(state.loginStatus&&state.member&&state.member.member_id){
				flag = true;
			}
			return flag;
		},
		prefix (state) {
			return 'mzmy'+state.member.mobile;
		}
	}
  }