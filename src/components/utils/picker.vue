<template>
   <div>
       <van-popup :show="show"  position="bottom" custom-style="width: 100%; height: 50%;" v-if="showDay">
            <Calendar v-if="click == 'date'" @cancel="cancel" @submit="submit" :showDay='showDay'></Calendar>
              <van-picker
             :title="poptitle"
             show-toolbar
             :columns="columns"
             @cancel="onCancel"
             @confirm="onConfirm"
             v-else
            />
        </van-popup>
         <van-popup :show="show"  position="bottom" custom-style="width: 100%; height: 20%;" v-else>
            <Calendar v-if="click == 'date'" @cancel="cancel" @submit="submit" :showDay='showDay'></Calendar>
              <van-picker
             :title="poptitle"
             show-toolbar
             :columns="columns"
             @cancel="onCancel"
             @confirm="onConfirm"
             v-else
            />
        </van-popup>
   </div>
</template>

<script>
import Calendar from './calendar'
export default {
     components:{Calendar},
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
         columns:{
             type:Array,
             default:[]
         },
         formData:{
             type:Object,
             default:{}
         },
         poptitle:{
             type:String,
             default:''
         },
         //显示日
         showDay:{
             type:Boolean,
             default:true
         }
     },
     data(){
         return{
            // title:'',
            // clickName:'',
            // clickValue:'',
         }
     },
     methods:{
          //取消
        cancel(){
            this.$emit('cancel')
            // this.show=false
        },
         //确定
        submit(val){
            this.$emit('submit',val)
            // this.show=false,
            // this.formData[this.clickName]=val
        },
         //弹窗确定
        onConfirm(val){
             this.show=false
             this.formData[this.clickName]=val.mp.detail.value.text
             this.formData[this.clickValue]=val.mp.detail.value.value
        },
        //弹窗取消
        onCancel(){
            this.show=false
        }
     }
}
</script>

<style>

</style>