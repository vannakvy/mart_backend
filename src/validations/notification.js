import * as yup from "yup";

const eventType = yup
  .string()
  .required("evenType of the Blog is required.")
  .min(1, "evenType of the Blog should have atleast 5 characters.")
  .max(30, "evenType of the Blog should have atmost 30 characters.");

const user = yup
  .string()
  .required("user of the Blog is required.")
  .min(2, "user of the Blog should have atleast 5 characters.")
  .max(30, "user of the Blog should have atmost 30 characters.");

const message = yup
  .string()
  .required("message of the Blog is required.")
  .min(2, "message of the Blog should have atleast 5 characters.")
  .max(300, "message of the Blog should have atmost 30 characters.");
const allClent = yup
  .boolean()
  
export const NewNotificationRules = yup.object().shape({
    eventType,
    allClent,
    user,
    message

});
