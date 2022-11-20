import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [totalTest, setTotalTest] = useState('0');
  const [joinedDate, setJoinedDate] = useState('0');
  const [cpm, setCpm] = useState('0');
  const [acc, setAcc] = useState('0');
  const [typingData, setTypingData] = useState('0');
  useEffect(() => {
    // 如果可以解jwtToken則render畫面
    if (localStorage.getItem('jwtToken')) {
      const token = localStorage.getItem('jwtToken');
      console.log('可以render');

      const fetchData = async () => {
        const profileUrl = 'http://localhost:3000/api/1.0/user/profile';
        let headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await axios.get(profileUrl, { headers: headers });
          const userId = response.data.data.id;

          // 透過userId取得each cpm, acc, total test
          console.log('profile', response.data.data.typingData);
          setName(response.data.data.name);
          setJoinedDate(response.data.data.created_on);
          setCpm(response.data.data.cpm);
          setAcc(response.data.data.acc);
          setTotalTest(response.data.data.totalTest);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    } else {
      console.log('不可以render profile畫面');
      navigate(`/account`, {
        state: { identity: 'owner', name: 'ckscks038038', created_on: 123 },
      });
    }
    //否則跳轉到"/account"
  }, []);
  //   let location = useLocation();
  //   const identity = location.state.identity;
  //   const name = location.state.name;
  //   const created_on = location.state.created_on;
  return (
    <>
      {name ? (
        <div className="flex flex-col gap-28 text-gray-100">
          <div className="top flex justify-between gap-20 border-2">
            <h1>Name{name}</h1>
            <div>joined date{joinedDate}</div>
            <div>total tests{totalTest}</div>
            <div>average cpm{cpm}</div>
            <div>average accuracy{acc}</div>
          </div>
          <div className="body flex justify-between gap-20 border-2">
            <div>chart 1{typingData}</div>
            <div>chart 2{typingData}</div>
          </div>
          <div className="border-2">footer</div>
        </div>
      ) : null}
    </>
  );
};
export default Profile;
