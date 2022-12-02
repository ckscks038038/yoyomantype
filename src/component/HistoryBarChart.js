import Plot from 'react-plotly.js';

const HistoryBarChart = ({ data }) => {
  return (
    <Plot
      data={[
        {
          type: 'histogram',
          x: data,
          autobinx: false,
          xbins: {
            end: 600,
            size: 12,
            start: 0,
          },
          marker: {
            color: '#facc15',
            line: {
              color: '#fef9c3',
              width: 2,
            },
          },
          opacity: 0.9,
        },
      ]}
      config={{
        displayModeBar: false, // this is the line that hides the bar.
      }}
      layout={{
        width: 1500,
        height: 500,
        paper_bgcolor: '#1E293B',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
          title: {
            text: 'character per minute (cpm)',
            font: {
              family: 'Courier New, monospace',
              size: 20,
              color: '#94a3b8',
            },
          },
          tickfont: {
            family: 'monospace',
            size: 16,
            color: '#94a3b8',
          },
          zeroline: true,
          zerolinecolor: '#475569',
        },
        yaxis: {
          title: {
            text: 'times',
            font: {
              family: 'Courier New, monospace',
              size: 20,
              color: '#94a3b8',
            },
          },
          tickfont: {
            family: 'monospace',
            size: 16,
            color: '#94a3b8',
          },
          gridcolor: '#475569',
          gridwidth: 2,
          zeroline: true,
          zerolinecolor: '#475569',
        },
        bargap: 0.1,
        bargroupgap: 0.1,
        font_color: '#1E293B',
      }}
    />
  );
};

export default HistoryBarChart;
