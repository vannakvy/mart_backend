import * as yup from 'yup';

const productName = yup
    .string()
    .required('Product Name of Blog is required.')
    .min(2, 'Product Name of the Blog should have atleast 5 characters.')
    .max(50, 'Product Name of the Blog should have atmost 50 characters.');
const productImage = yup
    .string()
    .required('Product Image of the Blog is required.')
    .min(2, 'Product Image of the Blog should have atleast 5 characters.')
    .max(200, 'Product Image of the Blog should have atmost 3000 characters.');

    const category = yup
    .string()
    .required('category of the Blog is required.')
    .min(2, 'category of the Blog should have atleast 5 characters.')
    .max(30, 'category of the Blog should have atmost 3000 characters.');

    const description = yup
    .string()
    .required('description of the Blog is required.')
    .min(2, 'description of the Blog should have atleast 5 characters.')
    .max(3000, 'description of the Blog should have atmost 3000 characters.');

export const NewProductRules = yup
    .object()
    .shape({
        productImage,
        productName,
        category,
        description
    });