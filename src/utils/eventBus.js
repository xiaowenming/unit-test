import Vue from 'vue';

const eventBus = new Vue()
export {eventBus}

export const eventKey = {
  imNewMsgForMsgList: 'imNewMsgForMsgList',  // 消息列表新消息
  imNewMsgForC2CChat: 'imNewMsgForC2CChat',  // C2C聊天页面新消息
  imNewMsgForMine: 'imNewMsgForMine',        // 我的页面新消息
  imNewMsgForClear: 'imNewMsgForClear',      // 进入聊天页面后清空聊天数
};
