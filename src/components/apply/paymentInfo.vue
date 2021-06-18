<template>
   <div class="bg">
       <div class="title">付款信息</div>
       <div>
      <van-field
        v-for="(item, index) in listData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        :type="item.type"
        :required="item.required"
        input-align="right"
         :readonly="item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      />
      </div>
    </div>
</template>

<script>
export default {
     props:{
         listData:{
             type:Array,
             default:[]
         },
         formData:{
             type:Object,
             default:{}
         }
     },
     methods:{
         showPopup(val){
             this.$emit('showPopup',val)
         }
     }
}
</script>

<style lang="scss" scoped>
// .bg{
//     padding: 10px;
//     box-sizing: border-box;
// }
     .title{
         color: gray;
         font-size: 13px;
     }
</style>