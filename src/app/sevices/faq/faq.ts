import Axios from "@/libs/axios/axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchFaq = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/faq/get", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching faq:", error);

    axiosErrorHandler(error, '/faq/get')
    throw error;
  }

};

export const searchFaq = async ({ page, pageSize, title }: { page: number; pageSize: number, title: string }) => {
  try {
    const response = await Axios.post("/faq/search", {
      page,
      limit: pageSize,
      title
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching search faq:", error);

    axiosErrorHandler(error, '/faq/search')
    throw error;
  }

};

export const createFaq = async ({ title, body }: { body: string, title: string }) => {
  try {
    const response = await Axios.post("/faq/create", {
      title,
      body
    });

    return response.data;

  } catch (error) {
    console.error("Error create faq:", error);

    axiosErrorHandler(error, '/faq/create')
    throw error;
  }

};



