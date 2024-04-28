import axios from 'axios';
import { useEffect, useState } from 'react';

function useTokenInfo(tokenAddress: string, type: string, fetch = false) {
  const [isFetching, setIsFetching] = useState(false);
  const [tokenRequestInfo, setTokenRequestInfo] = useState(null);
  const [tokenInfo, settokenInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tokenAddress) return;

    setIsFetching(true);

    axios
      .get(`/api/token/info?address=${tokenAddress}&type=request`)
      .then(response => {
        // console.log(response.data);
        setTokenRequestInfo(response.data);

        if (fetch) {
          return axios.get(
            `/api/token/info?address=${tokenAddress}&type=${type}`
          );
        }
      })
      .then(response => {
        if (response) {
          settokenInfo(response.data);
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [tokenAddress, fetch]);

  return { isFetching, tokenRequestInfo, tokenInfo, error };
}

export default useTokenInfo;
