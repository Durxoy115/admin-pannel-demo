

import { useNavigate } from 'react-router-dom';


const useToken= () =>{
  const url = "https://admin.zgs.co.com"
  // const url = "http://192.168.0.131:8002"
  
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