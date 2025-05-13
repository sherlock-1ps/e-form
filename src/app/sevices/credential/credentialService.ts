import Axios from "@/libs/axios/axios";
import { AddCredentialProviderPayload, CreateCredentialPayload, ProviderCredenitalExistPayload, SearchCredentialProviderListPayload, SearchGameCredentialProviderListPayload } from "@/types/credential/credentialTypes";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const fetchCredential = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/credential/getList", {
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching credential:", error);

    axiosErrorHandler(error, '/credential/getList')
    throw error;

  }

};

export const searchCredential = async ({ credential_prefix, page, pageSize }: { credential_prefix: string, page: number; pageSize: number }) => {
  try {
    const response = await Axios.post("/credential/search", {
      credential_prefix,
      page,
      limit: pageSize,
    });

    return response.data;

  } catch (error) {
    console.error("Error search credential:", error);

    axiosErrorHandler(error, '/credential/search')
    throw error;

  }

};

export const updateStatusCredential = async ({ credential_id, is_enable }: { credential_id: string; is_enable: boolean }) => {
  try {
    const response = await Axios.patch("/credential/update/status", {
      credential_id,
      is_enable
    });

    return response.data;

  } catch (error) {
    console.error("Error update status credential:", error);

    axiosErrorHandler(error, '/credential/update/status')
    throw error;

  }

};

export const createCredential = async (payload: CreateCredentialPayload) => {
  try {
    const response = await Axios.post("/credential/create", payload);

    return response.data;

  } catch (error) {
    console.error("Error create credential:", error);

    const e = axiosErrorHandler(error, '/credential/create')
    throw e;

  }

};


export const fetchProviderCredenitalExist = async (payload: ProviderCredenitalExistPayload) => {
  try {
    const response = await Axios.post("/credential/provider/getList", payload);

    return response.data;

  } catch (error) {
    console.error("Error fetch provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/provider/getList')
    throw e;

  }

};

export const searchProviderCredenitalExist = async (payload: SearchCredentialProviderListPayload) => {
  try {
    const response = await Axios.post("/credential/provider/search", payload);

    return response.data;

  } catch (error) {
    console.error("Error search provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/provider/search')
    throw e;

  }

};

export const updateStatusProviderCredenitalExist = async ({ provider_credential_id, is_enable }: { is_enable: boolean, provider_credential_id: string }) => {
  try {
    const response = await Axios.patch("/credential/provider/update/status", {
      provider_credential_id,
      is_enable
    });

    return response.data;

  } catch (error) {
    console.error("Error updata status provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/provider/update/status')
    throw e;

  }

};

export const fetchNewGameProviderCredenital = async ({ credential_id }: { credential_id: string }) => {
  try {
    const response = await Axios.post("/credential/provider/new/getList", { credential_id });

    return response.data;

  } catch (error) {
    console.error("Error fetch new game provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/provider/new/getList')
    throw e;

  }

};

export const addNewProviderCredential = async (payload: AddCredentialProviderPayload) => {
  try {
    const response = await Axios.post("/credential/provider/add", payload);

    return response.data;

  } catch (error) {
    console.error("Error add new provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/provider/add')
    throw e;

  }

};

export const fetchGameProvider = async ({ provider_credential_id, page, pageSize }: { provider_credential_id: string, page: number, pageSize: number }) => {
  try {
    const response = await Axios.post("/credential/game/getList", { provider_credential_id, page, limit: pageSize });

    return response.data;

  } catch (error) {
    console.error("Error fetch game provider credential:", error);

    const e = axiosErrorHandler(error, '/credential/game/getList')
    throw e;

  }

};

export const searchGameProvider = async ({ provider_credential_id, page, pageSize, game_name }: { provider_credential_id: string, page: number, pageSize: number, game_name: string }) => {
  try {
    const response = await Axios.post("/credential/game/search", { provider_credential_id, page, limit: pageSize, game_name });

    return response.data;

  } catch (error) {
    console.error("Error search game  credential:", error);

    const e = axiosErrorHandler(error, '/credential/game/search')
    throw e;

  }

};


export const updateGameStatus = async ({ game_credential_id, is_enable }: { game_credential_id: string, is_enable: boolean }) => {
  try {
    const response = await Axios.patch("/credential/game/update/status", { game_credential_id, is_enable });

    return response.data;

  } catch (error) {
    console.error("Error updata status game:", error);

    const e = axiosErrorHandler(error, '/credential/game/update/status')
    throw e;

  }

};

