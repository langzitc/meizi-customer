<template>
  <div class="date-tab-box">
      <div class="date-tab-wrap">
          <div class="date-tab-scroll">
            <div>
                <swiper :aspect-ratio="300/800" v-model="swiperIndex">
                    <swiper-item class="swiper-demo-img" v-for="(item,index) in formatDlist()" :key="index">
                        <tab :line-width=2 active-color='#fc378c' v-model="dateIndex"> 
                            <tab-item class="vux-center"  v-for="(item2, index2) in item" :key="index2" style="background:none">
                                <p class="time-1">{{item2.wtitle}}</p>
                                <p class="time-2">{{item2.dtitle}}</p>
                            </tab-item>
                        </tab>                    
                    </swiper-item>
                </swiper>                
            </div>
          </div>
          <div class="date-tab-calendar">
              <div @click="showPopup = true">
                <micon name="calendar" :scale="4" style="margin-top:5px"></micon>          
              </div>
            <div v-transfer-dom>
            <popup v-model="showPopup">
                <popup-header
                left-text="取消"
                right-text="确定"
                title="请选择日期"
                :show-bottom-border="false"
                @on-click-left="showPopup = false"
                @on-click-right="sure">
                </popup-header>                
                <datetime-view v-model="selectDate"></datetime-view>
            </popup>
            </div>
          </div>
      </div>      
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { TransferDom, Popup, DatetimeView, PopupHeader, Tab, TabItem, Swiper, SwiperItem,dateFormat } from 'vux'
function formatWeek (day) {
    if(dateFormat(day,"YYYY-MM-DD") === dateFormat(new Date(),'YYYY-MM-DD')){
        return '今天';
    }
    let week = day.getDay();
    switch (week) {
        case 0: 
        return '周日';
        break;
        case 1: 
        return '周一';
        break;
        case 2: 
        return '周二';
        break;
        case 3: 
        return '周三';
        break;
        case 4: 
        return '周四';
        break;
        case 5: 
        return '周五';
        break;
        case 6: 
        return '周六';
        break;
    }
}
function getDayList (date) {
    let index = 0,arr=[];
    let sindex = 0;
    while(index<30){
        date.setDate(date.getDate()+sindex);
        arr.push({
            wtitle: formatWeek(date),
            dtitle: dateFormat(date,'MM-DD'),
            value: dateFormat(date,'YYYY-MM-DD')
        });
        index++;
        sindex = 1;
    }
    return arr;
}
export default {
    name: 'date-tab',
    directives: {
        TransferDom
    },      
    data () {
        return {
            showPopup: false,
            selectDate: '',
            dateIndex: 0,
            dlist: getDayList(new Date()),
            swiperIndex: 0,
            isInit: false
        }    
    },
    watch: {
        dateIndex (n,o){
            if(!this.isInit){
                this.setDate();
            }
        },
        swiperIndex (n,o) {
            if(!this.isInit){
                this.dateIndex = 0;    
                this.setDate();               
            }
        }
    },
    computed: {
        appointment_start_at () {
            return this.$store.state.appointment.order.appointment_start_at;
        }        
    },
    methods: {
        formatDlist () {
            let arr = [];
            let si = 0;
            let ei = 5;
            while(this.dlist[si]){
                let a = this.dlist.slice(si,ei);
                arr.push(a);
                si+=5;
                ei+=5;
            }
            return arr;
        },
        setDate () {
            let obj = this.formatDlist()[this.swiperIndex][this.dateIndex];
            this.$emit('on-change',obj.value);
        },
        indexInit () {
            this.isInit = true;
            let value = dateFormat(new Date(this.appointment_start_at),'YYYY-MM-DD');
            this.formatDlist().forEach((e,i)=>{
                let flag = false;
                e.forEach((e2,i2)=>{
                    if(e2.value === value){
                        flag = true;
                        this.dateIndex = i2;
                    }
                })
                if(flag){
                    this.swiperIndex = i;
                }
            });
            this.setDate();
            this.isInit = false;
        },
        sure () {
            let date = new Date(dateFormat(new Date(),'YYYY/MM/DD')+" 00:00:00");
            date.setDate(date.getDate()+29);
            let t1 = date.getTime();
            let t2 = (new Date(this.selectDate.replace(/-/g,"/")+" 00:00:00")).getTime(); 
            if(t2>t1){
                this.$vux.alert.show({
                    title: '提示',
                    content: '最多提前30天预约'
                })     
            }else{
                this.showPopup = false;
                let list = this.formatDlist();
                list.forEach((e,i)=>{
                    e.forEach((e2,i2)=>{
                        if(e2.value === this.selectDate){
                            this.dateIndex = i2;
                            this.swiperIndex = i;
                        }
                    })
                })
                this.$emit('on-change',this.selectDate);
            }
        }
    },
    components: {
        TransferDom,
        DatetimeView,
        Popup,
        PopupHeader,
        Tab,
        TabItem,
        Swiper,
        SwiperItem
    },
    mounted () {     
        if(this.appointment_start_at){
            setTimeout(()=>{
                this.indexInit();
            },200)
        }else{
            this.setDate();
        }
    }
}
</script>

<style scoped lang="less">
    .date-tab-box{
        background-color: #fff;
        padding: 3px 15px;
        border-bottom: 1px solid #ddd;
    }
    .date-tab-wrap{
        position: relative;
        box-sizing: border-box;
        height: 46px;
        overflow: hidden;
        width: 100%;
        padding-right: 70px;
        .date-tab-calendar{
            position: absolute;
            right: 0;
            top: 0;
            height: 46px;
            width: 70px;
            border-left: 1px solid #ddd;
            text-align: center;
            i{
                font-size: 24px;
            }
            z-index: 2;
            background: #fff;
        }
        .date-tab-scroll{
            width: 100%;
            box-sizing: border-box;
            position: relative;
            height: 46px;
            z-index: 1;
        }
    }
    .time-1{
        font-size: 12px;
        height: 20px;
        line-height: 20px;
    }
    .time-2{
        font-size: 12px;
        height: 20px;
        line-height: 20px;        
    }
</style>
