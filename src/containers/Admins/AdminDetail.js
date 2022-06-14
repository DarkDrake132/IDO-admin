import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert";
import axios from "axios";
import AdminForm from "../../components/AdminForm/AdminForm";
import UserForm from "../../components/UserForm/UserForm";
import { ADMIN_DETAIL_SKELETON } from "../../utils/adminUtil";
import { GET_ADMIN } from "../../utils/apiPaths";



const AdminDetail = () => {
    const navigate = useNavigate();
    const [username] = useState(useParams().username);
    const newAD_DETAIL_SKELETON = ADMIN_DETAIL_SKELETON;
    delete newAD_DETAIL_SKELETON.Password
    const [userDetails, setUserDetails] = useState([newAD_DETAIL_SKELETON]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
          .get(
            GET_ADMIN(username),
            {
              headers:{
                "Authorization": JSON.parse(localStorage.getItem('user'))?.user.token,
                "User": JSON.parse(localStorage.getItem('user'))?.user.user.Username
              }
            }
          )
          .then((res) => {
            
            console.log(res.data);
            userDetails[0].Fullname.value = res.data.Name;
            userDetails[0].Username.value = res.data.Username;
            console.log(userDetails);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }, []);

    return (
        <AdminForm 
            userDetails={userDetails} setUserDetails={setUserDetails}
            newUserDetail={ADMIN_DETAIL_SKELETON}
        />
    )
}

export default AdminDetail