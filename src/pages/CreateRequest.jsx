import { useState } from "react";
import API from "../api/api";

function CreateRequest() {

  const [req,setReq] = useState({
    title:"",
    description:"",
    type:"",
    urgency:"LOW"
  })

  const submit = async () => {

    await API.post("/user/requests",req);

    alert("Request created")

  }

  return (
    <div>

      <h2>Create Request</h2>

      <input placeholder="Title"
        onChange={(e)=>setReq({...req,title:e.target.value})} />

      <input placeholder="Description"
        onChange={(e)=>setReq({...req,description:e.target.value})} />

      <input placeholder="Type"
        onChange={(e)=>setReq({...req,type:e.target.value})} />

      <select onChange={(e)=>setReq({...req,urgency:e.target.value})}>
        <option>LOW</option>
        <option>MEDIUM</option>
        <option>HIGH</option>
      </select>

      <button onClick={submit}>Submit</button>

    </div>
  )
}

export default CreateRequest