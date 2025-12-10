import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddData = () => {
  const API ="http://localhost:3000/students";
  
  const navigate = useNavigate();
    const [formData, setFormData] = useState({name:'',age:""})

    const handleSubmit =(e)=>{
        e.preventDefault();
        axios.post(API, formData)
        .then((res)=>{
            console.log(res.data)
            alert("Data Added Successfully")
            navigate('/')
        })
        .catch(()=>{
            console.log("error to add data")
        })
    }

  return (
    <div>
        <h1>AddData</h1>

        <form action="" onSubmit={handleSubmit}>
            <input 
            placeholder='name'
            value={formData.name}
            onChange={(e)=> setFormData({...formData, name:e.target.value})}
            />
            <br />
            <input 
            placeholder='age'
            value={formData.age}
            onChange={(e)=>setFormData({...formData, age:e.target.value})}
            />
            <br />
            <button type='submit'>Add Data</button>
        </form>
    </div>
  )
}

export default AddData