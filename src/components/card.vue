<template>
  <div class="bg">
    <div class="card"  v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
      <div class="text" v-for="(label,index2) in item" :key="index2" :style="{color:item.color?item.color:''}" v-show="index2 !== 'id'&&index2 !== 'orderId'&&index2 !== 'formId'&&index2 !=='deviceId'&&index2 !=='color'">
        {{label}}
      </div>
    </div>
    <div v-show="more" class="moretext">下拉加载</div>
    <div v-show="!more" class="moretext">没有更多了</div>
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
    width: 90%;
    line-height: 40px;
    border-bottom: 1px solid #8866;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    // float: left;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .text:nth-child(n+2){
      flex: 1;
      flex-wrap: wrap;
      text-align: center;
      overflow: hidden;
    }
  }
    .card:hover{
    background:#D3D3D3;
  }
}
.moretext{
  color:#666;
  font-size: 13px;
}
</style>
