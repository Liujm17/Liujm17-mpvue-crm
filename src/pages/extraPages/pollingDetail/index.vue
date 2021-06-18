<template>
  <div class="allbg">
    <div class="title">当日巡检记录</div>
    <van-cell-group>
      <van-field
        v-for="(item, index) in listData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        :type="item.type"
        :required="item.required"
        :autosize="item.type == 'textarea' ? true : false"
        input-align="right"
        readonly
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      >
      </van-field>
    </van-cell-group>
     <Accessroy
          :photoList="photoList"
          :onlyOne="false"
          :notShow="false"
        ></Accessroy>
  </div>
</template>

<script>
import data from '../../../api/mockData'
import Accessroy from "../../../components/apply/accessory";
export default {
  components:{Accessroy},
  data() {
    return {
      listData: [
         {
          name: 'inspectTime',
          value: '巡检时间',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
         {
          name: 'deviceName',
          value: '设备名称',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
         {
          name: 'inspectUserName',
          value: '巡检人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
         {
          name: 'deviceStatus',
          value: '设备状态',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
         {
          name: 'remarks',
          value: '问题描述',
          click: 'normal',
          type:'textarea',
          required:true,
          readonly:true
        },
      ],
      formData: {
        inspectTime:'',
        deviceName:'',
        inspectUserName:'',
        deviceStatus:'',
        remarks:''
      },
      //图片视频
      photoList:[]
    };
  },
  onLoad(){
    this.getData()
  },
  methods:{
    getData(){
      let params={
        id:this.$route.query.id
      }
       data['polling'].getData(params)
         .then((res)=>{
           this.formData=res.data.data
            this.photoList = res.data.data.fileVos
          ? res.data.data.fileVos.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
              };
            })
          : [];
         })
    }
  }
};
</script>

<style scoped>
 .allbg{
     margin-bottom: 150px;
   }
.title {
  color: black;
  font-weight: 500;
  font-size: 18px;
}
</style>