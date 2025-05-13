import { AxiosError } from 'axios'

export const axiosErrorHandler = (error: unknown, title: string) => {
  if (error instanceof AxiosError && error.response) {
    console.error(`From ${title}, Axios error - ${error.response.status}: ${error.response.statusText}`, {
      data: error.response.data,
      headers: error.response.headers
    })

    return error.response.data // ⬅️ return this
  } else if (error instanceof AxiosError && error.request) {
    console.error(`From ${title}, Request made, but no response received:`, error.request)
  } else if (error instanceof Error) {
    console.error(`From ${title}, Error:`, error.message)
  } else {
    console.error(`From ${title}, An unknown error occurred`, error)
  }

  return { code: 'ERROR', message: 'Unknown error occurred' } // optional fallback
}
