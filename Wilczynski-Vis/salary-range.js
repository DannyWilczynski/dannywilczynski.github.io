// the graph starts normalized by default 
let normalized = true;

/**
 * function to toggle the normalization and re-render the visualization
 */
function toggleNormalization(){
  normalized = !normalized;
  renderChart();
}

// if the button is pressed, run the toggleNormalization function 
document.getElementById("toggleNormalization").addEventListener("click", toggleNormalization);



// the salary ranges 
ranges = [
  "0-39,999",
  "40,000-69,999",
  "70,000-99,999",
  "100,000-139,999",
  "140,000-199,999",
  "200,000-299,999",
  "300,000+"
]

en_array = []
mi_array = []
se_array = []
ex_array = []

en_total = 0;
mi_total = 0;
se_total = 0;
ex_total = 0;


for (let i = 0; i < 7; i++){
  // these arrays hold the number of salary range occurrences for each salary range 
  // in each experience level 
  en_array[i] = salary_ranges["EN"][ranges[i]];
  mi_array[i] = salary_ranges["MI"][ranges[i]];
  se_array[i] = salary_ranges["SE"][ranges[i]];
  ex_array[i] = salary_ranges["EX"][ranges[i]];

  // this is the total number of data points for a particular experience level.
  // used for normalization
  en_total += en_array[i];
  mi_total += mi_array[i];
  se_total += se_array[i];
  ex_total += ex_array[i];
}

// our final data that will be graphed 
all_ranges = [
  {category: "EN", values: en_array },
  {category: "MI", values: mi_array },
  {category: "SE", values: se_array},
  {category: "EX", values: ex_array},
]

// this function draws the charts, needs to start by removing any existing instance 
function renderChart(){
  d3.select("#stacked-bar svg").remove();

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;


  const svg = d3.select("#stacked-bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // rename the x axis rather than "EN", "MI", etc.
    axis_labels = ["Entry", "Junior", "Senior", "Director"];
    
  // Set up scales
  const x = d3.scaleBand()
    .domain(axis_labels)
    .range([0, width])
    .padding(0.1);

  // if normalizing, set the y domain to go from 0-100
  y_domain_upper = 100;
  if (!normalized){
    y_domain_upper = d3.max(all_ranges, d => d3.sum(d.values))
  }

  y = d3.scaleLinear()
    .domain([0, y_domain_upper ])
    .range([height, 0]);

  const stack = d3.stack()
    .keys(d3.range(all_ranges[0].values.length))
    .offset(d3.stackOffsetNone);

  const series = stack(all_ranges.map(d => {
    // if not normalizing, just return the number of occurences 
    if (!normalized){
      return d.values
    }

    // if we are normalizing, select the correct category and then divide by 
    // the total count of that category to get a value < 1
    if (d.category == "EN"){
      return d.values.map(val => 100 * (val/en_total)) 
    }
    else if (d.category == "MI"){
      return d.values.map(val => 100 * (val/mi_total)) 
    }
    else if (d.category == "SE"){
      return d.values.map(val => 100 * (val/se_total)) 
    }
    // category == 'EX'
    return d.values.map(val => 100 * (val/ex_total)) 
  }));

  // the number of a bar as it's being created. This is used to give each bar a different class
  // and each class has a different color
  barnum = 0;


  svg.selectAll(".bar")
    .data(series)
    .enter().append("g")
    .attr("class", "bar")
    .attr("class", () =>{
      color_class = "color" + String(barnum);
      barnum += 1
      return color_class;
    })
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", (d, i) => x(axis_labels[i]))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .attr('stroke', 'black') 
    .attr('stroke-width', 1);

  // add the x and y axes 
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

}

// make sure renderChart is run when the page is loaded
renderChart();

