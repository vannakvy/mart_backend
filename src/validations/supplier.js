import * as yup from "yup";

const houseNumber = yup.number().required("houseNumber of Blog is required.");
const village = yup
  .string()
  .required("village of the Blog is required.")
  .min(2, "village of the Blog should have atleast 5 characters.")
  .max(30, "village of the Blog should have atmost 30 characters.");
//   const gender = yup
//   .string()
//   .required("gender of the Blog is required.")
//   .min(1, "gender of the Blog should have atleast 5 characters.")
//   .max(30, "gender of the Blog should have atmost 30 characters.");
//   const imageUrl = yup
//   .string()
//   .required("imageUrl of the Blog is required.")
//   .min(2, "imageUrl of the Blog should have atleast 5 characters.")
//   .max(30, "imageUrl of the Blog should have atmost 30 characters.");
const commune = yup
  .string()
  .required("commune of the Blog is required.")
  .min(2, "commune of the Blog should have atleast 5 characters.")
  .max(30, "commune of the Blog should have atmost 30 characters.");

const district = yup
  .string()
  .required("district of the Blog is required.")
  .min(2, "district of the Blog should have atleast 5 characters.")
  .max(30, "district of the Blog should have atmost 30 characters.");

const province = yup
  .string()
  .required("province of the Blog is required.")
  .min(2, "province of the Blog should have atleast 5 characters.")
  .max(30, "province of the Blog should have atmost 30 characters.");
const firstName = yup
  .string()
  .required("firstName of Supplier is required.")
  .min(2, "firstName of the Supplier should have atleast 5 characters.")
  .max(50, "firstName of the Supplier should have atmost 50 characters.");

const lastName = yup
  .string()
  .required("lastName of the Supplier is required.")
  .min(2, "lastName of the Supplier should have atleast 5 characters.")
  .max(50, "lastName of the Supplier should have atmost 3000 characters.");

const tel = yup
  .string()
  .required("Phone Number of the Supplier is required.")
const email = yup
  .string()
  .required("Email is required.")
  .email("This is invalid email.");

export const NewSupplierRules = yup.object().shape({
  firstName,
  lastName,
  tel,
  houseNumber,
  village,
  commune,
  district,
  province,
  email,

});
