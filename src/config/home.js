export const tabList = [
    {
        text: '健康',
        normalIcon: 'icon_h.png',
        choosedIcon: 'icon_h_h.png'
    },
    {
        text: '会员',
        normalIcon: 'icon_shop.png',
        choosedIcon: 'icon_shop_h.png'
    },
    {
        text: '我的',
        normalIcon: 'icon_mine.png',
        choosedIcon: 'icon_mine_h.png'
    }
]
export const tabListZhangHu = [
    {
        text: '健康',
        normalIcon: 'icon_h.png',
        choosedIcon: 'icon_h_h.png'
    },
    {
        text: '商城',
        normalIcon: 'icon_shop.png',
        choosedIcon: 'icon_shop_h.png'
    },
    {
        text: '我的',
        normalIcon: 'icon_mine.png',
        choosedIcon: 'icon_mine_h.png'
    }
]
export const healthModelList = [
    {
        imgUrl: 'examining_report.png',
        type: 'push',
        path: '/sugarReport/uploadReport',
        borderRight: true,
        borderBottom: true
    },
    {
        imgUrl: 'tangyou_circle.png',
        type: 'push',
        path: '/tangyouCircle/tangyouCircle',
        borderBottom: true
    },
    {
        imgUrl: 'xiaotangyi_class.png',
        type: 'jump',
        path: 'https://m.qlchat.com/live/840000112284009.htm',
        borderRight: true
    },
    {
        imgUrl: 'urine_analysis.png',
        type: 'function',
        path: 'toNiaoDaiFu'
    }
]

export const zhanghuHealthModelList = [
    {
        imgUrl: 'find_doctor.png',
        type: 'push',
        path: '/findDoctor/findDoctor',
        borderRight: true,
        borderBottom: true
    },
    {
        imgUrl: 'apply_recipe.png',
        type: 'function',
        path: 'getLocation',
        borderBottom: true
    },
    {
        imgUrl: 'examining_report.png',
        type: 'push',
        path: '/sugarReport/uploadReport',
        borderRight: true,
        borderBottom: true
    },
    {
        imgUrl: 'tangyou_circle.png',
        type: 'push',
        path: '/tangyouCircle/tangyouCircle',
        borderBottom: true
    },
    {
        imgUrl: 'tangniaobing_class.png',
        type: 'jump',
        path: 'https://mp.weixin.qq.com/mp/homepage?__biz=MzIwNTM1NTAxMQ%3D%3D&hid=6&sn=22824623e9d5305fc45f19ef8211b737',
        borderRight: true,
    }
]

export const mineModelList = [
    {
        icon: 'health_info.png',
        type: 'push',
        path: '/healthInfo/healthInfo',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'my_friend.png',
        type: 'push',
        path: '/family',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'health_target.png',
        type: 'push',
        path: '/healthInfo/healthTarget',
        borderBottom: true
    },
    {
        icon: 'my_coupon.png',
        type: 'push',
        path: {path: '/point/myCoupon', query: {canUseCoupon: '0'}},
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'my_machine.png',
        type: 'push',
        path: '/bindDevices/byButton',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'order_manage.png',
        type: 'push',
        path: '/point/conversionRecord',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'address_menage.png',
        type: 'push',
        path: '/point/addressManage',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'help_center.png',
        type: 'jump',
        path: 'http://mp.weixin.qq.com/mp/homepage?__biz=MzIyOTMyNzUxNw==&hid=9&sn=c8ff9579e2b4275bfb2f285bef4dfef3#wechat_redirect',
        borderRight: true,
    },
    {
        icon: 'set.png',
        type: 'push',
        path: '/set/set',
        borderRight: true,
    }
]
export const zhanghuMineModelList = [
    {
        icon: 'health_info.png',
        type: 'push',
        path: '/healthInfo/healthInfo',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'my_friend.png',
        type: 'push',
        path: '/family',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'health_target.png',
        type: 'push',
        path: '/healthInfo/healthTarget',
        borderBottom: true
    },
    {
        icon: 'my_consult.png',
        type: 'push',
        path: '/consult/myConsultList',
        borderRight: true,
        borderBottom: true,
        messageTipShow: false,
        messageSum: 0
    },
    {
        icon: 'my_recipe.png',
        type: 'push',
        path: '/recipe/recipeList',
        borderRight: true,
        borderBottom: true
    },
    {
        icon: 'my_machine.png',
        type: 'push',
        path: '/bindDevices/byButton',
        borderBottom: true
    },
    {
        icon: 'order_manage.png',
        type: 'push',
        path: '/point/conversionRecord',
        borderRight: true
    },
    {
        icon: 'address_menage.png',
        type: 'push',
        path: '/point/addressManage',
        borderRight: true
    },
    {
        icon: '',
        type: '',
        path: '/point/addressManage',
    }
]
