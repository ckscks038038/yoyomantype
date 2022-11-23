import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogOutButton = ({ className }) => {
  const navigate = useNavigate();

  const LogOut = () => {
    //清空在localStorage的 jwt Token
    setTimeout(() => {
      navigate(`/account`);
    }, 1200);
    toast.success('🦄 logout successfully!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      toastId: "Room doesn't exist.",
    });
    localStorage.removeItem('jwtToken');
  };
  return (
    <>
      {localStorage.getItem('jwtToken') ? (
        <button
          onClick={LogOut}
          className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className} `}>
          <FiLogOut className="h-10 w-10"></FiLogOut>
        </button>
      ) : null}
    </>
  );
};

export default LogOutButton;
