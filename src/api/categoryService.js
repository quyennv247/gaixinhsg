import httpClient from '../api';
const API_CONTROLLER = 'Category/';

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
        return httpClient.get(API_CONTROLLER + 'GetAll?showMenu=true');
    },

    getChildren(parentId) {
        let url = API_CONTROLLER + 'GetCategories';
        return httpClient.get(url, {
            params: {
                parentId: parentId
            }
        });
    },
}