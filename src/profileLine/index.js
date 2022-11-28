import { Box } from '@mui/material';
import HistoryLineChart from '../component/HistoryLineChart';

const ProfileLine = ({ data }) => {
  //資料處理

  const objData = {};

  data.forEach((record) => {
    const date = record.date.slice(0, record.date.indexOf('T'));
    const cpm = record.cpm;
    if (!objData[date]) {
      objData[date] = {};
      objData[date].cpm = cpm;
      objData[date].count = 1;
      objData[date].date = date;
    } else {
      objData[date].cpm += cpm;
      objData[date].count += 1;
    }
  });

  const arrData = Object.keys(objData).map((dateObj) => {
    return {
      x: objData[dateObj].date,
      y: objData[dateObj].cpm / objData[dateObj].count,
    };
  });

  const lineChartObj = [
    {
      id: 'cpm',
      color: '#fcd34d',
      data: arrData,
    },
  ];
  return (
    <Box className="h-96 w-auto">
      <HistoryLineChart data={lineChartObj} />
    </Box>
  );
};

export default ProfileLine;
