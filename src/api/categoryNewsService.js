import httpClient from '../api';
const API_CONTROLLER = 'CategoryNews/';

export default {
    getById(id) {
        let url = API_CONTROLLER + 'GetById';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    getAll() {
        return httpClient.get(API_CONTROLLER + 'GetAll');
    },
}