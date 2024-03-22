import axios from "axios";
import defaultURL from "./apiSettings";

const URL = `${defaultURL}/songs`;

class SongApi {
  static async get() {
    return await axios.get(`${URL}`);
  }

  static async getById(id) {
    return await axios.get(`${URL}/${id}`);
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

  static async getSingers(id) {
    return await axios.get(`${URL}/${id}/singers`);
  }

  static async deleteSinger(songId, singerId) {
    await axios.put(`${URL}/${songId}/singers/delete`, {
      singerId: singerId,
    });
  }
  
  static async addSinger(songId, singerId) {
    await axios.put(`${URL}/${songId}/singers/add`, {
      singerId: singerId,
    });
  }
}

export default SongApi;
