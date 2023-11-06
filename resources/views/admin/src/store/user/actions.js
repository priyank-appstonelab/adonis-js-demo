import axios from "axios";

const API = process.env.VUE_APP_BASE_URI || `http://127.0.0.1:3000/admin`;

export default {
  index({ commit }, { per_page = 5, sort = "" }) {
    return new Promise((resolve, reject) => {
      let url = `${API}/users?sort=${sort}&per_page=${per_page}`;
      axios
        .get(url)
        .then(async ({ data }) => {
          commit("SET_USER", data);
          delete data.data;
          commit("SET_USER_META", data);
          resolve(data.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
  getSingle({ commit }, id) {
    return new Promise((resolve, reject) => {
      let url = `${API}/users/${id}`;
      axios
        .get(url)
        .then(async ({ data: { data } }) => {
          commit("SET_USER", data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
  createOrUpdate({ commit }, data) {
    return new Promise((resolve, reject) => {
      let url = `${API}/users${data && data.id ? `/${data.id}` : ""}`;
      let method =
        data && data.id ? axios.patch(url, data) : axios.post(url, data);
      method
        .then(async ({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },

  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      let url = `${API}/users/${id}`;
      axios
        .delete(url)
        .then(async ({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
};
