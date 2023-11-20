var nRows = 3;
var nCols = 3;
var host = window.location.hostname;
var timestamp = '';

var isLocalHost = (host === "localhost" || host === "127.0.0.1" || host === "192.168.0.112");

var urlMap = ''
if (isLocalHost) {
  urlMap = '//' + host + ':3000/maxhold?timestamp=' + Date.now();
} else {
  urlMap = '//' + host + '/api/maxhold?timestamp=' + Date.now();
}

var urlTimestamp = '';
if (isLocalHost) {
  urlTimestamp = '//' + host + ':3000/timestamp?timestamp=' + Date.now();
} else {
  urlTimestamp = '//' + host + '/api/timestamp?timestamp=' + Date.now();
}

var data = [
  {
    z: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    colorscale: 'Jet',
    type: 'heatmap'
  }
];

var layout = {
  autosize: false,
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 50,
    pad: 0
  },
  width: document.getElementById('ddmap').offsetWidth,
  height: document.getElementById('ddmap').offsetHeight,
  plot_bgcolor: "rgba(0,0,0,0)",
  paper_bgcolor: "rgba(0,0,0,0)",
  annotations: [],
  coloraxis: {
    cmin: 0,
    cmax: 1
  },
  displayModeBar: false,
  xaxis: {
    ticks: '',
    side: 'bottom'
  },
  yaxis: {
    ticks: '',
    ticksuffix: ' ',
    autosize: false
  }
};

var config = {
  displayModeBar: false,
  responsive: true
}

Plotly.newPlot('ddmap', data, layout, config);

var intervalId = window.setInterval(function () {

  // check if timestamp is updated
  var timestampData = $.get(urlTimestamp, function () { })

    .done(function (data) {
      if (timestamp != data) {
        timestamp = data;
        // get new map data
        var apiData = $.getJSON(urlMap, function () { })
          .done(function (data) {
            // case draw new plot
            if (data.nRows != nRows || data.nCols != nCols) {
              nRows = data.nRows;
              nCols = data.nCols;

              data = [
                {
                  z: data.data,
                  x: data.delay,
                  y: data.doppler,
                  colorscale: 'Jet',
                  zauto: false,
                  zmin: 0,
                  zmax: Math.max(13, data.maxPower),
                  type: 'heatmap'
                }
              ];
              layout = {
                autosize: false,
                margin: {
                  l: 50,
                  r: 50,
                  b: 50,
                  t: 50,
                  pad: 0
                },
                width: document.getElementById('ddmap').offsetWidth,
                height: document.getElementById('ddmap').offsetHeight,
                plot_bgcolor: "rgba(0,0,0,0)",
                paper_bgcolor: "rgba(0,0,0,0)",
                annotations: [],
                displayModeBar: false,
                xaxis: {
                  title: {
                    text: 'Bistatic Range (km)',
                    font: {
                      size: 24
                    }
                  },
                  ticks: '',
                  side: 'bottom'
                },
                yaxis: {
                  title: {
                    text: 'Bistatic Doppler (Hz)',
                    font: {
                      size: 24
                    }
                  },
                  ticks: '',
                  ticksuffix: ' ',
                  autosize: false,
                  categoryorder: "total descending"
                }
              };
              Plotly.newPlot('ddmap', data, layout, { displayModeBar: false });
            }
            else {
              data_update =
              {
                'z': [data.data],
                'zmax': Math.max(13, data.maxPower)
              };
              layout_update = {
              };
              Plotly.update('ddmap', data_update, layout_update, { displayModeBar: false });
            }

          })

          .fail(function () {
            console.log('API Fail');
          })

          .always(function () {

          });
      }
    })

    .fail(function () {
      console.log('API Fail');
    })

    .always(function () {

    });

}, 100);