import { CgSpinner } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const Account = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      console.log('可以render');
      navigate(`/profile`, {
        state: { identity: 'owner', name: 'ckscks038038', created_on: 123 },
      });
    } else {
      console.log('不可以render');
    }
  }, []);
  const SignupUrl = 'http://localhost:3000/api/1.0/user/signup';
  const SigninUrl = 'http://localhost:3000/api/1.0/user/signin';

  // SignUp, SignIn data
  const [signupData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [signinData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SignupUrl, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      const token = response.data.data.access_token;
      localStorage.setItem('jwtToken', token);
      toast.success('🦄 register successfully!', {
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
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    } catch (err) {
      toast.error('🦄 Email exists!', {
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
      return 0;
    }
  };
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SigninUrl, {
        email: signinData.email,
        password: signinData.password,
      });
      const token = response.data.data.access_token;
      localStorage.setItem('jwtToken', token);
      toast.success('🦄 login successfully!', {
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
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSignUpChange = (e) => {
    const newdata = { ...signupData };
    newdata[e.target.id] = e.target.value;
    setSignUpData(newdata);
  };
  const handleSignInChange = (e) => {
    const newdata = { ...signinData };
    newdata[e.target.id] = e.target.value;
    setSignInData(newdata);
  };
  if (!localStorage.getItem('jwtToken')) {
    return (
      <>
        <div className="flex justify-between gap-20 text-slate-400">
          <form
            className="register flex flex-col "
            onSubmit={(e) => {
              handleSignUpSubmit(e)
                .then((val) => {
                  if (val) {
                  }
                })
                .catch((val) => {
                  console.log('fail', val);
                });
            }}>
            register
            <input
              onChange={(e) => {
                handleSignUpChange(e);
              }}
              id="name"
              value={signupData.name}
              type="text"
              name="username"
              placeholder="name"
              className="my-4"
            />
            <input
              onChange={(e) => {
                handleSignUpChange(e);
              }}
              id="email"
              value={signupData.email}
              type="text"
              name="email"
              placeholder="email"
              className="my-4"
            />
            <input
              onChange={(e) => {
                handleSignUpChange(e);
              }}
              id="password"
              value={signupData.password}
              type="text"
              name="password"
              placeholder="password"
              className="my-4"
            />
            <input type="submit" id="submit" />
          </form>
          <form
            className="login flex flex-col"
            onSubmit={(e) => {
              handleSignInSubmit(e)
                .then((val) => {
                  if (val) {
                  }
                })
                .catch((val) => {
                  console.log('fail', val);
                });
            }}>
            or login
            <input
              onChange={(e) => {
                handleSignInChange(e);
              }}
              id="email"
              type="text"
              name="email"
              placeholder="email"
              className="my-4"
              value={signinData.email}
            />
            <input
              onChange={(e) => {
                handleSignInChange(e);
              }}
              id="password"
              type="text"
              name="password"
              placeholder="password"
              className="my-4"
              value={signinData.password}
            />
            <input type="submit" id="submit" />
          </form>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </>
    );
  }
};

export default Account;
