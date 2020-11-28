import axios from 'axios';

const instance = axios.create(
{
    baseURL: "https://codemate-gunjan768.herokuapp.com/",
    timeout: 10000,
})

export default instance;