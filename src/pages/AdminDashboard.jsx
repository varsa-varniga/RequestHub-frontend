import { useEffect,useState } from "react"
import API from "../api/api"

function AdminDashboard(){

  const [requests,setRequests] = useState([])

  useEffect(()=>{

    API.get("/admin/requests")
      .then(res=>setRequests(res.data))

  },[])

  const decide = async(id,decision)=>{

    await API.post(`/admin/requests/${id}/decision`,{
      decision:decision,
      comment:"Reviewed"
    })

    alert("Decision submitted")

  }

  return (

    <div>

      <h2>All Requests</h2>

      {requests.map(r=>(
        <div key={r.id}>

          <h3>{r.title}</h3>
          <p>{r.description}</p>

          <button onClick={()=>decide(r.id,"APPROVED")}>
            Approve
          </button>

          <button onClick={()=>decide(r.id,"REJECTED")}>
            Reject
          </button>

        </div>
      ))}

    </div>

  )
}

export default AdminDashboard