'use client'

import { useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";

const page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      fetch("/api/hello")
        .then((res) => res.json())
        .then((data) => setData(data));
    } catch (error) {
      console.log(error)
    }
  }, []);

  return (
    <div>
      {JSON.stringify(data, null, 2)}
      <ConnectWallet />
    </div>
  )
}

export default page
