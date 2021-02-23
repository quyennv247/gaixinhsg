import httpClient from '.';
const API_CONTROLLER = 'Chat/';

export default {
    filter(pageIndex, pageSize, userName) {
        let url = API_CONTROLLER + 'Filter';
        return httpClient.get(url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                userName: userName
            }
        });
    },

    getChats(chatId) {
        let url = API_CONTROLLER + 'GetChats';
        return httpClient.get(url, {
            params: {
                chatId: chatId
            }
        });
    },

    getChat(userId) {
        let url = API_CONTROLLER + 'GetChat';
        return httpClient.get(url, {
            params: {
                userId: userId
            }
        });
    },

    add(data) {
        let url = API_CONTROLLER + 'Add';
        return httpClient.post(url, data);
    },

}