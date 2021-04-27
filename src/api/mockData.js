const applyCash = {
  vanFormData: {
    formData: [
      {
        name: 'applyUserName',
        value: '用户名',
        type:'normal'
      }, {
        name: 'payeeUserName',
        value: '付款人',
        type:'user'
      },
      {
        name: 'money',
        value: '金额',
        type:'normal'
      },
      {
        name: 'month',
        value: '所属期',
        type:'normal'
      },
      {
        name: 'subject',
        value: '事由',
        type:'normal'
      },
      {
        name: 'remark',
        value: '备注',
        type:'normal'
      },
      {
        name: 'bankName',
        value: '收款人银行',
        type:'normal'
      },
      {
        name: 'bangAccount',
        value: '收款人账号',
        type:'normal'
      }
    ]
  },
  formData: {
    applyUserId: 1,
    applyUserName: "",
    payeeUserId: "",
    payeeUserName: "",
    money: "",
    month: "",
    subject: "",
    remark: "",
    bankName: "",
    bankAccount: "",
  },
}

export default {
  applyCash
}
