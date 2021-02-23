import httpClient from '../api';
const API_CONTROLLER = 'Album/';

export default {
    getById(id) {
        let url = API_CONTROLLER + 'GetById';
        return httpClient.get(url, {
            params: {
                id: id
            }
        });
    },

    getAlbums(pageIndex, pageSize, title) {
        let url = API_CONTROLLER + 'GetAlbums';
        return httpClient.get(url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                title: title
            }
        });
    }
}