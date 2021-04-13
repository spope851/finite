import { useEffect, useState } from "react"

const Axios = require('axios');
const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

export const useData = (service: string, endpoint:string, body?: any, headers?: any) => {
  const [data, setData] = useState<any>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const endPoint = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/${endpoint}`
  let payLoad: any
  if(headers) payLoad = { cancelToken: source.token, headers }
  if(body) payLoad = { cancelToken: source.token, ...body}
  
  
  useEffect(() => {
  const fetchData = async () => {
    // let response
    // if (service === 'get') response = await Axios.get(endPoint, payLoad)
    // else if (service === 'post') response = await Axios.post(endPoint, payLoad)
    // else if (service === 'put') response = await Axios.put(endPoint, payLoad)
    // else response = await Axios.delete(endPoint, payLoad)
    try {
      const response = await fetch(endPoint, {method: service, headers: new Headers(headers), body: body})
      const jsnData = await response.json()
      console.log(jsnData)
      setData(jsnData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

    fetchData()
  }, [body, endPoint, headers, service])


  return {data, loading, error}

}