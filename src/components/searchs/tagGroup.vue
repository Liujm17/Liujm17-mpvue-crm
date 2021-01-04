<template>
  <div class="tag">
      <div class="tag-top">
        <span>{{title}}</span>
        <span @click="changeSearch">{{changBtn}}</span>
      </div>
      <div class="tag-text">
        <div v-for="(item, index) in hotSearchs" :key="index">
          <tag :text="item" @onClick="showBookDetail(item, index)"></tag>
        </div>
      </div>
    </div>
</template>
<script>
import tag from "../../components/base/tag";
export default {
      components: {  tag },
  props: {
      hotSearchs:{
          type:Array,
          default:[]
      },
      title:{
          type:String,
          default:''
      },
      changBtn:{
          type:String,
          default:''
      }
  },
  methods: {
      showBookDetail(item,index){
          this.$emit('showBookDetail',item,index)
      },
      changeSearch(){
          this.$emit('changeSearch')
      }
  },
};
</script>
<style lang="scss" scoped>
.tag {
  width: 100%;
  height: 150px;
  .tag-top {
    width: 100%;
    height: 28px;
    line-height: 28px;
  }
  .tag-top span:first-child {
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    margin-left: 16px;
  }
  .tag-top span:last-child {
    float: right;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3696ef;
    margin-right: 16px;
  }
}
</style>
