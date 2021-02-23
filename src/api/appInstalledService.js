import httpClient from '.';
const API_CONTROLLER = 'AppInstalled/';

export default {
    add(data) {
        let url = API_CONTROLLER + 'Add';
        return httpClient.post(url, data);
    }

}