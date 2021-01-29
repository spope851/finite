import { useEffect, useState } from "react";
import { userProps } from "../components/user";

export const useGet = (endpoint:string) => {

  const [data, setData] = useState<userProps[]>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    // try {
    //   const response = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/${endpoint}`);
    //   const body = await response.json()
    //   setData(body)
    // } 
    // catch (error) {
    //   setError(error)
    // }
    // finally {
    //   setLoading(false)
    // }
  }

  return {data, loading, error, fetchData}

}