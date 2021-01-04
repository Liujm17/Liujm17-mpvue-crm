<template>
  <div>
    <div v-if="isAuth">
    <searchBar
      :disabled="true"
      @onSearchBarClick="onSearchBarClick"
      :hot-search="hotSearch"
    ></searchBar>
    <homeCard
     :data="homeCardData"
    ></homeCard>
    <homeBanner></homeBanner>
    <homeBook
      :data="books"
      :row="1"
      :col="3"
      @onMoreClick="recommendChange('recommend')"
      @onBookClick='onBookClick'
    ></homeBook>
     
    </div>
    <Auth v-if="!isAuth" @getUserInfo="init"/>
  </div>
  
</template>
<script>
import searchBar from "../../components/home/searchBar";
import imageView from "../../components/base/imageView";
import Auth from "../../components/base/auth";
import homeCard from "../../components/home/homeCard";
import homeBanner from "../../components/home/homeBanner";
import homeBook from "../../components/home/homeBook";
import { getHomeData, recommend ,register} from "../../api/api";
import {getSetting,getUserInfo,setStorageSync,getStorageSync,getUserOpenId,showLoading,hideLoading} from '../../api/wechat';
export default {
  data() {
    return {
      books: [],
      isAuth:false,
      homeCardData:{}
    };
  },
  components: {
    searchBar,
    imageView,
    homeCard,
    homeBanner,
    homeBook,
    Auth
  },
  mounted() {
   this.init();
    },
  methods: {
    onBookClick(data,index){
      console.log(data,index)
      this.$router.push({
        path:'/pages/detail/main',
        query:data[index]
      })
    },
    recommendChange(data) {
      switch (data) {
        case "recommend":
          recommend().then((res) => {
            this.books = res.data.data;
          });
          break;
      }
    },
    getBookData(data) {
      getHomeData({ openId:data }).then((res) => {
        this.books = res.data.data.recommend;
        this.$set(this.homeCardData,'num',res.data.data.shelfCount)
        this.$set(this.homeCardData,'books',res.data.data.shelf)
      });
    },
    //获取用户信息
    getUserInfo(){
      //微信api方法getUserInfo，获取用户信息
        getUserInfo((userInfo)=>{
         setStorageSync('userInfo',userInfo)
         const openId = getStorageSync('openId')
         if(!openId || openId.length===0){
           //微信api方法login，获取code后通过getOpenId接口方法获取openid
             getUserOpenId()
         }else{
           const userInfo=getStorageSync('userInfo')
           this.homeCardData=userInfo
           const params={
             openId,
             platform:mpvuePlatform,
             ...userInfo
           }
           //获得授权信息后注册
           register(params).then((res)=>{
             console.log('注册成功')
           })
           //获取图书数据
            this.getBookData(openId);
            //隐藏正在加载
            hideLoading()
         }
        },
        ()=>{
           console.log('failed')
        })
    },
    //微信api方法getSetting来获取用户授权
     getSetting() {
        getSetting(
          'userInfo',
          ()=>{
            //已经获得授权，页面不再是授权页
               this.isAuth = true
               showLoading('正在加载中')
               //获取授权信息
               this.getUserInfo()        
          },
        ()=>{
            this.isAuth = false
          }
        )
      },
       init() {
        this.getSetting()
      },
      //搜索页功能
      onSearchBarClick(){
        this.$router.push('/pages/searchs/main')
      
      }
  },
};
</script>
