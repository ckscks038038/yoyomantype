import { Box } from '@mui/material';
import LineChart from '../component/LineChart';

const Line = ({ data, timeLength }) => {
  //資料處理

  //0秒時打字總數設為0
  const finalLineChartData = [{ x: 0, y: 0 }];
  const arrWithoutNonCharData = data.filter((char) => {
    return char.word !== 'Backspace' && char.word !== ' ';
  });

  //剩下從零開始的時間
  const arrStartFromZeroData = arrWithoutNonCharData.map((char) => {
    return ((char.time - data[0].time) % 100000) / 1000;
  });

  let endTime = 0;
  let timeStamp = 0;
  while (arrStartFromZeroData.length && endTime <= timeLength) {
    endTime += 1;
    let y = 0;

    while (timeStamp < endTime) {
      //時間區段內總數增加1
      //換下一個物件
      timeStamp = arrStartFromZeroData.shift();
      y += 1;
    }
    // 超過時間區段
    // 1.push上一個時間區段的結果到array (y值單位從秒到分鐘,要*60)
    // 2. 更新x,y值

    //如果超過15秒但array還有值(會有一點誤差) push進array
    if (endTime === timeLength && arrStartFromZeroData.length) {
      y += arrStartFromZeroData.length;
    }
    finalLineChartData.push({ x: endTime, y: y });
  }
  const lineChartObj = [
    {
      id: 'us',
      color: 'hsl(197, 70%, 50%)',
      data: finalLineChartData,
    },
  ];
  return (
    <Box className="h-96 w-full">
      <LineChart data={lineChartObj} />
    </Box>
  );
};

export default Line;
