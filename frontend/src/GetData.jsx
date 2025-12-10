import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetData = () => {
  const [data, setData] = useState([]);

  const API = "http://localhost:3000/students";

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(() => {
        console.log("error");
      });
  }, []);

  const handleDelte =(id)=>{
    axios.delete(`${API}/${id}`)
    window.location.reload();
  }

  return (
    <div>
      <Link to="/addData">
        {" "}
        <button>Add Data</button>
      </Link>
      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <th>id</th>
          <th>name</th>
          <th>age</th>
          <th>Action</th>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>
                <button>Edit</button>
                <button onClick={()=>handleDelte(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetData;
