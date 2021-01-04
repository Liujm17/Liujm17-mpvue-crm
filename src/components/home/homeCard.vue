<template>
  <div class="homecard">
    <div class="homecard-bg">
      <div class="userInfo">
        <div class="image">
          <imageView
            :src="avatar"
            round
            height="100%"
          ></imageView>
        </div>
        <div class="text">{{username}}</div>
        <div class="content">书架共{{data.num}}本书</div>
        <div class='question'>反馈</div>
      </div>
      <div class="bookInfo">
        <div class="book">
          <div
            v-for="(item,index) in bookslist"
            :key="index"
            style="height: 100%; width: 72px; padding-left: 20px"
          >
            <imageView :src="item.cover" height="100%"></imageView>
          </div>
        </div>
        <div class="bookCase"><span style="writing-mode: vertical-rl;">书架</span><span>></span></div>
      </div>
    </div>
  </div>
</template>
<script>
import imageView from "../base/imageView";
export default {
   props: {
      data: Object,
      hasSign: {
        type: Boolean,
        default: false
      },
      signDay: {
        type: Number,
        default: 0
      }
    },
    computed:{
       avatar(){
         return (this.data  && this.data.avatarUrl) || ''
       },
       username(){
          return(this.data && this.data.nickName) || ''
       },
       bookslist(){
         return(this.data&& this.data.books) || ''
       }
    },
  data() {
    return {
    };
  },
//   mounted(){
//   console.log(this.data,'mounted')
//   },
//   beforeUpdate(){
// console.log(this.data,'beforeUpdate')
//   },
  components: {
    imageView,
  },
};
</script>
<style lang="scss" scoped>
.homecard {
  margin: 20px 20px 0 20px;
  width: 335px;
  height: 179px;
  .homecard-bg {
    height: 100%;
    background-image: linear-gradient(-90deg, #54575f 0%, #595b60 100%);
    border-radius: 15px;
    .userInfo {
      position: relative;
      padding-top: 21.5px;
      display: flex;
      align-items: center;
      .image {
        padding-left: 20px;
        height: 20px;
        width: 20px;
      }
      .text {
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        padding-left: 8.5px;
      }

      .content {
        display: flex;
        align-items: center;
        padding-left: 8.5px;
        opacity: 0.7;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
      }
      .question{
        position: absolute;
        right: 0;
        width: 44.5px;
        height: 23.5px;
       opacity: 0.3;
background: #D8D8D8;
border-radius: 100px 0 0 100px;
text-align: center;
      }
    }
    .bookInfo {
      display: flex;
      margin: 15px 0 20px 0px;
      height: 101px;
      .book {
        display: flex;
        width: 276px;
        height: 100%;
      }
      .bookCase {
        display: flex;
        align-items:center;
        width: 40px;
        height: 100%;
        opacity: 0.8;
        font-family: PingFangSC-Regular;
        font-size: 10.5px;
        color: #ffffff;
        justify-content: center;
      }
    }
  }
}
</style>
