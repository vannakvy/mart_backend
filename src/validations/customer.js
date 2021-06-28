import * as yup from "yup";


const name = yup
  .string()
  .required("name of the Customer is required.")
  .min(2, "name of the Customer should have atleast 5 characters.")
  .max(30, "name of the Customer should have atmost 30 characters.");

const address = yup
  .string()
  .required("address of the Customer is required.")
  .min(2, "address of the Customer should have atleast 5 characters.")
  .max(200, "address of the Customer should have atmost 30 characters.");

const lat = yup.number()
  .required("lat of the Customer is required.")


  const tel = yup.string()
  .required("tel of the Customer is required.")
  .min(2, "tel of the Customer should have atleast 5 characters.")
  .max(30, "tel of the Customer should have atmost 30 characters.");

const long = yup
  .number()
  .required("long of Supplier is required.")

  const uid = yup
  .string()
  .required("String of Supplier is required.")


const customerImage = yup
  .string()
  .required("customer Image of the Supplier is required.")
  .min(2, "customer Image of the Supplier should have atleast 5 characters.")
  .max(50, "customer Image of the Supplier should have atmost 3000 characters.");

export const NewCustomerRules = yup.object().shape({
  uid,
    name,
    tel,
    long,
    lat,
    address,
    customerImage
});
