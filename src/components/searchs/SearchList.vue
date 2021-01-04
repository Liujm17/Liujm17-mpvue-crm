<template>
  <div class="search-list">
<div v-for="(item,index) in data" :key="index">
  <p @click="show(data,index)">{{item.author}}</p>
</div>
  </div>
</template>

<script>
    export default {
      data(){
        return{
         
        }
      },
      props: {
      data:{
          type:Array,
          default:[]
      }
    },
    methods:{
        show(data,index){
               this.$router.push({
        path:'/pages/detail/main',
        query:data[index]
      })
        }
    }
//    watch:{
//        'data'(){
//            console.log(this.data)
//        }
//    }
  }

</script>

<style lang="scss">
  .search-list {
    padding: 15px 0;
  }
</style>
