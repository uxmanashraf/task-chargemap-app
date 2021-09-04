import axios from 'axios';

export const serverApi = axios.create({
    baseURL: 'https://api.openchargemap.io/v3/poi'
});