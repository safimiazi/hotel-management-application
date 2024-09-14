import {auth} from "../../utils"
import { Navigate } from 'react-router-dom';

const LoginRoute = ({children}) => {
    
  
    if(auth !== null){
        return <Navigate to={`/`} />;
    }
 
    return children;
}

export default LoginRoute;