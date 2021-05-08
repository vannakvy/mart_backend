import * as yup from 'yup';

const firstName = yup
    .string()
    .required('firstName of Supplier is required.')
    .min(2, 'firstName of the Supplier should have atleast 5 characters.')
    .max(50, 'firstName of the Supplier should have atmost 50 characters.');

const lastName = yup
    .string()
    .required('lastName of the Supplier is required.')
    .min(2, 'lastName of the Supplier should have atleast 5 characters.')
    .max(50, 'lastName of the Supplier should have atmost 3000 characters.');

    const tel = yup
    .string()
    .required('Phone Number of the Supplier is required.')
    .min(2, 'Phone Number of the Supplier should have atleast 5 characters.')
    .max(20, 'Phone Number of the Supplier should have atmost 3000 characters.');

export const NewSupplierRules = yup
    .object()
    .shape({
        firstName,
        lastName,
        tel,
    });

