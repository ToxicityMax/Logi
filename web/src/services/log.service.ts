import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
export default {
  search(filter: any, page: number, limit: number) {
    return apiClient.post("/ingestor/search", {filters: filter? filter:{}, page: page, limit: limit});
  },
  ingestDataWithFile(file: any){
    return apiClient.postForm("/ingestor/file",file )
  },
  ingestDataBulk(logs:any){
    return apiClient.post('/ingestor/bulk', logs)
  }
};
