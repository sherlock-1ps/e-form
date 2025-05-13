import Axios from "@/libs/axios/axios";
import { CreateGameProviderPayload, GameProviderUpdatePayload, ProviderUpdatePayload } from "@/types/provider/provider";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchProviders = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/provider/get", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching providers:", error);

    axiosErrorHandler(error, '/provider/get')
    throw error;

  }

};

export const fetchProviderType = async () => {
  try {
    const response = await Axios.get("/config/providerType");

    return response.data;

  } catch (error) {
    console.error("Error fetching provider type:", error);

    axiosErrorHandler(error, '/config/providerType')
    throw error;

  }

};

export const fetchProviderCurrency = async () => {
  try {
    const response = await Axios.get("/config/currencies");

    return response.data;

  } catch (error) {
    console.error("Error fetching provider currency:", error);

    axiosErrorHandler(error, '/config/currencies')
    throw error;

  }

};

export const searchProviders = async ({ page = 1, pageSize, search, type }: { page: number; pageSize: number; search: string; type: string }) => {
  try {
    const response = await Axios.post("/provider/search", {
      page: page,
      limit: pageSize,
      provider_name: search,
      category: type == "all" ? "" : type,
    });

    return response.data;
  } catch (error) {
    console.error("Error searching providers:", error);
    axiosErrorHandler(error, "/provider/search");

    throw error;
  }
};

export const updateProvider = async (payload: ProviderUpdatePayload) => {
  try {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await Axios.post("/provider/edit", filteredPayload);

    return response.data;
  } catch (error) {
    console.error("Error updating provider status:", error);
    axiosErrorHandler(error, "/provider/edit");

    throw error;
  }
};


export const fetchGameProvider = async ({ page, pageSize, provider_code }: { page: number; pageSize: number, provider_code: string }) => {
  try {
    const response = await Axios.post("/provider/getGame", {
      page,
      limit: pageSize,
      provider_code
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching game provider:", error);

    axiosErrorHandler(error, '/provider/getGame')
    throw error;

  }

};

export const searchGameProviders = async ({ page = 1, pageSize, provider_code, game_name }: { page: number; pageSize: number; provider_code: string; game_name: string }) => {
  try {
    const response = await Axios.post("/provider/searchGame", {
      page: page,
      limit: pageSize,
      provider_code,
      game_name
    });

    return response.data;
  } catch (error) {
    console.error("Error searching game providers:", error);
    axiosErrorHandler(error, "/provider/searchGame");

    throw error;
  }
};

export const updateGameProvider = async (payload: GameProviderUpdatePayload) => {
  try {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await Axios.post("/provider/editGame", filteredPayload);

    return response.data;
  } catch (error) {
    console.error("Error updating game provider:", error);
    axiosErrorHandler(error, "/provider/editGame");

    throw error;
  }
};

export const createGameProvider = async (payload: CreateGameProviderPayload) => {
  try {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await Axios.post("/provider/createGame", filteredPayload);

    return response.data;
  } catch (error) {
    console.error("Error Create Game Provider", error);
    axiosErrorHandler(error, "/provider/createGame");

    throw error;
  }
};


