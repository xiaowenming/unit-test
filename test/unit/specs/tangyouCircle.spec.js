jest.mock('mint-ui', () => {

});
jest.mock('mescroll.js/mescroll.vue', () => {

});
import tangyouCircle from '@/components/tangyouCircle/tangyouCircle';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';

const localVue = createLocalVue()
localVue.use(VueRouter)

const $route = {
    path: '/tangyouCircle/tangyouCircle'
  }

let wrapper = shallowMount(tangyouCircle, {
    localVue,
    mocks: {
        $route
    }
});

let vm = wrapper.vm;

describe('tangyouCircle.vue', () => {
    it('get Data', () => {
        
        let Data = [
            {
                commentSize: 1,
                comments: [
                    {
                        commentId: "9d0e59a0126544f9979a127f7d93ae21",
                        content: "洛阳亲友如相问，一片冰心在玉壶",
                        createTime: "2019-01-22 19:04:49",
                        customerId: "83e56ae37634473e9da80b43fa8374a4",
                        customerName: "肖文明",
                        sugarTestCustomerId: "83e56ae37634473e9da80b43fa8374a4"
                    }
                ],
                createTime: "2019-01-22 19:03:00",
                customerId: "83e56ae37634473e9da80b43fa8374a4",
                customerNote: "肖文明",
                diabetesType: 0,
                headimgurl: "platform/customer/headimg/20180628/2e92360848e54ed9b46bc5922039a4cc.png",
                location: "广东省深圳市",
                organId: "8ddec3c487ae4af29c1579f44240e05e",
                organSysCode: "organ-001",
                praiseSize: 1,
                praises: [
                    {
                        createTime: "2019-01-22 19:05:28",
                        customerId: "83e56ae37634473e9da80b43fa8374a4",
                        customerName: "肖文明",
                        praiseId: "86775939d9e74c0db3582d74c9c2baac",
                        sugarTestCustomerId: "83e56ae37634473e9da80b43fa8374a4"
                    }
                ],
                remark: "继续想",
                sugar: 6.9,
                synckey: "1548154984928",
                tags: [
                    {
                        itemKey: "2",
                        itemValue: "口服药",
                        tagId: "1f0b15136c294a98b840aa5da092940a",
                        testId: "12f84c73ed6e4e7fb32ab6e7df94acc2",
                        typeCode: "pharmacy",
                        typeName: "用药"
                    }
                ],
                testId: "12f84c73ed6e4e7fb32ab6e7df94acc2",
                timeType: 6,
                uploadTime: "2019-01-22 19:03:17"
            }
        ];
        // vm.handleData(Data);
        // expect(vm.dynamicListData).toEquel(Data);
    });
});