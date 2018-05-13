<template>
    <div class="common-wrap">
        <div id="map-container" class="map-container"></div> 
        <div class="map-bottom">
            <flexbox>
                <flexbox-item>
                    <span class="map-title">{{store.name}}</span>
                </flexbox-item>
                <flexbox-item class="text-right">
                    <x-button @click.native="router" type="primary" mini><x-icon type="arrow-graph-down-right" size="20" class="map-bottom-btn"></x-icon>到这去</x-button>
                </flexbox-item>
            </flexbox>
            <flexbox style="margin-top:10px">
                <flexbox-item>
                    <p class="text-muted">{{store.address}}</p>
                </flexbox-item>
            </flexbox>            
        </div>
        <foot></foot>  
    </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from 'vux'
import until from '../../until'
import { mapState } from 'vuex'
let map;
export default {
    name: 'store-map',
    data () {
        return {
            
        }
    },
    computed: {
        ...mapState({
            store: state => state.appointment.store
        })
    },
    methods: {
        router () {
            let infowindow;
            let infoWindowContent = `<div class="infowindow-content">
            <div class="amap-info-header">${this.store.name}</div>
            <div class="amap-info-body">${this.store.address}</div></div>`;
            map.plugin('AMap.AdvancedInfoWindow',()=>{
                infowindow = new AMap.AdvancedInfoWindow({
                    panel: 'panel',
                    placeSearch: true,
                    asOrigin: true,
                    asDestination: true,
                    content: infoWindowContent
                });
                infowindow.open(map, this.store.geo_location.split(','));
            });            
        }
    },
    components: {
        Flexbox,
        FlexboxItem,
        XButton
    },
    mounted () {
        let g = this.store.geo_location.split(',');
        until.useMap().then(res=>{
            let geolocation;
            map = new AMap.Map('map-container', {
                resizeEnable: true,
                zoom: 13,
                center: g
            }); 
            let infoWindow = new AMap.InfoWindow({
                content: `<h3>${this.store.name}</h3><p>${this.store.address}</p>`,
                offset: new AMap.Pixel(0, -20)
            });           
            let marker = new AMap.Marker({
                position: g,
                title: this.store.name,
                map
            });
            infoWindow.open(map, g);
        })          
    }
}
</script>

<style lang="less">
    .map-container{
        width: 100%;
        height: 100%;
        background-color:#fff;
        box-sizing: border-box;
    }
    .map-bottom{
        position: absolute;
        height: 150px;
        bottom: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        padding: 15px;
    }
    .map-bottom-btn{
        fill: #fff;
        vertical-align: middle;
        margin-right: 5px;
    }
    .map-title{
        font-size: 1.2em;
    }
    .amap-info-header{
        padding: 5px  15px;
        text-align: center;
        font-size: 16px;
    }
    .amap-info-body{
        padding: 15px;
    }
</style>
