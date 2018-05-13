export default {
    getData(key) {
        return localStorage.getItem(this.uniqueKey(key));
    },
    setData(key,value) {
        localStorage.setItem(this.uniqueKey(key), value);
    },
    uniqueKey(key) {
        return "CUSTOMER_" + key;
    },
    getJSONObject(key) {
        let data = this.getData(key);
        if(data && !data instanceof Object) {
            data = JSON.parse(data);
        }
    },
    getCustomer() {
        let memberSession = localStorage.getItem('mzmy_member_session');
        if(memberSession) {
            memberSession = JSON.parse(memberSession);
        } else {
            memberSession = {}
        }
        return memberSession;
    }
}