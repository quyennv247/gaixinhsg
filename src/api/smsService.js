import httpClient from '../api';
const API_CONTROLLER = 'SMS/';

export default {
    getPhone(userName) {
        let url = API_CONTROLLER + 'GetPhone';
        return httpClient.get(url, {
            params: {
                userName: userName
            }
        });
    },

    sendOTP(userId, phoneNumber) {
        let url = API_CONTROLLER + 'SendOTP';
        return httpClient.get(url, {
            params: {
                userId: userId,
                phoneNumber: phoneNumber
            }
        });
    },

    updatePassword(userId, otp, password) {
        let url = API_CONTROLLER + 'UpdatePassword';
        return httpClient.get(url, {
            params: {
                userId: userId,
                password: password,
                otp: otp
            }
        });
    },
}