<template>
  <div>
    <goods-header></goods-header>
    <goods-bread>
      <span>Goods</span>
    </goods-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" v-on:click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterby}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" v-on:click="setPriceFilter('all')">All</a></dd>
              <dd v-for="(item,index) in priceList">
                <a href="javascript:void(0)" v-on:click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+ item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="static/loading-svg/loading-spinning-bubbles.svg" v-show="loading"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <goods-modal v-bind:mdShow="mdShow">
      <p slot="message">
        请先登录，否则无法加入到购物车中！
      </p>
      <div slot="btnGroup">
        <a href="" class="btn btn--m">关闭</a>
      </div>
    </goods-modal>
    <goods-footer></goods-footer>
  </div>
</template>

<script>
  import '@/assets/css/base.css'
  import '@/assets/css/product.css'
  import '@/assets/css/checkout.css'

  import GoodsHeader from '@/components/Header'
  import GoodsFooter from '@/components/Footer'
  import GoodsBread from '@/components/Bread'
  import GoodsModal from '@/components/Modal'
  import axios from 'axios'

  export default {
    name: 'goods-list',
    data () {
      return {
        goodsList: [],
        priceList: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all',
        filterby: false,
        overlayFlag: false,
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false
      }
    },
    mounted() {
     this.getGoodsList();
    },
    components: {
      GoodsHeader, GoodsFooter, GoodsBread, GoodsModal
    },
    methods: {
      showFilterPop () {
        this.filterby = true;
        this.overlayFlag = true;
      },
      closePop () {
        this.filterby = false;
        this.overlayFlag = false;
      },
      setPriceFilter (index) {
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
        this.closePop()
      },
      getGoodsList(flag) {
        var params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        };
        this.loading = true;
        axios.get("/goods", {
          params
        }).then((res)=>{
          let data = res.data;
          if (data.status == '0'){
            if (flag) {
              this.goodsList = this.goodsList.concat(data.result.list);
              if (data.result.count < this.pageSize) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = data.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        });
        this.loading = false;
      },
      sortGoods () {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore () {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      addCart (productId) {
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          let data = res.data;
          if (data.status == 0)
          {
            alert("加入成功");
          }else {
            this.mdShow = true;
          }
        })
      }
    }
  }
</script>
