import Router from 'vue-router';
Vue.use(Router);

import Index from './components/Home.vue';
import Sort from './components/Sort.vue';
import List from './components/List.vue';
import Detail from './components/Detail.vue';
import Cart from './components/Cart.vue';
import Order from './components/Order.vue';
import OrderList from './components/OrderList.vue';
import OrderDetail from './components/OrderDetail.vue';
import AddressList from './components/AddressList.vue';
import AddressEdit from './components/AddressEdit.vue';
import My from './components/My.vue';

const routes = [
    {
        name: 'index',
        path: '/',
        component: Index
    },
    {
        name: 'sort',
        path: '/sort',
        component: Sort
    },
    {
        name: 'list',
        path: '/list/:sort_id',
        component: List
    },
    {
        name: 'detail',
        path: '/detail/:product_id',
        component: Detail
    },
    {
        name: 'cart',
        path: '/cart',
        component: Cart
    },
    {
        name: 'order',
        path: '/order',
        component: Order
    },
    {
        name: 'orderList',
        path: '/orderList',
        component: OrderList
    },
    {
        name: 'orderDetail',
        path: '/orderDetail/:order_number',
        component: OrderDetail
    },
    {
        name: 'addressList',
        path: '/addressList',
        component: AddressList
    },
    {
        name: 'addressEdit',
        path: '/addressEdit',
        component: AddressEdit
    },
    {
        name: 'my',
        path: '/my',
        component: My
    }
];

export default new Router({
    routes
});