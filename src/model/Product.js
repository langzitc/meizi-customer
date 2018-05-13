import BeautyProductEntity from "./entity/BeautyProductEntity";

export default class Product extends BeautyProductEntity {

    constructor() {
        super();
        this.setData("advanced_prices",[]);
    }

    get advanced_prices () {return this.getData("advanced_prices");}
    set advanced_prices(v) { return this.setData("advanced_prices",v);}

    parseJSONObject($object) {
        let fields = this.FIELDS();
        for(let fieldName in $object) {
            if(fields[fieldName]) {
                this.setData(fieldName, $object[fieldName]);
            } else {
                this[fieldName] = $object[fieldName];
            }
        }

        return this;
    }

    /**
     * 最低价格
     */
    getMinPrice() {
        let minPrice = 0;
        if(this.advanced_prices && this.advanced_prices.length > 0) {
            this.advanced_prices.map((advPrice)=>{
                let price = parseFloat(advPrice.price);
                if(minPrice == 0 ) {
                    minPrice = price;
                } else if(minPrice > price) {
                    minPrice = price;
                }
            });
        } else {
            let price = parseFloat(this.price);
            if(minPrice == 0 ) {
                minPrice = price;
            } else if(minPrice > price) {
                minPrice = price;
            }
        }
        return minPrice.toFixed(2);
    }

    /**
     * 最高价格
     */
    getMaxPrice() {
        let maxPrice = 0;
        if(this.advanced_prices && this.advanced_prices.length > 0) {
            this.advanced_prices.map((advPrice)=>{
                let price = parseFloat(advPrice.price);
                if(maxPrice == 0 ) {
                    maxPrice = price;
                } else if(maxPrice < price) {
                    maxPrice = price;
                }
            });
        } else {
            let price = parseFloat(this.price);
            if(maxPrice == 0 ) {
                maxPrice = price;
            } else if(maxPrice < price) {
                maxPrice = price;
            }
        }
        return maxPrice.toFixed(2);
    }
}