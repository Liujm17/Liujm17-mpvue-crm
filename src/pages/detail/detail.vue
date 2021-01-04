<template>
  <div :data="test">

    <div style="width: 100%; height: 200px">
      <imageView :src="test.cover" height="100%" mode="scaleToFill" />
    </div>
    <div>{{test.id}}</div>
    <div class="buy-btn" @click="buyThings()">购买</div>
  </div>
</template>
<script>
import imageView from "../../components/base/imageView";
export default {
  components: {
    imageView,
  },
  // computed: {
  //   test() {
  //     return this.$route.query;
  //   },
  // },
  data() {
    return {
      test:{}
    };
  },
  // watch:{
  //   'test'(){
  //     this.clearData();
  //     this.getData()
  //   },
   
  // },
  mounted() {
    this.getData()
  },
  methods:{
    //获取route里的数据
    getData(){
         this.test=this.$route.query
    },
    //强制重新渲染页面方法
    clearData(){
 this.$forceUpdate();
    },
    buyThings(){
       this.$router.push({
        path:'/pages/pay/main',
        query:this.$route.query
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.buy-btn{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    text-align: center;
    line-height: 100rpx;
    background: hsl(358, 64%, 43%);
    color: #fff;
    font-size: 30rpx;
}
</style>
