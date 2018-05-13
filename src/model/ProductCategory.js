import ProductCategoryEntity from "./entity/BeautyCategoryEntity";
import Product from "./Product";
import List from "./List";


export default class ProductCategory extends ProductCategoryEntity {

    constructor() {
        super();
        this.products = new List();
    }

    parseJSONObject($category) {
        this.id = $category.id;
        this.name = $category.name;
        $category.items.forEach(($item)=>{
            let product = new Product();
            product.parseJSONObject($item);
            this.products.add(product);
        });
        return this;
    }

    getMinPrice() {
        let minPrice = 0;
        this.products.map((product)=>{
            if(minPrice == 0 ) {
                minPrice = product.getMinPrice();
            } else if(product.getMinPrice() < minPrice){
                minPrice = product.getMinPrice();
            }
        });
        return minPrice;
    }

    getMaxPrice() {
        let maxPrice = 0;
        this.products.map((product)=>{
            if(maxPrice == 0 ) {
                maxPrice = product.getMaxPrice();
            } else if(product.getMaxPrice() > maxPrice){
                maxPrice = product.getMaxPrice();
            }
        });
        return maxPrice;
    }
}