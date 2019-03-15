<template>
  <div>
    <nav-header></nav-header>  <!--标签的使用，只能使用小写，不能使用大写，需要使用‘-’的形式来链接组件-->
    <nav-bread>
      <span>Goods</span>
      <!--<span slot="bread">bread</span>-->
      <!--<span slot="B">测试一下</span>-->
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            <!--添加一个点击时间，点击时运行sortGoods函数-->
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short">
              </use>
          </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop"><!--使用@click定义点击以后实现showFilterPop-->
            Filter by
          </a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <!--使用v-bind:动态绑定一个类，通过filterBy来设置样式class等于filterby-show-->
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <!--<a href="javascript:void(0)" @click="priceChecked='all'" v-bind:class="{'cur':priceChecked=='all'}">-->
                  <!--&lt;!&ndash;使用v-bind动态定义class:cur,当前字段priceChecked是否等于all，如果当前字段等于all,则定义为class=cur&ndash;&gt;-->
                  <!--&lt;!&ndash;使用v-bind动态绑定时，双引号 中的字符引用要用单引号引住&ndash;&gt;-->
                  <!--All-->
                <!--</a>-->
                <a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">
                  <!--使用v-bind动态定义class:cur,当前字段priceChecked是否等于all，如果当前字段等于all,则定义为class=cur-->
                  <!--使用v-bind动态绑定时，双引号 中的字符引用要用单引号引住-->
                  All
                </a>
              </dd>
              <dd v-for="(price,index) in priceFilter" >   <!--使用v-for遍历priceFilter,index为price的索引值-->
                <!--<a href="javascript:void(0)" @click="priceChecked=index" v-bind:class="{'cur':priceChecked==index}">-->
                  <!--&lt;!&ndash;点击click事件后,帮当前的索引赋值给priceChecked，通过index，赋值选中当前项,通过index实现菜单的切换&ndash;&gt;-->
                  <!--&lt;!&ndash;使用v-bind动态定义class:cur，当priceChecked字段等于当前索引index值时，class等于cur&ndash;&gt;-->
                  <!--{{price.startPrice}} - {{price.endPrice}}-->
                <!--</a>-->
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">
                  <!--点击click事件后,执行setPriceFilter方法,参数为index-->
                  <!--使用v-bind动态定义class:cur，当priceChecked字段等于当前索引index值时，class等于cur-->
                  {{price.startPrice}} - {{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <!--<div>goodsList：{{goodsList}}</div>-->
              <!--商品列表-->
              <ul>
                <li v-for="item in goodsList">  <!--用v-for遍历goodsList-->
                  <div class="pic">
                    <!--<a href="#"><img  v-bind:src="item.goods_front_image" alt=""></a>   &lt;!&ndash;用v-bind动态绑定src&ndash;&gt;-->
                    <a href="#"><img  v-lazy="item.goods_front_image" alt=""></a>
                    <!--用v-lazy实现图片懒加载，在图片显示出来之前，加载配置的赖加载图片-->
                  </div>
                  <div class="main">
                    <div class="name">{{item.name}}</div>
                    <div class="price">￥{{item.shop_price}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.id)">
                        <!--点击调用addCart函数,参数：传入商品的id-->
                        加入购物车
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <!--使用vue-infinite-scroll插件,动态加载商品-->
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled='busy' infinite-scroll-distance="30">
                <img src="./../assets/img/loading-spinning-bubbles.svg" v-show="loading">
                <!--通过v-show字段来控制图片是否显示-->
              </div>
            </div>
          </div>
          <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop">
            <!--遮罩层，通过v-show来控制显不显示，点击之后，执行函数closePop（关闭弹窗）-->
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
  <!--template中的html要通过一个更目录例如div，进行存放，否则会报错-->
</template>

<script>
  import './../assets/css/base.css'  // 导入css文件
  import './../assets/css/product.css'   // 导入css文件
  // import NavHeader from '@/components/NavHeader'  也可以用@代表src,在webpack.base.conf.js中resolve中的alias（别名）有配置
  import NavHeader from './../components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from  '@/components/NavBread'
  import axios from  'axios'  // 导入axios


  export default {
    name: 'GoodsLi',
    data(){
      return{
        goodsList:[],   //  定义一个goodsList数组
        priceFilter:[
          {
            startPrice:'0.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'2000.00'
          },
        ],   //定义价格过滤
        priceChecked:'all',   //定义选中字段
        filterBy:false,   //  使用filterBy字段来控制样式，默认为false
        overLayFlag:false,   //  定义一个遮罩字段，默认也是false
        sortFlag:true,  //  定义一个排序字段，默认为true
        page:1,   //定义页数字段
        pageSize:8,   //定义一页显示8个数据
        busy:true,  //  定义一个busy字段，默认为禁用，滚动会生效
        loading:true  //  定义一个loading字段，控制loading动画显示，默认为false，表示不显示
      }

    },
    components:{
        NavHeader,    //单独这样写，表示键和值是一样的NavHeader:NavHeader
        NavFooter,
        NavBread
      },
    mounted: function() {   // mounted是生命周期里一个初始化的方法
      // 组件里的data必须是一个函数，函数返回一个对象，不能直接是个对象：不允许组件之间状态进行共享
      // 所有说每个组件都是独立的,所以data必须是一个函数,函数返回一个对象
      this.getGoodsList();   //  在初始化的时候直接调用getGoodsList()函数
    },
    methods:{   //  methods 定义一个方法
      getGoodsList(flag){   //  定义getGoodsList()函数
        var a = this;   //  在js里用this的时候,要先把this赋值给一个变量，然后用这个变量代替this
        var param = {  //  定义一个参数
            page:a.page,  // 页数为当前页数
            // pageSize: a.pageSize,   //  页面个数为页面个数
            // sort:a.sortFlag?1:-1,  //  排序字段,如果是真，则赋值sort为1，否则为-1
            ordering:a.sortFlag?'shop_price':'-shop_price',  //  排序字段,如果是真，则赋值sort为shop_price，否则为-shop_price
            priceLevel:a.priceChecked  // 价格过滤字段，传递过去
        }
        a.loading = true;  // 接口请求前，进行loading，打开
        axios.get('/apis/goods/?format=json',{  //加参数
          params:param
        }).then(function (responseresult){
          a.loading = false;  // 接口请求完，把loading关上
          console.log(responseresult);
          var res = responseresult.data;   //  获取响应结果数据通过".data"
          console.log("res$$$$$$$$$$$$$$$$$$",res);
          console.log("this.goodsListDT",res.results);
          if(responseresult.status==200){  //  如果请求成功,加载数据
            //  通过小的判断来实现分页的功能
            if(flag){  //  如果标志为true，则数据累加
              a.goodsList = a.goodsList.concat(res.results);
              // concat()函数就是把数组给串联起来合并成一个全新的数组

              if(res.results.length <= 1){  //  判断返回的条数,如果为0条，
                // 如果条数小于一个页面规定的数量，说明是最后一页，说明没有数据，禁用滚动函数
                console.log("res.results.count:",res.results.length);
                a.busy = true;   //禁用滚动函数
              }else{  //  如果不是0条，就进行加载
                a.busy = false;  // 启用滚动函数，如果不设置为false，以后都不能滚动了
                                 //  设置busy为false,这样，下次再滚动，请求就能发出去
              }
            }else{
              a.goodsList = res.results;   //  将res中的result字段的内容给goodsList即可
              a.busy = false;  // 可以继续加载
            }
          }else{ //  如果失败，返回空数组
            a.goodsList = [];   //
          }

        });   //  通过该axios.get() 方法获取数据,通过.then的方式来进行链式调用,获取result
      },
      showFilterPop(){   //点击之后将价格弹出来
        //控制两个字段
        var a = this;
        a.filterBy=true;  //  将filterBy字段设置为true
        a.overLayFlag=true;   // 遮罩字段设置为true
      },
      closePop(){   //  点击遮罩，关闭弹框
        //控制两个字段
        var a = this;
        a.filterBy=false;  //  将filterBy字段设置为false
        a.overLayFlag=false;   // 遮罩字段设置为false
      },
      setPriceFilter(index){   // 设置价格选中样式
        var a = this;
        a.priceChecked=index;   //将索引值赋给priceChecked
        a.closePop();   //  关闭遮罩层
        a.page = 1;  //  页面设置为1
        a.getGoodsList();  //  重新获取一次接口请求
      },
      sortGoods(){   //  定义一个排序函数
        var a = this;
        a.sortFlag = !a.sortFlag;  //  取反
        a.page = 1;  //  页面设置为1
        a.getGoodsList();  //  重新获取一次接口请求
      },
      //  当鼠标滚动的时候，加载loadMore函数
      loadMore(){
        var a = this;
        a.busy = true  //  设置busy为true，禁用加载，使滚动加载失效
        setTimeout(()=>{
          a.page++;  // 滚动之后页面加1；
          a.getGoodsList(true);  //  调用getGoodsList()加载商品列表,给一个true，告诉它分页需要进行累加
          },1000);  //  使用setTimeout函数控制鼠标滚动加载，
        //  鼠标滚动很快，滚动1秒中可能有上千个请求发生，对服务器压力太大，必须要通过setTimeout来控制，
        //  只有第一个请求发送成功以后，再请求第二个；如果没有这个方法，滚动，滚动，会发现请求会无止境的加载；
        //  一旦通过setTimeout来控制，滚动的时候就会发一个请求，直到第二个请求请求成功以后，才会去发送第三个请求，
        //  这样的话，比较合理
        //  1000表示1秒，500表示0.5秒，稍微快一点
      },
      addCart(productId){
        // let param = new URLSearchParams();
        // param.append("nums", 1);
        // param.append("user", 1);
        // param.append("goods",1);
        var a = this;
        var b =a.getCookie('csrftoken');
        // var b =a.csrftokene;
        console.log("b:"+b);

        if(b){
          var c =a.getCookie('csrftoken');
          // var b =a.csrftokene;
          console.log("c:"+c);
          axios.post("/apis/shopcarts/",
            {   //post请求学习网址：https://blog.csdn.net/qq_41000891/article/details/82902294
              "user":1,
              "goods": 1,
              "nums":1
            }, {
              headers: {
                'token': '123',
                'X-CSRFToken':c
              }
              //   headers:{'X-CSRFToken': a.getCookie('csrftoken')}
            }
          ).then((responseresult)=>{
            if(responseresult.status==201){ //  如果请求成功
              console.log("a.getCookie('csrftoken'):"+a.getCookie('csrftoken'));
              alert("加入成功");   //  弹框提示“加入成功”
            }else{ // 否则弹框提示错误信息
              console.log("a.getCookie('csrftoken'):"+a.getCookie('csrftoken'));
              alert("msg:"+responseresult.detial);
            }

          }); //  通过axios.post的方式提交数据,url为goods/addCart，参数为productId:productId

        }else{
          console.log("b的内容为空："+b);
        }
      },
      getCookie(name){  //  获取cookie，防止报错 "CSRF Failed: CSRF cookie not set."
        console.log("获取cookie:"+document.cookie);
        var csr;
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        console.log("获取parts:"+parts);
        console.log("获取parts.length:"+parts.length);
        if (parts.length === 2){
          csr=parts.pop().split(';').shift();
          console.log("parts.pop().split(';').shift():"+csr);
          return [csr];
        }

      }
    }
  }
</script>

<style>
  .accessory-list col-4 ul::after{ /*给ul后面定义一个伪类after,伪类会在ul后面插一个标签*/
                                    /*就好比在li下插入了一个div,*/
    clear: both;  /*清除浮动的方式：两边清除*/
    content: '';   /*伪类对应的标签的内容为空*/
    height: 0;  /*高度为0，起到清除浮动的作用，同时又不想让别人看到它，故而将高度设置为0*/
    display: block;  /*定义为块状的，block，就相当于在li后面插入了一个div,高度为0，内容为空，两边清除浮动效果*/
    visibility: hidden; /*设置为看不见，可见度设置为隐藏*/
  }
  .load-more{  /*定义加载的样式*/
    height: 100px;   /*高度设置为100像素*/
    line-height: 100px;  /*行高设置为100像素*/
    text-align: center;  /*放在中间*/

  }
</style>


