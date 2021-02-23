import httpClient from '.';
const API_CONTROLLER = 'User/';

export default {
    login(data) {
        let url = API_CONTROLLER + 'Login';
        return httpClient.post(url, data);
    },

    registry(data) {
        let url = API_CONTROLLER + 'Registry';
        return httpClient.post(url, data);
    },

}