import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import "./FileUpload.css";

export default function FileUpload({ contract, account, provider }) {
  const [file, setFile] = useState(null);
  const[fileName, setFileName] = useState("No image selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(file){
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `ee9c858cc1a41bfd98b1`,
            pinata_secret_api_key: `805c61be72340085cd7948d12eb2f83f2cbc892b8a836855c106847706c20312`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.addFile(account,ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (error) {
        alert("Unable to upload image to Pinata");
      }
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    // console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <div className='top'>
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className='choose'>
          Choose Image
        </label>
        <input type="file" disabled={!account} id='file-upload' name='data' onChange={retrieveFile} />
        <span className='textArea'>Image: {fileName}</span>
        <button type='submit' className='upload' disabled={!file}>Upload file</button>
      </form>
    </div>
  )
}