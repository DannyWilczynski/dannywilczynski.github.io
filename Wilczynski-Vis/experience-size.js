
/**
 * this section is for processing the data into managable chunks 
 */
let small = [];
let medium = [];
let large = [];

let small_total = 0;
let medium_total = 0;
let large_total = 0;

// loops through all of the data, one value for each experience-company size pair (12)
for (let i = 0; i < 12; i++){
  experience_level = ""
  switch(experience_size["experience_category"][i]){
    case 'EN': 
      experience_level = "Entry-Level";
      break;
    case 'MI': 
      experience_level = "Mid-Level";
      break;
    case 'SE': 
      experience_level = "Senior-Level";
      break;
    case 'EX': 
      experience_level = "Executive-Level";
      break;
  }

  // add data to correct array
  if (experience_size["company_size"][i] =="L"){
    large_total += experience_size["count"][i];
    large.push({label:experience_size["experience_category"][i], value: experience_size["count"][i], 
      details: "Company Size: Large" + "<br>" + 
      "Experience category: " + experience_level + "<br>" +
      "Count: " + experience_size["count"][i] 
               
    });
  }
  else if (experience_size["company_size"][i] =="M"){
    medium_total += experience_size["count"][i];
    medium.push({label:experience_size["experience_category"][i], value: experience_size["count"][i], 
      details: "Company Size: Medium" + "<br>" + 
      "Experience category: " + experience_level + "<br>" +
      "Count: " + experience_size["count"][i] 
    });
  }
  else if (experience_size["company_size"][i] =="S"){
    small_total += experience_size["count"][i];
    small.push({label:experience_size["experience_category"][i], value: experience_size["count"][i], 
      details: "Company Size: Small" + "<br>" + 
      "Experience category: " + experience_level + "<br>" +
      "Count: " + experience_size["count"][i] 
    });
  }
}

// end of data processing 
 



// Set up dimensions for the SVG containers
const width = 350;
const height = 350;
const radius = Math.min(width, height) / 2.1;
const innerRadius = radius * 0.5;

// Define colors for the pie segments
const color = d3.scaleOrdinal()
  .range(['#ff4e4e',  '#808080','#00ff00', '#8cacfd']);

// Function to create a pie chart
function createPieChart(data, svgId) {
  // Create the SVG container
  const svg = d3.select(svgId)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // Generate the pie layout
  const pie = d3.pie()
    .value(d => d.value)
    .sort((a, b) => {
      const order = {
        'EN': 1,
        'MI': 2,
        'SE': 3,
        'EX': 4
      };
      let orderA = order[a.label];
      let orderB = order[b.label];
      
      return orderA - orderB;
    });

  // Create arcs based on the pie layout
  const arcs = pie(data);

  var arcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius)

  // Draw the pie chart
  svg.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data.label))
    .attr('stroke', 'black')
    .style('stroke-width', '1px')

    .on("mouseover", function(event, d) {
      d3.select(this)
        .style("stroke-width", "3px"); 

      d3.select(this.parentNode)
        .select('.fraction')
        .text(function(data){
          if (svgId == "#small-pie" )
            return d.data.value + '/' + small_total ;
          else if (svgId == "#medium-pie")
            return d.data.value + '/' + medium_total;
          else if (svgId == "#large-pie")
            return d.data.value + '/' + large_total;
          else
            return "";
        })
        .style("visibility", "visible")


      d3.select(this.parentNode)
        .select('.percentage')
        .text(function(data){
          if (svgId == "#small-pie" )
            return ((d.data.value / small_total) * 100).toFixed(1) + "%" ;
          else if (svgId == "#medium-pie")
            return ((d.data.value / medium_total) * 100).toFixed(1) + "%" ;
          else if (svgId == "#large-pie")
            return ((d.data.value / large_total) * 100).toFixed(1) + "%" ;
          else
            return "";
        })
        .style("visibility", "visible")


      d3.select(this.parentNode)
        .select('.experience')
        .text(function(data){
          const level = {
            'EN': "Entry-Level",
            'MI': "Junior-Level",
            'SE': "Senior-Level",
            'EX': "Director-Level"
          };

          return level[d.data.label];
        })
        .style("visibility", "visible")    

    })
    .on("mouseout", function() {
      svg.selectAll('text')
          .style("visibility", "hidden")
          .text("");
  
      // Remove highlighting
      d3.select(this)
        .attr("stroke", "black") 
        .style("stroke-width", 1);  
    });


    svg.selectAll('.fraction')
    .data(arcs)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'fraction')
    .attr('dy', '2em') 

    svg.selectAll('.percentage')
    .data(arcs)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'percentage')
    .attr('dy', '0.3em')

    svg.selectAll('.experience')
    .data(arcs)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'experience')
    .attr('dy', '-1em')
}


createPieChart(small, '#small-pie');
createPieChart(medium, '#medium-pie');
createPieChart(large, '#large-pie');
