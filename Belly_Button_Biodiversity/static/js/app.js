function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample 
  //var url = "/metadata/${sample}";                                                                                                            
  //d3.json(url).then(function(response) 
  d3.json(`/metadata/${sample}`).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata` 
    var place = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    place.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(response)) { 
      console.log('${key} : ${value}');
      place.append("h4").text(`${key}: ${value}`);
     }
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  //var url = "/samples/${sample}";    

  //d3.json(url).then(function(response) {
  d3.json(`/samples/${sample}`).then((response) => {
    console.log(response);
    const otu_ids = response.otu_ids;
    const otu_labels = response.otu_labels;
    const sample_values = response.sample_values;

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var playout = {
        title: "OTU PIE"
    };
    var pdata = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        type: "pie"
      }
    ];

    Plotly.plot("pie", pdata, playout);
 
    // @TODO: Build a Bubble Chart using the sample data
    var blayout = {
      title: "OTU BUBBLE",
      xaxis: { title: "OTU ID" },
    };  

    var bdata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
        }
      }
    ];
    Plotly.plot("bubble", bdata, blayout);
  });
}

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
