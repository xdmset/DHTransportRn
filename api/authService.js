import axios from 'axios';
import { apiURL } from './apiGlobal';


export async function logIn(user) {
  const _apiURL = `${apiURL}/api/login`;
  try {

    const response = await axios.post(_apiURL + "/api/user", user);
    console.log(response.data.status);

    if (response.data.status === 0) {
      store.storeData("user", response.data.user);
      return true;
    }

    if (response.data.status === 1) {
      return false;
    }
    
  } catch (err) {
    console.log(err);
  }
}
