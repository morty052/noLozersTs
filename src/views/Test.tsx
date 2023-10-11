
import { useEffect, useState } from "react"

function Test() {

  const [imageUrl, setimageUrl] = useState()

  useEffect(() => {
    fetch("http://localhost:3000/image")
    .then((res) => res.json())
    .then(res => setimageUrl(res.imageUrl[0].url))
  }, [])
  

  return (
    <div>
       <img src={imageUrl} alt="" />
    </div>
  )
}

export default Test