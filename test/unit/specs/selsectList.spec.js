import { shallowMount } from '@vue/test-utils';
import selectList from '@/components/commomComponents/selectList';
import sinon from 'sinon'

describe('selectList.vue', () => {
    // 测试列表生成li的个数
    it('render each li in props list ', () => {
        const list = [0, 1, 2];
        const wrapper = shallowMount(selectList, {
            propsData: {list}
        });
        expect(wrapper.findAll('li')).toHaveLength(list.length);
    });
    // 测试点击遮罩层调用回调
    it('click mask call clickMaskCallBack', () => {
        const spy = sinon.spy(); // spy用于监听需要测试的函数
        const wrapper = shallowMount(selectList, {
            propsData: {clickMaskCallBack: spy} // 用监听器替换输入的回调函数
        });
        wrapper.find('div.selectBox').trigger('click');
        expect(spy.calledOnce).toBe(true); // 回调函数调用一次
    });
    // 点击一个li, 调用li的点击回调
    it('click a li call liCallback and use param "item"', () => {
        const stub = sinon.stub();
        const list = [0, 1, 2];
        let item = {key: 0};
        const wrapper = shallowMount(selectList, {
            propsData: {list: list, clickCallBack: stub}
        });
        wrapper.setData({selectIndex: -1});
        wrapper.find('li').trigger('click'); // 与33行代码一起运行算两次
        // wrapper.vm.clickLi(item);
        // expect(wrapper.vm.selectIndex).toEqual(0);
        // expect(stub.calledWith(item)).toBe(true);
        expect(stub.calledOnce).toBe(true);
    });
    // 测试methods里的方法
    it('test method clickLi', () => {
        const stub = sinon.stub();
        const item = {key: 0};
        const wrapper = shallowMount(selectList, {
            propsData: {clickCallBack: stub} // 一个stub只能模拟一个方法
        });
        wrapper.vm.clickLi(item);
        expect(wrapper.vm.selectIndex).toEqual(0);
        expect(stub.calledWith(item)).toBe(true);
        // wrapper.vm.clickMask();
        expect(stub.calledOnce).toBe(true);
    });
    // 测试methods里的方法
    it('test method clickMask', () => {
        const stub = sinon.stub();
        const wrapper = shallowMount(selectList, {
            propsData: {clickMaskCallBack: stub} // 一个stub只能模拟一个方法
        });
        wrapper.vm.clickMask();
        expect(stub.calledOnce).toBe(true);
    });
});