<template>
  <div class="bg">
    <div class="card" v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
      <div v-for="(label,index2) in item" :key="index2" :style="{color:index2 == 'title'?'black':'#888'}" v-show="index2 !== 'id'&&index2 !== 'orderId'&&index2 !== 'formId'">{{label}}</div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        cardList:{
            type:Array,
            default:[]
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
  margin-bottom: 4rem;
  .card {
    width: 90%;
    min-height: 1.2rem;
    border: 1px solid #aaa;
    margin: 3px 0;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    float: left;
  }
}
</style>
