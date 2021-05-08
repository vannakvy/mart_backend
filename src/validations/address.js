import * as yup from 'yup';

const houseNumber = yup
    .number()
    .required('houseNumber of Blog is required.')
    .min(1, 'houseNumber of the Blog should have atleast 5 characters.')
    .max(50, 'houseNumber of the Blog should have atmost 50 characters.');

const village = yup
    .string()
    .required('village of the Blog is required.')
    .min(2, 'village of the Blog should have atleast 5 characters.')
    .max(30, 'village of the Blog should have atmost 30 characters.');

    const commune = yup
    .string()
    .required('commune of the Blog is required.')
    .min(2, 'commune of the Blog should have atleast 5 characters.')
    .max(30, 'commune of the Blog should have atmost 30 characters.');

  
    const district = yup
    .string()
    .required('district of the Blog is required.')
    .min(2, 'district of the Blog should have atleast 5 characters.')
    .max(30, 'district of the Blog should have atmost 30 characters.');

    const province = yup
    .string()
    .required('province of the Blog is required.')
    .min(2, 'province of the Blog should have atleast 5 characters.')
    .max(30, 'province of the Blog should have atmost 30 characters.');


export const NewAddressRules = yup
    .object()
    .shape({
        houseNumber,
        village,
        commune,
        district,
        province,
    });