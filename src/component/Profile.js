import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CPM from '../line';
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
          setTypingData(response.data.data.typingData);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    } else {
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
    <div className="mt-52">
      {name ? (
        <div className="flex flex-col gap-28 text-gray-100">
          <div className="top flex justify-between gap-20 rounded-xl bg-slate-900 p-3">
            <ProfileDiv title={'Name'} data={name} />
            <ProfileDiv
              title={'Joined date'}
              data={joinedDate.slice(0, joinedDate.indexOf('T'))}
            />
            <ProfileDiv title={'total tests'} data={totalTest} />
            <ProfileDiv title={'average cpm'} data={cpm} />
            <ProfileDiv title={'average accuracy'} data={acc} />
          </div>
          <div className="body flex justify-between gap-20 border-2">
            {/* <div>
              {typingData.map((data) => {
                console.log(data);
                return <div key={`${data.cpm}_${data.date}`}>{data}</div>;
              })}
            </div>
            <div>chart 2{typingData}</div> */}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Profile;

const ProfileDiv = ({ title, data }) => {
  return (
    <div className="flex flex-col">
      <div className="font-bold text-primary-400">{title}: </div>
      <div className="text-3xl font-medium text-slate-400"> {data}</div>
    </div>
  );
};
