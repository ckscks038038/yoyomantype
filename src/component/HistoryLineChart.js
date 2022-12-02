import { ResponsiveLine } from '@nivo/line';
// import { mockData as data } from '../utils/mockData';

const HistoryLineChart = ({ data }) => {
  return (
    <ResponsiveLine
      tooltip={(input) => {
        return (
          <div className="rounded-md bg-white p-1 font-black text-primary-500">{`cpm: ${Math.trunc(
            input.point.data.y
          )}`}</div>
        );
      }}
      width={1500}
      height={400}
      data={data}
      theme={{
        textColor: '#94a3b8',
        fontSize: 20,
        axis: {
          domain: {
            line: {
              stroke: '#777777',
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 20,
              fill: '#94a3b8',
            },
          },
          ticks: {
            line: {
              stroke: '#777777',
              strokeWidth: 1,
            },
            text: {
              fontSize: 16,
              fill: '#94a3b8',
            },
          },
        },
        grid: {
          line: {
            stroke: '#475569',
            strokeWidth: 2,
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
      margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
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
        legend: '',
        legendOffset: 37,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 0,
        tickRotation: 0,
        legend: 'character per minute (cpm)',
        legendOffset: -70,
        legendPosition: 'middle',
      }}
      enableGridX={false}
      enableGridY={true}
      enableArea={false}
      pointSize={10}
      colors={{ scheme: 'yellow_orange_red' }}
      pointColor={{ theme: 'grid.line.stroke' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 0,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
        },
      ]}
    />
  );
};

export default HistoryLineChart;
