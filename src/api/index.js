import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const httpClient = axios.create({
    baseURL: 'https://api.gaixinhsg.info/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': "application/json",
    }
});

export const authInterceptor = async (config) => {
    const accessToken = await AsyncStorage.getItem("access_token");
    config.headers['Authorization'] = 'Bearer ' + accessToken;
    return config;
}

httpClient.interceptors.request.use(authInterceptor);

const errorInterceptor = error => {
    console.log('errorInterceptor');
    console.log(error);
    if(error == 'Error: Network Error'){
        console.log(error);
    }
    else{
        switch(error.response.status) {
            case 405:
                break;
            case 400:
                break;
            case 500:
                break;
            case 401: 
                break;
    
            default:
                console.log(error.response.status, error.message);
        }
    }
    
    return Promise.reject(error);
}

// Interceptor for responses
const responseInterceptor = response => {
    switch(response.status) {
        case 200: 
            // yay!
            break;
        // any other cases
        default:
            // default case
    }

    return response.data;
}

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;
