import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
export default {
  search(filter: any, page: number, limit: number) {
    return apiClient.post("/ingestor/search", {filters: filter ? filter : {}, page: page, limit: limit});
  },
  ingestDataWithFile(fileData: any) {
    return apiClient.postForm("/ingestor/json-file", fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  ingestDataBulk(logs: any) {
    return apiClient.post('/ingestor/bulk', logs)
  }
};
