<template>
  <div class="bg">
    <div class="card" v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
      <div class="text" v-for="(label,index2) in item" :key="index2" :style="{color:index2 == 'title'?'black':'#888'}" v-show="index2 !== 'id'&&index2 !== 'orderId'&&index2 !== 'formId'">{{label}}</div>
    </div>
    <div v-show="more&&cardList.length>10">下拉加载</div>
    <div v-show="!more||cardList.length<=10">没有更多了</div>
    <div style="width:100%;height:8rem"></div>
  </div>
</template>

<script>
export default {
    props:{
        cardList:{
            type:Array,
            default:[]
        },
        more:{
          type:Boolean,
          default:true
        }
    },
  data() {
    return {
    };
  },
  methods:{
    toDetail(val){
      this.$emit('toDetail',val)
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    width: 95%;
    line-height: 40px;
    border: 1px solid #aaa;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    // float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .text{
      width: 50%;
      text-align: center;
    }
  }
}
</style>
