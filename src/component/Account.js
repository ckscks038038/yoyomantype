import { BsFillPersonFill } from 'react-icons/bs';

const Account = () => {
  return (
    <>
      <div account-container className="flex justify-between gap-20">
        <div className="register flex flex-col ">
          register
          <input
            type="text"
            name="username"
            placeholder="name"
            className="my-4"
          />
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
        </div>
        <div className="login flex flex-col">
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
        </div>
      </div>
    </>
  );
};

export default Account;
