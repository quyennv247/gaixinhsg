import httpClient from '../api';
const API_CONTROLLER = 'Girl/';

export default {
    getById(id) {
        let url = API_CONTROLLER + 'GetById';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    call(id) {
        let url = API_CONTROLLER + 'Call';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    getGirls(pageIndex, pageSize, categoryId, fromPrice, toPrice, title) {
        let url = API_CONTROLLER + 'GetGirls';
        return httpClient.get(url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                categoryId: categoryId,
                fromPrice: fromPrice,
                toPrice: toPrice,
                title: title
            }
        });
    }
}