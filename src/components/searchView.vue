<template>
  <div class="search">
    <div class="content" v-if="show3">
       <van-search v-model="value" :placeholder="placeholder" @search="onSearch"/>
    </div>
    <div class="button" @click="filter" v-if="show2">
         <ImageView :src="src" height="90%"></ImageView>
    </div>
     
        <!-- 筛选条件弹出层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <FilterOptions @submit='submit'></FilterOptions>
    </van-popup>
  </div>
</template>

<script>
import ImageView from "./imageView";
import FilterOptions from './filterOptions'
export default {
  data(){
    return{
      show:false,
      src:require('../../static/images/filter.png'),
      filterInfo:'',
      show2:true,
      show3:true
    }
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder:{
      type:String,
      default:''
    }
  },
  onReady(){
    this.filterInfo=this.$store.state.allData.filter((item)=>item.formId==this.$store.state.formId)[0]
    if(this.filterInfo.filter){
      this.show2=true
    }else{
      this.show2=false
    }
  },
  components:{
    ImageView,FilterOptions
  },
  methods: {
    submit(val){
       this.show=false
       this.$emit('submit',val)
    },
    onSearch(val) {
      this.$emit("onSearch",val);
    },
    onClose(){
      this.show=false
    },
    filter(){
     this.show=true
    }
  },
};
</script>

<style lang="scss" scoped>
  .search{
      display: flex;
      width: 100%;
      .content{
        width: 90%;
      }
      .button{
        width: 8%;
        display: flex;
        align-items: center;
        justify-content: center;   
         padding: 10px 0;
        box-sizing: border-box;
      }
  }
</style>