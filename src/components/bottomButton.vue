<template>
  <div class="bottom-bt" :style="{zIndex:zIndex}">
       <div  class="bt-item"  v-for="(item,index) in btList" :key="index" @click="clickBt(item.click?item.click:'')" :style="{color:item.color?item.color:''}" >{{item.name}}</div>
    </div>
</template>

<script>
export default {
    props:{
        btList:{
            type:Array,
            default:[]
        },
        zIndex:{
            type:Number,
            default:10000
        }
    },
    methods:{
        clickBt(val){
            this.$emit('clickBt',val)
        }
    }
}
</script>

<style lang="scss" scoped>
.bottom-bt{
  width: 100%;
  display: flex;
  height: 40px;
  position: fixed;
  bottom: 20px;
  left: 0;
  .bt-item{
    flex:1;
    height:100% ;
    background-color: white;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>