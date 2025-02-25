'use client'

import { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

export default page
