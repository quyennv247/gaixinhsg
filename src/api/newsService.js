import httpClient from '.';
const API_CONTROLLER = 'News/';

export default {
    getById(id) {
        let url = API_CONTROLLER + 'GetById';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    getNews(pageIndex, pageSize, userId, categortId, title) {
        let url = API_CONTROLLER + 'GetNews';
        return httpClient.get(url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                userId: userId,
                categoryId: categortId,
                title: title
            }
        });
    }
}