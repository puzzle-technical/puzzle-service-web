import { useState, useEffect } from "react"
import api from '../../api'

import UploadImage from '../../components/uploadImage'

export default function UserSignUp () {

  const [file, setFile] = useState()

  const upload = event => {
    event.preventDefault()
    const fileMaxSize = 1000000

    if (!file || file.size > fileMaxSize) return
    var formdata = new FormData()
    formdata.append('file', file)
    
    const userId = 12
    api.post(`/users/uploadPicture/${userId}`, formdata, { 
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    console.log(file)
  }, [file])

  return <form onSubmit={upload}>
    <UploadImage value={file} onInput={e => setFile(e.target.files[0])}></UploadImage>
  </form>
}