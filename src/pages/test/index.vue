<template>
  <div>
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>
    <Charges
      title="费用报销"
      :delShow="true"
      v-for="(item, index) in list"
      :key="index"
      @deleteTable="deleteTable"
    ></Charges>
    <div @click="addTable">新增</div>
    <div @click="test">测试上传</div>
    <div @click="send">扫描</div>
    <div style="width: 100px; height: 100px" @click="showDetail()">
      <ImageView :src="src" height="100%"></ImageView>
    </div>

     <!-- 供应商订单信息 -->
 <div class="title">供应商订单信息</div>
   <div class="card-bg">
    <div class="card" v-for="(item, index) in paymentList" :key="index">
      <div>采购明细{{index+1}}</div>
      <div style="width:100%" class="card-header">
        <div>
          采购单编号:{{item.id}}      
        </div>
        <div>
          总金额:{{item.totalPrice}}
        </div>
      </div>
      <div class="table">
          <div class="table-header">
            <div
              v-for="(titem, tindex) in paymenttitle"
              :key="tindex"
              class="header-title"
            >
              {{ titem }}
            </div>
          </div>
          <div
            class="table-content"
            v-for="(item2, index2) in item.purchaseDetailVoList"
            :key="index2"
          >
            <div class="content-title">{{ item2.productName }}</div>
            <div class="content-title">{{ item2.specs }}</div>
            <div class="content-title">{{ item2.purchaseQuantity }}</div>
            <div class="content-title">{{ item2.unitPrice }}</div>
          </div>
        </div>
      <div style="width:100%" class="card-header">
        <div>
          未付金额:{{item.id}}      
        </div>
        <div>
          在途金额:{{item.totalPrice}}
        </div>
      </div>

       <div class="card-bottom">
         <span>请填写付款金额:</span>
          <van-stepper
            v-model="money"
            @change="money = $event.mp.detail"
             min="0"
          />
       </div>

    </div>
   </div>

   

  </div>
</template>

<script>
import Accessroy from "../../components/apply/accessory";
import Charges from "../../components/apply/detailsOfCharges";
import ImageView from "../../components/imageView.vue";
import data from "../../api/mockData";
export default {
  components: { Accessroy, Charges, ImageView },
  data() {
    return {
      money:'',
      list: [],
      photoList: [],
      paymenttitle: ["产品名称", "规格型号", "数量","单价"],
      paymentList:[ {
        id: 11,
        totalPrice: 20,
        paidPrice: 10,
        approvalPrice: 5,
        unpaidPrice: 5,
        purchaseDate: "2021-06-05",
        purpose: "1",
        purchaseDetailVoList: [
          {
            id: 16,
            purchaseId: 11,
            batchNo: 1623893346441,
            productId: 1,
            totalPrice: 1,
            unitPrice: 1,
            purchaseQuantity: 1,
            inQuantity: 0,
            inStatus: 0,
            productName: "氨水",
            specs: "80%浓度",
            unit: "吨",
            waitInQuantity: null
          }
        ]
      },
        {
        id: 12,
        totalPrice: 20,
        paidPrice: 10,
        approvalPrice: 5,
        unpaidPrice: 5,
        purchaseDate: "2021-06-05",
        purpose: "1",
        purchaseDetailVoList: [
          {
            id: 16,
            purchaseId: 11,
            batchNo: 1623893346441,
            productId: 1,
            totalPrice: 1,
            unitPrice: 1,
            purchaseQuantity: 1,
            inQuantity: 0,
            inStatus: 0,
            productName: "氨水",
            specs: "80%浓度",
            unit: "吨",
            waitInQuantity: null
          }
        ]
      }],
      valueIndex: 0,
      data: data,
      uuid: '',
    };
  },
  onShow() {
     this.uuid= data.get_uuid()
  },
  methods: {
    //显示详情
    showDetail() {
      console.log("1");
      const media = [{ url: this.src, type: "video" }];
      wx.previewMedia({
        current: 0, // 当前显示图片的http链接
        sources: media, // 需要预览的图片http链接列表
        url: media[0],
      });
    },
    send() {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          console.log(res);
        },
      });
    },
    //添加表单
    addTable() {
      this.list.push(1);
    },
    deleteTable(val) {
      this.list.splice(val, 1);
    },
    test() {
      this.test2(this.photoList, this.valueIndex, this.uuid).then(() => {
        console.log("promise");
      });
    },
    //上传视频图片
    test2(list, valueIndex, uuid) {
      return new Promise((resolve, reject) => {
        const uploadTask = wx.uploadFile({
          url: `https://www.hxhb-test.icu:8004/api-ep-project/file/upload`, //仅为示例，非真实的接口地址
          filePath:
            list[valueIndex].type == "image"
              ? list[valueIndex].img
              : list[valueIndex].video,
          method: "POST",
          name: "file",
          header: {
            "content-type": "multipart/form-data",
            Authorization: wx.getStorageSync("Authorization"),
          },
          formData: {
            batchId: uuid,
          },
          success: (res) => {
            console.log("succ");
          },
          complete: () => {
            ++valueIndex;
            if (valueIndex < list.length) {
              console.log(valueIndex);
              console.log(list.length);
              resolve(this.test2(list, valueIndex, uuid));
            } else {
              //递归归0
              valueIndex = 0;
              console.log(valueIndex);
              wx.hideLoading();
              resolve();
            }
          },
        });
        uploadTask.onProgressUpdate((res) => {
          wx.showLoading({
            title: "上传进度：" + res.progress + "%",
          });
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.add-button {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  color: #1989fa;
  padding: 10px 10px;
  /* height: 40px;
      line-height: 40px; */
}
.card-bg {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    width: 95%;
    line-height: 40px;
    border: 1px solid #aaa;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    // float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .text{
      width: 50%;
      text-align: center;
    }
    .card-header{
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    }
    .card-bottom{
      display: flex;
       padding: 0 10px;
       font-size: 20px;
    }
  }
}
</style>
<style>
@import "../../style/list.scss";
.value-class {
  flex: none !important;
}
</style>