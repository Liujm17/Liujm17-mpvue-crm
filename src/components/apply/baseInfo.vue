<template>
   <div class="bg">
       <div class="title">{{title}}</div>
       <div>
    <van-cell-group>
      <van-field
        v-for="(item, index) in listData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        :type="item.type"
        input-align="right"
         :readonly="readonly?readonly:item.readonly"
         :required="required?false:item.required"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="item.click == 'user' ? showPopup('表单') : (item.click == 'post'?showPost(item):(item.click == 'date'?showDate(item):''))"
      >
       <RadioButton  :typeList='radioList' :active="active"  @changeData="changeData" v-if="item.click == 'radioGroup'"></RadioButton>
      </van-field>
   </van-cell-group>
      </div>

      <!-- 岗位弹出层 高度为100的弹层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
      v-if="popUp[0]"
    >
      <Post @submit="submit" :radio='radio' @cancel="onClose"></Post>
    </van-popup>

      <!-- 供应商类型弹出层 -->
       <van-popup :show="show"  position="bottom" custom-style="width: 100%; height: 50%;" v-if="popUp[1]">
              <van-picker
             title="选择类型"
             show-toolbar
             :columns="columns"
             @cancel="onClose"
             @confirm="onConfirm"
            />
        </van-popup>
        <Picker :show="dateShow" click="date" :formData="formData" :clickName='clickName' :clickValue='clickValue' @cancel="onClose" @submit="submit2"></Picker>
    </div>
</template>

<script>
import RadioButton from '../radioButton.vue'
import Picker from '../utils/picker'
import Post from '../postOptions'
import data from '../../api/mockData'
export default {
     props:{
         readonly:{
             type:Boolean,
             default:'',
         },
         required:{
             type:Boolean,
             default:'',
         },
          active:{
              type:Number,
              default:0
          },
         listData:{
             type:Array,
             default:[]
         },
         title:{
             type:String,
             default:''
         },
         formData:{
             type:Object,
             default:{}
         },
         //选择状态按钮数组
         radioList:{
              type:Array,
             default:[]
         }
     },
     components:{Post,Picker,RadioButton},
     data(){
         return{
            dateShow:false,
           show:false,
           radio:'1',
           clickName:'',
           clickValue:'',
           filterInfo:'',
           popUp:[],
           data:data,
            columns:[],
         }
     },
     onLoad(){
         this.filterInfo= this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0]
         this.popUp =this.filterInfo.popUp;
        this.columns=data[this.filterInfo.data].typeList
     },
     methods:{
         //单选按钮群更改事件
           changeData(item,index){
            this.$emit('changeData',item,index)
        },
         //弹窗选完值后选项的id和值(大弹窗，自我赋值)
         submit(val){
            this.formData[this.clickName]=val.name
            this.formData[this.clickValue]=val.id
            this.show=false
         },
         submit2(val){
            this.formData[this.clickName]=val
            //这个的时候他不需要id值 只需要name，value为undifined
            this.formData[this.clickValue]=val
            this.dateShow=false
         },
         onClose(){
           this.show=false
           this.dateShow=false
         },
         //打开弹窗时候所在表的字段名的值，vanformdata里的
         showPost(val){
            if(!this.$route.name.includes('Detail')){
                this.show=true
                this.clickName=val.name
                this.clickValue=val.clickValue
            }else{
                return
            }
        
         },
         showDate(val){
            if(!this.$route.name.includes('Detail')){
                this.dateShow=true
                this.clickName=val.name
                this.clickValue=val.clickValue
            }else{
                return
            }
         },
         showPopup(val){
             this.$emit('showPopup',val)
         },
         //供应商小弹窗(被动赋值)
         onConfirm(val){
            this.show=false
             this.formData[this.clickName]=val.mp.detail.value.text
             this.formData[this.clickValue]=val.mp.detail.value.value
         },

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
     .radioGroup-bt{
         width: calc(50vw);
         height: 100%;
         display:flex;
         flex-wrap: wrap;
         align-items:center
     }
     .bt-item{
         flex: 1;
    height:20px;
      background-color: white;
    border: 1px solid black;
     display: flex;
    justify-content: center;
    align-items: center;
  }
</style>