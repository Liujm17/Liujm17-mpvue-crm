<template>
  <div @click='test'>
    暂无内容
  </div>
</template>

<script>
export default {
   data(){
     return{
     }
   },
   methods:{
     test(){
       this.$router.push({
         path:'/pages/shenpi/main?id=10&orderId=35&formId=1',
         isTab: true
       })
     }
   }
}
</script>

<style>

</style>