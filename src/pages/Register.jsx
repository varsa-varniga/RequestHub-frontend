import { useState } from "react";
import API from "../api/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/users", form);

    alert("User created!");
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}/>

        <input placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}/>

        <input type="password" placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}/>

        <select onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button>Create</button>
      </form>
    </div>
  );
}

export default Register;