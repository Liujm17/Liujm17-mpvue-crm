<template>
  <div>
    <Card
      :cardList="cardList"
      :more="more"
      @toDetail="toDetail"
      v-if="cardList.length > 0"
    ></Card>
  </div>
</template>

<script>
import Card from '../../../components/card'
export default {
    components:{Card},
    data(){
      return{
        cardList:[{name:'1',title:'a'}],
        more:false
      }
    },
    methods:{
      toDetail(){

      }
    }
}
</script>

<style>

</style>