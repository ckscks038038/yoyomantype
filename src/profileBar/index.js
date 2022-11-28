import { Box } from '@mui/material';
import HistoryBarChart from '../component/HistoryBarChart';

const ProfileBar = ({ data }) => {
  const arrData = data.map((record) => {
    return record.cpm;
  });
  return (
    <Box className="h-96 w-auto">
      <HistoryBarChart data={arrData} />
    </Box>
  );
};

export default ProfileBar;
