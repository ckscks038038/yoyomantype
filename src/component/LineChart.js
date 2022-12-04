import { ResponsiveLine } from '@nivo/line';
// import { mockData as data } from '../utils/mockData';

const LineChart = ({ data }) => {
  return (
    <ResponsiveLine
      tooltip={(input) => {
        return (
          <div className="rounded-md bg-white p-1 font-black text-primary-500">{`cpm: ${Math.trunc(
            input.point.data.y
          )}`}</div>
        );
      }}
      width={1300}
      height={400}
      data={data}
      theme={{
        textColor: '#94a3b8',
        fontSize: 15,
        axis: {
          domain: {
            line: {
              stroke: '#777777',
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 18,
              fill: '#94a3b8',
            },
          },
          ticks: {
            line: {
              stroke: '#777777',
              strokeWidth: 1,
            },
            text: {
              fontSize: 13,
              fill: '#94a3b8',
            },
          },
        },

        legends: {
          title: {
            text: {
              fontSize: 15,
              fill: '#94a3b8',
            },
          },
          text: {
            fontSize: 11,
            fill: '#333333',
          },
        },
      }}
      margin={{ top: 70, right: 110, bottom: 62, left: 80 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Time(second)',
        legendOffset: 40,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'character per minute',
        legendOffset: -65,
        legendPosition: 'middle',
      }}
      enableGridX={false}
      enableGridY={false}
      enableArea={true}
      pointSize={10}
      pointColor={{ theme: 'grid.line.stroke' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );
};

export default LineChart;
