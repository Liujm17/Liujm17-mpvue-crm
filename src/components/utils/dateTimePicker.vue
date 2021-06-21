<template>
 <van-popup :show="show"  position="bottom" custom-style="width: 100%; height: 50%;">
    <van-picker show-toolbar title="年月日时分秒" :columns="columns" @cancel='cancel' @confirm='submit'/>
        </van-popup>
</template>

<script>
export default {
     props:{
         click:{
             type:String,
             default:''
         },
         clickName:{
             type:String,
             default:''
         },
         clickValue:{
             type:String,
             default:''
         },
         show:{
             type:Boolean,
             default:false
         },
         formData:{
             type:Object,
             default:{}
         },
         poptitle:{
             type:String,
             default:''
         }
     },
  data(){
      return{
           columns: [
        // 第一列
        {
          values: Array.from({ length: 10 }, (v, k) => (k + 2015)+''),
          defaultIndex: 6,
        },
        // 第二列
        {
          values: Array.from({ length: 12 }, (v, k) => (k + 1)+''),
          defaultIndex: 1,
        },
         {
          values: Array.from({ length: 31 }, (v, k) => (k + 1)+''),
          defaultIndex: 1,
        },
         {
          values: Array.from({ length: 24 }, (v, k) => (k)+''),
          defaultIndex: 1,
        },
         {
          values: Array.from({ length: 60 }, (v, k) => (k)+''),
          defaultIndex: 1,
        },
         {
          values: Array.from({ length: 60 }, (v, k) => (k)+''),
          defaultIndex: 1,
        },
      ],
      }
  },
  methods:{
       cancel(){
        this.$emit('cancel')
    },
    submit(val){
     const res=val.mp.detail.value
     let dateTime= res[0]+'-'+res[1]+'-'+res[2]+' '+res[3]+':'+res[4]+':'+res[5]
    //    this.show=false
    //          this.formData[this.clickName]=val.mp.detail.value.text
    //          this.formData[this.clickValue]=val.mp.detail.value.value
      this.$emit('submit',dateTime)
    },
  }
}
</script>

<style>

</style>