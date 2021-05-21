import axios from 'axios'
const ip = '192.168.1.107'

const instance = axios.create({
  baseURL: `http://${ip}:5000/api`
});

export default instance