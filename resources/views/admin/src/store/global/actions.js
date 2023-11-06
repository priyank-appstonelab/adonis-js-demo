import axios from 'axios';

const API = process.env.VUE_APP_BASE_URI || 'http://127.0.0.1:3000/admin';

export default {

  updateProfile({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      let url = `${API}/auth/complete`;
      axios.patch(url, data)
        .then(async ({
          data
        }) => {

          resolve(data);
        })
        .catch((error) => {
          reject(error.response)
        });
    });
  },


}
