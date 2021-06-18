<template>
   <div class="bg">
       <div class="title">
           <div>{{title}}</div>
           <div class="del" @click="deleteTable" v-if="delShow">删除</div>
       </div>
       <div>
        <van-field
        v-for="(item, index) in vanFormData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.label"
        :type="item.type"
        :required="item.required"
        input-align="right"
         :readonly="item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
         @click="item.click == 'date'||item.click == 'select' ? showDatePopup(item) : ''"
      />
        <van-popup :show="show"  position="bottom" custom-style="width: 100%; height: 50%;">
            <Calendar v-if="click == 'date'" @cancel="cancel" @submit="submit"></Calendar>
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
    </div>
</template>

<script>
import Calendar from '../utils/calendar'
export default {
    components:{Calendar},
    props:{
      title:{
          type:String,
          default:''
      },
      delShow:{
          type:Boolean,
          default:false
      }
    },
    data(){
        return{
            show:false,
            click:'',
            poptitle:'',
            clickName:'',
            clickValue:'',
            columns: [{text:'差旅',value:'0'}, {text:'招待',value:'1'}],
            tableList:[],
            vanFormData:[
                {name:'user',value:'费用用途',label:'请输入',type:'',click: 'normal',  required:false,readonly:false},
                 {name:'type',value:'费用类别',label:'请选择',type:'',click: 'select',  required:false,readonly:true,clickValue:'typeValue'},
                {name:'startDate',value:'开始日期',label:'请选择',type:'',click: 'date',  required:false,readonly:true},
                {name:'endDate',value:'结束日期',label:'请选择',type:'',click: 'date',  required:false,readonly:true},
                {name:'money',value:'报销金额',label:'请输入',type:'digit',click: 'normal',  required:false,readonly:false},
                {name:'remark',value:'备注',label:'请输入',type:'',click: 'normal',  required:false,readonly:false}
                ],
            formData:{user:'',type:'',typeValue:'',startDate:'',endDate:'',money:'',remark:''}
        }
    },
    methods:{
        //左上角删除
        deleteTable(){
            this.$emit('deleteTable')
        },
        //取消
        cancel(){
            this.show=false
        },
        //确定
        submit(val){
            this.show=false,
            this.formData[this.clickName]=val
            // this.$emit('submit',val)
        },
        showDatePopup(val){
            //所在表单的字段值，即vanFormData里的
            this.show=true
            this.poptitle=val.value
            this.click=val.click
            this.clickName=val.name
            this.clickValue= val.clickValue
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

<style lang="scss" scoped>
     .title{
         color: gray;
         font-size: 13px;
         display: flex;
         flex-wrap: nowrap;
         justify-content: space-between;
         padding: 10px;
         .del{
             color:red;
             font-size: 18px;
         }
     }
</style>