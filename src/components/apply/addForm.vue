<template>
  <div>
     <DetailsOfCharges v-for="(item,index) in list" :key="index" @deleteTable='deleteTable(index)' title="明细" :delShow="true"></DetailsOfCharges>
    <div class="add-button">
      <van-icon name="add-o" @click="addTable" size="30px"/>
      <p style="margin-left:10px">添加明细</p>
    </div>
  </div>
</template>

<script>
import DetailsOfCharges from './detailsOfCharges'
export default {
   components:{DetailsOfCharges},
   data(){
     return{
       list:[],
     }
   },
   methods:{
        //添加表单
        addTable(){
         this.list.push(1)
        },
        deleteTable(val){
           this.list.splice(val, 1);
        }
   }
}
</script>

<style scoped>
  .add-button{
      display:flex;
      align-items: center;
      flex-wrap:nowrap;
      color:#1989fa;
      padding: 10px 10px;
      /* height: 40px;
      line-height: 40px; */
  }
</style>