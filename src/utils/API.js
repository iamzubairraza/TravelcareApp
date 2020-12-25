import Preference from 'react-native-preference'
import preferenceKeys from './preferenceKeys'
import axios from "axios";

// const BASE_URL = 'https://google.com'
const BASE_URL = 'https://travel.crmstock.io'
const ROUTE = '/api'

const API_URL = BASE_URL + ROUTE

export const API = {
    //POST TRAVELER
    TRAVELER_SIGN_UP: API_URL + '/traveler-sign-up',
    COMPANY_SIGN_UP: API_URL + '/company-sign-up',
    ADMIN_LOGIN: API_URL + '/admin-login',
    ADMIN_LOGIN1: API_URL + '/login',
    TRAVELER_LOGIN: API_URL + '/traveler-login',
    COMPANY_LOGIN: API_URL + '/company-login',
    UPDATE_TRAVELER_PROFILE: API_URL + '/update-traveler-profile',
    UPDATE_COMPANY_PROFILE: API_URL + '/update-company-profile',
    CHANGE_PASSWORD: API_URL + '/change-password',
    SEND_FORGOT_PASSWORD_EMAIL: API_URL + '/forgot-password-email',
    VERIFY_CODE: API_URL + '/verify-code',
    RESET_PASSWORD: API_URL + '/reset-password',
    CREATE_OFFER: API_URL + '/create-offer',
    SEND_OFFER: API_URL + '/send-offer',

    //GET
    GET_PROFILE: API_URL + '/get-profile',
    GET_ORGANIZATIONS: API_URL + '/get-organizations',
    GET_SERVICES: API_URL + '/get-services',
    GET_TRAVELERS: API_URL + '/get-travelers',
    GET_TRAVELER_DETAILS: API_URL + '/get-traveler',
    GET_COMPANY_OFFERS: API_URL + '/get-company-offers',
    GET_ACCEPTED_OFFERS: API_URL + '/get-accepted-offers',
    GET_MANAGE_OFFERS: API_URL + '/get-manage-offers',
    GET_OFFER_RECIPIENTS: API_URL + '/get-offer-recipents',
    LOGOUT: API_URL + '/logout',
}

export const requestPost = (url, data, extraHeaders = {}, extraOpptions = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url,
            data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": 'multipart/form-data',
                ...extraHeaders
            },
            ...extraOpptions
        }).then(response => {
            console.log('API', 'requestPost-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestPost-error', error);
            reject(error);
        });
    });
}

export const requestPostWithToken = (url, data, extraHeaders = {}, extraOpptions = {}) => {
    const AUTH_TOKEN = Preference.get(preferenceKeys.AUTH_TOKEN)
    return new Promise((resolve, reject) => {
        axios.post(url,
            data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": 'multipart/form-data',
                "Authorization": AUTH_TOKEN,
                ...extraHeaders
            },
            ...extraOpptions
        }).then(response => {
            console.log('API', 'requestPostWithToken-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestPostWithToken-error', error);
            reject(error);
        });
    });
}

export const requestGet = (url, extraHeaders = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                "Accept": "application/json",
                ...extraHeaders
            }
        }).then(response => {
            console.log('API', 'requestGet-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestGet-error', error);
            reject(error);
        });
    });
}

export const requestGetWithToken = (url, extraHeaders = {}) => {
    const AUTH_TOKEN = Preference.get(preferenceKeys.AUTH_TOKEN)
    // console.log('API', 'requestGetWithToken-token', AUTH_TOKEN);
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": AUTH_TOKEN,
                ...extraHeaders
            }
        }).then(response => {
            console.log('API', 'requestGetWithToken-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestGetWithToken-error', error);
            reject(error);
        });
    });
}
