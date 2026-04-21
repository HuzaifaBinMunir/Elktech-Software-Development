import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export async function fetchPosts() {
  const response = await api.get("/posts");
  return response.data.posts;
}