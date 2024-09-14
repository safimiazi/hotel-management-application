import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { API_URL } from "../../../../config.json";
import { authHeaders } from "../../../../utils";
import axios from 'axios';


const CompanyProfile = () => {
  const [companyProfileData, companyProfileDataSet] = useState(null)

  useEffect(() => {
    getCompanyProfileData();
  }, []);

  const getCompanyProfileData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/CompanyProfile`, {
        headers: authHeaders,
      });
      companyProfileDataSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };


  return (
    <div className="py-5" style={{ borderBottom: '3px dotted #cecfce'}}>
      <div className='flex justify-start items-center gap-10' >
        <div className='ml-5'>
          <img  
            src={`${API_URL}${companyProfileData?.logo}`} 
            alt="Company Logo" 
            className={`h-20 w-20`}
          />
        </div>
        <div className='text-center'>
          <h4>{companyProfileData?.title}</h4>
          <p style={{whiteSpace:'pre-line'}}>{companyProfileData?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;