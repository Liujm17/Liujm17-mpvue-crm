<template>
    <div class="homeBanner">
       <div class="homeBanner-bg">
            <div class="text-first">书城火爆开售</div>
            <!-- <div class="text-second"><button>立即进入</button></div> -->
       </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
   .homeBanner{
        margin: 20px 20px 0 20px;
  width: 335px;
  height: 125px;
  .homeBanner-bg{
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    background:url('http://www.youbaobao.xyz/book/res/bg.jpg') no-repeat;
    background-size: cover;
    border-radius: 15px;
    .text-first{
        width: 100%;
        text-align: center;
        font-size: 25px;
    }
    // .text-second{
    //     width: 100%;
    //     button{
    //         width: 30%;
    //     }
    // }
  }
   }
</style>