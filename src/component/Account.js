import { CgSpinner } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { useState } from 'react';
import axios from 'axios';
const Account = () => {
  const url = 'http://localhost:3000/api/1.0/user/signup';
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(url, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };
  const handleChange = (e) => {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  };
  return (
    <>
      <div className="flex justify-between gap-20">
        <form
          className="register flex flex-col "
          onSubmit={(e) => {
            handleSubmit(e);
          }}>
          register
          <input
            onChange={(e) => {
              handleChange(e);
            }}
            id="name"
            value={data.name}
            type="text"
            name="username"
            placeholder="name"
            className="my-4"
          />
          <input
            onChange={(e) => {
              handleChange(e);
            }}
            id="email"
            value={data.email}
            type="text"
            name="email"
            placeholder="email"
            className="my-4"
          />
          <input
            onChange={(e) => {
              handleChange(e);
            }}
            id="password"
            value={data.password}
            type="text"
            name="password"
            placeholder="password"
            className="my-4"
          />
          <input type="submit" id="submit" />
        </form>
        <form className="login flex flex-col">
          or login
          <input
            type="text"
            name="email"
            placeholder="email"
            className="my-4"
          />
          <input
            type="text"
            name="password"
            placeholder="password"
            className="my-4"
          />
          <input type="submit" id="submit" />
        </form>
      </div>
    </>
  );
};

export default Account;
