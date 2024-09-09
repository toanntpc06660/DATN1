export const ROUTERS = {
    GUEST: {
        HOME: "/",
        PRODUCTS: "/products",
        PRODUCTDETAILS: '/productdetails/:productid',
        CART: "/cart",
        FAVOURITE: "/favourite",
        CONTACT: "/contact",
        FORGOTPASSWORD: "/forgotpassword",
        SIGNIN: "/signIn",
        SIGNUP: "/signUp",
    },
    ADMIN: {
        HOME: "/admin",
        USERS: "/admin/users",
        CATEGORY: "/admin/category",
        PRODUCTS: "/admin/products",
        ORDERS: "/admin/orders",
        ORDERDETAILS: "/admin/orders/details/:orderId",
        PRODUCTSIZE: "/admin/productsize/"
    },
    USER: {
        PROFILE: "/myAcc/profile/:id",
        CHECKOUT: "/cart/checkout",
        ORDER: "/myAcc/Order/:id",
        ORDERDETAILS: "/myAcc/OrderDetails/:orderId",
        PAYMENT: "/cart/payment-result"
    }
};
