// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata; // Booth example

    // Filter the metadata for the object with the desired sample number
    //let sample_metadata = metadata.filter(row => row.id == sample); // Booth example from office hours
    //console.log(sample_metadata)
    let sample_metadata = metadata.filter(row => row.id === parseInt(sample))[0]; // Booth example, double equals was not working

    // Use d3 to select the panel with id of `#sample-metadata`
    let demographics = d3.select("#sample-metadata"); // Booth example, different variable

    // Use `.html("") to clear any existing metadata
    demographics.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    // next 6 lines from Xpert AI
    // Loop through each key-value pair in the filtered metadata
    for (const [key, value] of Object.entries(sample_metadata)) {
      // Append a new div tag for each key-value pair
      demographics.append("div")
          .text(`${key.toUpperCase()}: ${value}`);; // Set the text to display the key-value pair
       }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    let sample_data = samples.filter(row => row.id === sample)[0]; // Booth example
    // console.log(sample_data)
    // Get the otu_ids, otu_labels, and sample_values
    // Booth example next 3 lines
    let otu_ids = sample_data.otu_ids;
    let otu_labels = sample_data.otu_labels;
    let sample_values = sample_data.sample_values;

    // console.log(otu_ids);

    // Build a Bubble Chart

    // BEGIN XPERT AI

  let xData = otu_ids; // X-coordinates
  let yData = sample_values; // Y-coordinates
  let bubbleSizes = sample_values; // Size of the bubbles

  // Create the trace for the bubble chart
  let trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    marker: {
      size: bubbleSizes,
      color: otu_ids, // Color of the bubbles
      colorscale: 'Portland' // Booth example, different colors
    },
    type: 'scatter'
  };

  // Data array
  let tracer = [trace];

  // Layout configuration
  let layout = {
    title: 'Bacteria Cultures Per Sample',
    xaxis: {
      title: 'OTU ID'
    },
    yaxis: {
      title: 'Number of Bacteria'
    },
    height: 600 // Booth Example because chart was not rendering
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot('bubble', tracer, layout); //changed to 'bubble'

// END XPERT AI

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately

// BEGIN XPERT AI

    // Slice and reverse the input data
    let slicedOtuIds = otu_ids.slice(0, 10).reverse(); // Adjust the slice as needed
    let slicedSampleValues = sample_values.slice(0, 10).reverse(); // Adjust the slice as needed
    let slicedOtuLabels = otu_labels.slice(0, 10).reverse(); // Slice otu_labels similarly

    // Map otu_ids to strings for y-ticks
    let yTicks = slicedOtuIds.map(id => `OTU ${id}`);

    // Create hover text using otu_labels
    let hoverText = slicedSampleValues.map((value, index) => 
      `OTU ID: ${yTicks[index]}<br>Sample Value: ${value}<br>Label: ${slicedOtuLabels[index]}`
    );
    // Create the trace for the bar chart
    let sliced_trace = {
      x: slicedSampleValues,
      y: yTicks,
      type: 'bar',
      orientation: 'h', // Set orientation to 'h' for horizontal
      hovertext: hoverText, // Add hover text
      hoverinfo: 'text' // Specify that only the hover text should be shown
    };
    
    // Create the data array
    let sliced_tracer = [sliced_trace];
    
    // Define layout if needed
    let bar_layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria'
      },
      yaxis: {
        title: 'OTU IDs'
      }
    };
    
    // Render the plot
    Plotly.newPlot('bar', sliced_tracer, bar_layout);

// END XPERT AI

  });
}

// lines written with Kourt in tutoring
function add_option(parent, subject_id) {
  parent.append("option").attr("value", subject_id).text(subject_id);
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let subject_ids = data.names; // line written with Kourt in tutoring
    // console.log(subject_ids);
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset"); // line written with Kourt in tutoring
    // <option value="volvo">toyota</option>
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    // lines written with Kourt in tutoring
    subject_ids.forEach(id => {
      add_option(dropdown, id);
    });

    // Get the first sample from the list
    // Booth example variable changed
    let first_sample = subject_ids[0];
    
    // Build charts and metadata panel with the first sample
    // Booth example
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) { 
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample) // Booth example
  buildCharts(newSample)
}

// Initialize the dashboard
init();
