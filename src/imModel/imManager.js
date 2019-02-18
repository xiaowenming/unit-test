import {eventBus, eventKey} from '../utils/eventBus'
import {aboutImModel} from '../api/aboutImModel'
import {imModel} from './imModel'

export const imManager = {
  IM_SDK_APP_ID: 1400124203,
  IM_ACCOUNT_TYPE: 37073,
  initIM: function () {
    let userId = sessionStorage.getItem('cid')
    if (userId != null && userId !== '') {
      aboutImModel.getImSig({'imUserId': userId}, res => {
        let userSig = res.data.data.consultSig.sig
        try {
          imModel.login(this.IM_ACCOUNT_TYPE, this.IM_SDK_APP_ID, userId, '', userSig, (newMsgList) => {
            for (let j in newMsgList) { // 遍历新消息
              const newMsg = newMsgList[j]
              let sessionId = newMsg.getSession().id(); //
              console.log('receiveId' + newMsg.getSession().id());
              if (newMsg.elems != null && newMsg.elems.length > 0) {
                let msgBody = []
                for (let i = 0; i < newMsg.elems.length; i++) {
                  let elem = newMsg.elems[i]
                  let body = {}
                  body.MsgType = elem.type
                  let msgContent = {}
                  if (elem.type === 'TIMCustomElem') {
                    msgContent.Desc = elem.content.desc
                    msgContent.Data = elem.content.data
                    msgContent.Ext = (typeof elem.content.ext === 'undefined') ? '' : elem.content.ext
                  } else {
                    msgContent.Text = elem.content.text;
                  }
                  body.MsgContent = msgContent;
                  msgBody[i] = body
                }
                let msg = {
                  'From_Account': newMsg.fromAccount,
                  'To_Account': sessionId.toString(),
                  'MsgSeq': newMsg.seq,
                  'MsgRandom': newMsg.random,
                  'MsgTimeStamp': newMsg.time,
                  'MsgBody': msgBody
                }
                eventBus.$emit(eventKey.imNewMsgForC2CChat, msg)
                eventBus.$emit(eventKey.imNewMsgForMsgList, msg)
                eventBus.$emit(eventKey.imNewMsgForMine, msg)
                // this.getUnreadCount()
              }
            }
          }, (res) => {
          })
        } catch (err) {
        }
      }, (res) => {
        this.showToast(res.data.meta.msg)
      })
    }
  }
}
