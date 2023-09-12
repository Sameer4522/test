import axios, { AxiosResponse } from 'axios'
import https from 'https'
import { URLS } from './config'

const headerData = () => {
  return {
    'Access-Control-Allow-Origin': '*'
  }
}

const instance = axios.create({
  timeout: 30000,
  headers: headerData(),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

const responseBody = (response: AxiosResponse) => {
  return response
}

const errorBody = (err: any) => {
  console.log('errorBody', err)
  if (err.code === 'ERR_NETWORK') {
    return {
      message: 'Please check internet connectivity, then retry!',
      status: 501
    }
  } else if (err.code === 'ERR_BAD_RESPONSE') {
    if (err.response.data.code) {
      return {
        message: 'Please contact support, issue in server',
        status: 501
      }
    } else if (err.response.data.message) {
      return {
        message: err.response.data.message,
        status: err.response.data.status
      }
    } else {
      return {
        message: 'Please contact support, something wrong with server',
        status: 501
      }
    }
  } else if (err.code === 'ERR_BAD_REQUEST') {
    if (err.response.data.message) {
      return {
        message:
          typeof err.response.data.message === `string`
            ? err.response.data.message
            : JSON.stringify(err.response.data.message),
        status: err.response.data.status
      }
    } else if (typeof err.response.data === 'string') {
      return {
        message: err.response.data,
        status: err.response.status
      }
    } else {
      return {
        message: 'Oops, Something went wrong!',
        status: err.response.status
      }
    }
  }
}

const request = {
  get: (url: string, headers: any = { ...headerData() }) =>
    instance.get(url, { headers }).then(responseBody).catch(errorBody),
  post: (url: string, body: any, headers: any = { ...headerData() }) =>
    instance.post(url, body, { headers }).then(responseBody).catch(errorBody),
  put: (url: string, body: any, headers: any = { ...headerData() }) =>
    instance.put(url, body, { headers }).then(responseBody).catch(errorBody),
  patch: (url: string, body: any, headers: any = { ...headerData() }) =>
    instance.patch(url, body, { headers }).then(responseBody).catch(errorBody)
}

export const AUTH = {
  login: (data: { username: string; password: string }) => request.post(URLS.LOGIN, data)
}
