


function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then( data => {

    console.log(data);
  
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    metaData.html("")
    
    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(data).forEach(([key, value]) => {
      // Use the key to determine which array to push the value to
      console.log(`Key: ${key} and Value ${value}`);

      metaData.append(`${key}`).text(`${key.toUpperCase()}: ${value}`)
      metaData.append('br')
      metaData.append('br')
      
     });
    
  // Build the Gauge Chart

    var level = data.WFREQ;

    // Trig to calc meter point
    var degrees = 180 - (level*20),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'wash frequency',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(133, 180, 138, .5)', 'rgba(138, 187, 143, .5)',
                            'rgba(140, 191, 136, .5)', 'rgba(183, 204, 146, .5)',
                            'rgba(213, 228, 157, .5)', 'rgba(229, 231, 179, .5)',
                            'rgba(233, 230, 202, .5)','rgba(244, 241, 229, .5)',
                            'rgba(248, 243, 236, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
    
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: `<b>Belly Button Wash Frequency</b> <br>
      Scrubs per week`, 
      height: 500,
      width: 700,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    
    Plotly.newPlot('gauge', data, layout);
      


    
})};

function buildCharts(sample) {

// Build a Pie Chart with the sample data

  d3.json(`/samples/${sample}`).then( data => {

    console.log(data);
    console.log("___________________________________________")
    console.log(data.otu_labels.slice(0,10))
    const otu_labels = data.otu_labels;
    
    var dataPie = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
      
    }];
    
    var layoutPie = {
      height: 550,
      width: 500
    };
    
    Plotly.newPlot('pie', dataPie, layoutPie);



// Build a Bubble Chart with the sample data

    var dataBubble = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];
    
    // var data = [trace1];
    
    var layoutBubble = {
      title: '',
      showlegend: false,
      height: 440,
      width: 1400
    };
    
    Plotly.newPlot('bubble', dataBubble, layoutBubble);
    
    
})};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
