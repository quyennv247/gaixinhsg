import httpClient from '.';
const API_CONTROLLER = 'User/';

export default {
    edit(data) {
        let url = API_CONTROLLER + 'Edit';
        return httpClient.post(url, data);
    },

    getInfo() {
        return httpClient.get(API_CONTROLLER + 'GetInfo');
    },

    changePassword(password, newPassword) {
        let url = API_CONTROLLER + 'ChangePassword';
        return httpClient.get(url, {
            params: {
                password: password,
                newPassword: newPassword
            }
        });
    },

}