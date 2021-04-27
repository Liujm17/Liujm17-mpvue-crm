<template>
  <div class="bg">
    <div class="box-card">
      <div class="title" @click="test">财务审批</div>
      <div class="content">
         <van-row>
      <van-col span="6" v-for="(item, index) in list" :key="index">
        <div class="box">
          <div class="box-content" @click="toPage(item.route)">
            <van-icon :name="item.icon" dot  size="40px"/>
          </div>
           <div class="box-name">
             {{item.name}}
          </div>
        </div>
      </van-col>
    </van-row> </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        { id: 1, name: "备用金申请",icon:'chat-o',route:'/pages/applyForCashHis/main' },
      ],
    };
  },
 components: {
    
  },
  mounted() {},
  methods: {
    toPage(val){
      console.log(val)
        this.$router.push({
        path:val,
        query:'1'
      })
    },
    test(){
      
    }
  },
};
</script>
<style lang="scss" scoped>
.bg{
  display: flex;
 
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  .box-card{
  width: 90%;
  min-height: 2.5rem;
   border:1px solid #96C2F1;
 background-color:#EFF7FF;
  border-radius: 0.2rem;
  overflow: hidden;
  .title{
    width: 100%;
    height: 0.5rem;
    text-align: center;
  }
  .box {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .box-content {
    width: 90%;
    height: 70%;
    // border: 1px solid #96c2f1;
    // background-color: #eff7ff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-name{
    width: 90%;
    height: 25%;
    //  background-color: white;
    font-size: 13px;
    text-align: center;
  }
}
}
}


</style>
