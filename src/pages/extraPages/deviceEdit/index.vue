<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-for="(item, index) in listData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.click == 'radioGroup' ? '' : item.value"
        :type="item.type"
        :required="item.required"
        input-align="right"
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="item.click == 'date' ? showDate(item) : ''"
      >
        <RadioButton
          :typeList="radioList"
          :active="active"
          @changeData="changeData"
          v-if="item.click == 'radioGroup'"
        ></RadioButton>
      </van-field>
    </van-cell-group>

    <!-- 附件 -->
    <Accessroy :photoList="photoList" :deleteList='deleteList'></Accessroy>

    <!-- 关联产品 -->
    <div class="title">关联配件</div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.specs }}</div>
        <div class="content-title" style="color: red" @click="delList(index)">
          删除
        </div>
      </div>
    </div>
    <div class="table-add">
      <van-button round plain hairline type="info" @click="addProduct"
        >添加配件</van-button
      >
    </div>

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="dateSubmit"
    ></Picker>

    <!-- 产品弹出层 -->
    <van-popup
      :show="productShow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <Product
        @submit="productSubmit"
        :radio="productRadio"
        @cancel="onClose"
      ></Product>
    </van-popup>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存" @click="save()" />
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import RadioButton from "../../../components/radioButton";
import Accessroy from "../../../components/apply/accessory";
import Picker from "../../../components/utils/picker.vue";
import Product from "../../../components/productOptions.vue";
export default {
  components: { RadioButton, Accessroy, Picker, Product },
  data() {
    return {
      //该页面字段方法数据
      data: data,
      uuid: '',
      //表单列表
      listData: [],
      //表单值
      formData: {},
      //状态多选按钮
      radioList: [],
       //附件列表
      photoList: [],
      //编辑中被删除的图片id列表
      deleteList:[],
      //需要上传的列表
      needList:[],
      active: 0,
      page: "deviceInfo",
      //关联产品
      title: ["产品名称", "规格型号", "操作"],
      content: [],
      //日期选择器
      dateShow: false,
      clickName: "",
      //产品弹窗相关
      productShow: false,
      productRadio: "1",
    };
  },
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.radioList = this.data[this.page].radioList;
     this.uuid= data.get_uuid(),
    this.getData()
  },
   watch:{
     //监听图片列表，看有无新上传的
     photoList:{
       handler(newVal,oldVal){
       this.needList =data.sliceList(newVal.filter((item)=>!item.id))
       },
       deep:true
     },
     //监听图片列表，看有无把旧的图片删除的
     deleteList:{
        handler(newVal,oldVal){
         this.needList=data.sliceList(newVal)
       },
       deep:true
     }
  },
  methods: {
     getData(){
      let params={
         formId: this.$store.state.formId,
          id: this.$route.query.id,
      }
        data['deviceInfo'].getData(params).then((res)=>{
             Object.keys(this.formData).map((item)=>this.formData[item]=res.data.data[item])
             this.content=res.data.data.products.map((item)=>{
                  return{
                    id:item.id,
                    name:item.name,
                    specs:item.specs
                  }
             })
             this.formData.statusName=''
             this.active=this.formData.status-1
        this.photoList=res.data.data.fileVos?res.data.data.fileVos.map((item)=>{
          return{
             type:item.type==0?'image':'video',
             img:item.type==0?item.address:'',
             video:item.type==1?item.address:'',
             id:item.id?item.id:''
          }
        }):[]
        // let list =[]
        // if(res.data.data.fileVo.id){
        //    list.push(res.data.data.fileVo)
        // this.photoList=list.length>0?list.map((item)=>{
        //   return{
        //      type:item.type==0?'image':'video',
        //      img:item.type==0?item.address:'',
        //      video:item.type==1?item.address:'',
        //      id:item.id?item.id:''
        //   }
        // }):[]
        // }
        })
    },
    //按钮群点击更换高亮事件
    changeData(item, index) {
      this.active = index;
    },
    //保存
    save() {
      let params = {
        id: this.$route.query.id,
        ...this.formData,
        fileCode: "",
        deleteIds:this.deleteList,
        factoryId: 2020001,
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
      };
      params.status = this.active + 1;
      params.productIds = this.content.map((item) => Number(item.id));
      if (this.needList.length > 0) {
        data.upLoadFile(this.needList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.fileCode = resData.data.code;
          data["deviceInfo"].editOrStart(params).then((res) => {
              if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
             setTimeout(() => {
               //回退2层
                 this.$router.go(2);
                }, 1000);
             }
          });
        });
      } else {
        data["deviceInfo"].editOrStart(params).then((res) => {
           if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
             setTimeout(() => {
               //回退2层
                 this.$router.go(2);
                }, 1000);
             }
        });
      }
    },
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.productShow = false;
    },
    //打开日期弹窗
    showDate(val) {
      if (!this.$route.name.includes("Detail")) {
        this.dateShow = true;
        this.clickName = val.name;
      } else {
        return;
      }
    },
    //日期选择确定
    dateSubmit(val) {
      this.formData[this.clickName] = val;
      this.dateShow = false;
    },
    //产品弹窗确认
    productSubmit(val) {
      this.content.push(val);
      this.productShow = false;
    },
    //删除产品列表对应产品
    delList(val) {
      this.content.splice(val, 1);
    },
    //产品弹窗
    addProduct() {
      this.productShow = true;
    },
  },
};
</script>


<style scoped>
.allbg {
  margin-bottom: 150px;
}
.title {
  color: gray;
  font-size: 13px;
}
</style>
<style lang="scss" scoped>
.table-add {
  width: 100%;
  font-size: 25px;
  text-align: center;
  color: black;
  font-weight: 500;
}
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .table-header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .header-title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .table-content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .content-title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}
</style>