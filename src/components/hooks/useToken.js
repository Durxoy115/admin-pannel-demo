

import { useNavigate } from 'react-router-dom';


const useToken= () =>{
  // const url = "https://admin.zgs.co.com"
  const url = "http://192.168.0.131:8002" 
  
  const navigate = useNavigate(); // For navigation
  const getTokenLocalStorage = ()=>{
    const token  = localStorage.getItem("office_token");
    if (!token){
        navigate("/login");
    }
    return token;
  }
    return[url,getTokenLocalStorage];
}

export default useToken;
// src/hooks/useToken.jsx
// import { useNavigate } from 'react-router-dom';

// const useToken = () => {
//   const url = "https://admin.zgs.co.com";
//   // const url = "http://192.168.0.131:8002";
//   const navigate = useNavigate();

//   const getTokenLocalStorage = () => {
//     const token = localStorage.getItem("office_token");
//     const tokenExpiration = localStorage.getItem("tokenExpiration");

//     // Check if token exists and is not expired
//     if (!token) {
//       navigate("/login");
//       return null;
//     }

//     if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
//       // Token expired, clear storage and redirect
//       localStorage.removeItem("office_token");
//       localStorage.removeItem("tokenExpiration");
//       navigate("/login");
//       return null;
//     }

//     return token;
//   };

//   return [url, getTokenLocalStorage];
// };

// export default useToken;
