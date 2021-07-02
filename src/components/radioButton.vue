<template>
     <div style="display:flex;flex-wrap:nowrap;align-items:center" class="radio-bg" slot="button">
      <van-button :type="active == index?'info':'default'" size="small" v-for="(item,index) in typeList" :key="index" @click="changeData(item,index)">{{item.text}}</van-button>
    </div>
</template>

<script>
export default {
      props:{
          active:{
              type:Number,
              default:0
          },
          typeList:{
              type:Array,
              default:[]
          },
      },
      data(){

      },
      methods:{
        changeData(item,index){
            this.$emit('changeData',item,index)
        }
      }
}
</script>

<style>

</style>