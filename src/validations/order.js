import * as yup from 'yup';

const orderItems = yup
    .array()
    .required('Order Item cannot be empty.')
    .min(1, 'order Item of the Order should have atleast 5 characters.')
    
const user_id = yup
    .string()
    .required('Client id of the Order is required.')
    .min(2, 'Client id of the Order should have atleast 5 characters.')
    .max(200, 'Client id of the Order should have atmost 3000 characters.');

    const paymentMethod = yup
    .string()
    .required('paymentMethod of the Order is required.')
    .min(2, 'paymentMethod of the Order should have atleast 5 characters.')
    .max(30, 'paymentMethod of the Order should have atmost 3000 characters.');

    const shippingPrice = yup
    .number()
    .required('shippingPrice of the Order is required.')
    .min(1, 'shippingPrice of the Order should have atleast 5 characters.')
    .max(3000, 'shippingPrice of the Order should have atmost 3000 characters.');

    const taxPrice = yup
    .number()
    .required('taxPrice of the Order is required.')
    .min(1, 'taxPrice of the Order should have atleast 5 characters.')
    .max(300, 'taxPrice of the Order should have atmost 3000 characters.');

    const totalPrice = yup
    .number()
    .required('totalPrice of the Order is required.')
    .min(1, 'totalPrice of the Order should have atleast 5 characters.')
    .max(300, 'totalPrice of the Order should have atmost 3000 characters.');

    const shippingAddress = yup
    .object({
        address: yup.string().required('address of the user is required.')
        .min(1, 'address of the user should have atleast 5 characters.')
        .max(30, 'address of the user should have atmost 3000 characters.')
        ,
        tel: yup.string().required('tel of the Order is required.')
        .min(1, 'tel of the Order should have atleast 5 characters.')
        .max(30, 'tel of the Order should have atmost 3000 characters.'),

        email: yup.string().required('email of the user is required.')
        .email('This is invalid email.')
    })
  
export const NewOrderRules = yup
    .object()
    .shape({
        orderItems,
        user_id,
        paymentMethod,
        shippingPrice,
        taxPrice,
        shippingAddress,
        totalPrice
    });