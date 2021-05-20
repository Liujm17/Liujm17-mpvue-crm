<template>
   <div>
       <div>基本信息</div>
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
        @click="item.click == 'user' ? showPopup('表单') : ''"
      />
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

<style>

</style>