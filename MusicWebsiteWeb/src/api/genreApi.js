import axios from "axios";
import defaultURL from "./apiSettings";

const URL = `${defaultURL}/genres`;

class GenreApi {
  static async get() {
    return await axios.get(`${URL}`);
  }

  static async add(params) {
    await axios.post(`${URL}`, params);
  }

  static async delete(id) {
    await axios.delete(`${URL}/${id}`);
  }

  static async change(id, params) {
    await axios.put(`${URL}/${id}`, params);
  }
}

export default GenreApi;
