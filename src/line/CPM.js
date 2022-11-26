import { Box } from '@mui/material';
import LineChart from '../component/LineChart';

const CPM = () => {
  //資料處理
  typeData = [
    {
      id: 'japan',
      color: 'hsl(301, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 33,
        },
        {
          x: 'helicopter',
          y: 289,
        },
        {
          x: 'boat',
          y: 144,
        },
        {
          x: 'train',
          y: 168,
        },
        {
          x: 'subway',
          y: 138,
        },
        {
          x: 'bus',
          y: 208,
        },
        {
          x: 'car',
          y: 165,
        },
        {
          x: 'moto',
          y: 277,
        },
        {
          x: 'bicycle',
          y: 155,
        },
        {
          x: 'horse',
          y: 172,
        },
        {
          x: 'skateboard',
          y: 14,
        },
        {
          x: 'others',
          y: 184,
        },
      ],
    },
    {
      id: 'france',
      color: 'hsl(359, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 92,
        },
        {
          x: 'helicopter',
          y: 282,
        },
        {
          x: 'boat',
          y: 30,
        },
        {
          x: 'train',
          y: 293,
        },
        {
          x: 'subway',
          y: 103,
        },
        {
          x: 'bus',
          y: 273,
        },
        {
          x: 'car',
          y: 52,
        },
        {
          x: 'moto',
          y: 258,
        },
        {
          x: 'bicycle',
          y: 278,
        },
        {
          x: 'horse',
          y: 192,
        },
        {
          x: 'skateboard',
          y: 192,
        },
        {
          x: 'others',
          y: 39,
        },
      ],
    },
    {
      id: 'us',
      color: 'hsl(50, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 285,
        },
        {
          x: 'helicopter',
          y: 169,
        },
        {
          x: 'boat',
          y: 54,
        },
        {
          x: 'train',
          y: 27,
        },
        {
          x: 'subway',
          y: 40,
        },
        {
          x: 'bus',
          y: 99,
        },
        {
          x: 'car',
          y: 1,
        },
        {
          x: 'moto',
          y: 87,
        },
        {
          x: 'bicycle',
          y: 267,
        },
        {
          x: 'horse',
          y: 161,
        },
        {
          x: 'skateboard',
          y: 283,
        },
        {
          x: 'others',
          y: 158,
        },
      ],
    },
    {
      id: 'germany',
      color: 'hsl(126, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 227,
        },
        {
          x: 'helicopter',
          y: 214,
        },
        {
          x: 'boat',
          y: 267,
        },
        {
          x: 'train',
          y: 199,
        },
        {
          x: 'subway',
          y: 179,
        },
        {
          x: 'bus',
          y: 90,
        },
        {
          x: 'car',
          y: 241,
        },
        {
          x: 'moto',
          y: 184,
        },
        {
          x: 'bicycle',
          y: 97,
        },
        {
          x: 'horse',
          y: 231,
        },
        {
          x: 'skateboard',
          y: 286,
        },
        {
          x: 'others',
          y: 279,
        },
      ],
    },
    {
      id: 'norway',
      color: 'hsl(119, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 111,
        },
        {
          x: 'helicopter',
          y: 239,
        },
        {
          x: 'boat',
          y: 2,
        },
        {
          x: 'train',
          y: 35,
        },
        {
          x: 'subway',
          y: 26,
        },
        {
          x: 'bus',
          y: 8,
        },
        {
          x: 'car',
          y: 172,
        },
        {
          x: 'moto',
          y: 94,
        },
        {
          x: 'bicycle',
          y: 199,
        },
        {
          x: 'horse',
          y: 258,
        },
        {
          x: 'skateboard',
          y: 276,
        },
        {
          x: 'others',
          y: 237,
        },
      ],
    },
  ];
  const lineChartObj = [
    {
      id: 'cpm',
      color: 'hsl(197, 70%, 50%)',
      data: typeData,
    },
  ];
  return (
    <Box className="h-96 w-full">
      <LineChart data={lineChartObj} />
    </Box>
  );
};

export default CPM;
