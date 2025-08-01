import { SidebarMenu } from "./types";

export const commonMenu: SidebarMenu[] = [
    {
        title: '재고검색',
        submenu: [
            {label: '재고현황', path : '/stocks'},
        ],
    },
    {
        title: '진열위치 관리',
        submenu: [
            {label: '진열위치 관리', path: '/locations'},

        ],
    },
    {
        title: '수령하기',
        submenu: [
            {label: '수령 내역 조회', path: '/reception/confirmed'},
            {label: '수령 확인', path: '/reception/pending'},
        ],
    },
    {
        title: '발주하기',
        submenu:[
            {label: '발주 관리', path: '/purchase-order'}
        ]
    },
    {
        title: '정책 조회',
        submenu: [
            {label: '정책 전체조회', path: '/policies'},
        ],
    },
    {
        title: '베스트 셀러',
        submenu: [
            {label: '총합 베스트셀러', path: '/best-seller'},
            {label: '기간별 베스트셀러', path: '/best-seller/period'},
            {label: '카테고리별 베스트셀러', path: '/best-seller/category'},
        ],
    },
    {
        title: '도서 검색',
        submenu: [
            {label: '통합 검색', path: '/books/search'},
        ],
    },

];