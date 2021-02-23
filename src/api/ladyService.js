import httpClient from '.';
const API_CONTROLLER = 'Lady/';

export default {
    getById(id) {
        let url = API_CONTROLLER + 'GetById';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    getLadys(pageIndex, pageSize, categoryId, title) {
        let url = API_CONTROLLER + 'GetLadys';
        return httpClient.get(url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                categoryId: categoryId,
                title: title
            }
        });
    }
}