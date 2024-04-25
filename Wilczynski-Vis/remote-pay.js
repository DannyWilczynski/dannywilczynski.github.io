/**
 * This function is used for formatting in html. To make it easier to print &nbsp; the function
 * takes a number and raturns a string with count nbsp characters 
 */
function spaces(count){
  nbsp = "";
  for (let i = 0; i < count; i++){
    nbsp += "&nbsp";
  }
  return nbsp;
}

ranges = [
  "0-39,999",
  "40,000-69,999",
  "70,000-99,999",
  "100,000-139,999",
  "140,000-199,999",
  "200,000-299,999",
  "300,000+"
]

exp_lvl = [
  "EN",
  "EX",
  "MI",
  "SE"
]

remote_totals = [
  0,0,0,0,0,0,0
]

not_remote_totals = [
  0,0,0,0,0,0,0
]

// outer loop counts through each experience level 
for (let i = 0; i < 4; i++){
  // inner loop counts through each salary range level
  for (let j = 0; j < 7; j++){ 
    remote_totals[j] += remote_salary[exp_lvl[i]][ranges[j]]
    not_remote_totals[j] += not_remote_salary[exp_lvl[i]][ranges[j]]
  }
}

remote_data = [];

// fills in all of the data into remote_data, the final organizing of the data is done 
for (let i = 0; i < 7; i++){
  remote_data[i] = {category: ranges[i], value: { remote: remote_totals[i], notRemote: not_remote_totals[i], 
    "EN": remote_salary[exp_lvl[0]][ranges[i]],
    "EX": remote_salary[exp_lvl[1]][ranges[i]],
    "MI": remote_salary[exp_lvl[2]][ranges[i]],
    "SE": remote_salary[exp_lvl[3]][ranges[i]],
    "NotEN": not_remote_salary[exp_lvl[0]][ranges[i]],
    "NotEX": not_remote_salary[exp_lvl[1]][ranges[i]],
    "NotMI": not_remote_salary[exp_lvl[2]][ranges[i]],
    "NotSE": not_remote_salary[exp_lvl[3]][ranges[i]]
   
}};
}

// all consts in this file begin with remote_ to avoid naming conflicts with other js files
const remote_margin = { top: 20, right: 20, bottom: 50, left: 50 };
const remote_width = 600 - remote_margin.left - remote_margin.right;
const remote_height = 400 - remote_margin.top - remote_margin.bottom;

const remote_svg = d3.select('.histogram-svg') // Selecting by class
  .attr('width', remote_width + remote_margin.left + remote_margin.right)
  .attr('height', remote_height + remote_margin.top + remote_margin.bottom)
  .append('g')
  .attr('transform', `translate(${remote_margin.left},${remote_margin.top})`);

const remote_x = d3.scaleBand()
  .domain(remote_data.map(d => d.category))
  .range([0, remote_width])
  .padding(0.1);

const remote_y = d3.scaleLinear()
  .domain([0, d3.max(remote_data, d => Math.max(d.value.remote, d.value.notRemote))])
  .nice()
  .range([remote_height, 0]);

const remote_xAxis = d3.axisBottom(remote_x);
const remote_yAxis = d3.axisLeft(remote_y);

remote_svg.append('g')
  .attr('class', 'axis axis-x')
  .attr('transform', `translate(0,${remote_height})`)
  .call(remote_xAxis)
  .selectAll('text') 
  .attr('transform', 'rotate(-8)');

remote_svg.append('g')
  .attr('class', 'axis axis-y')
  .call(remote_yAxis);

  
const remote_bars = remote_svg.selectAll('.bar')
  .data(remote_data)
  .enter()
  .append('g')
  .attr('class', 'bar')
  .attr('transform', d => `translate(${remote_x(d.category) + 15},0)`) // +15 to prevent overlap with y axis
  .on("mouseover", function(event, d){
    
    // formatted lines so remote and not remote can be compared more easily 
    entryLine = "Entry-level: " + String(d.value.NotEN) ;
    juniorLine = "Junior-level: " + String(d.value.NotMI);
    seniorLine = "Senior-level: " + String(d.value.NotSE);
    execLine = "Executive-level: " + String(d.value.NotEX);

    remote_tooltip.html(`
    <div class="remote-tooltip-label remote" ><b>${((d.value.remote/ (d.value.notRemote + d.value.remote)) * 100).toFixed(2) + "%"}</div> are remote</b><br/>
    Not Remote: ${d.value.notRemote} <br/>
    Remote: ${d.value.remote} <br/><br/>
    
    <div class="remote-tooltip-label notRemote" ><b> NotRemote </b> </div>
    ${spaces(16)}   
    <div class="remote-tooltip-label remote" > <b>Remote</b>  </div> <br/>
    ${entryLine} ${spaces(26 - entryLine.length)}   Entry-level: ${d.value.EN}<br/>
    ${juniorLine} ${spaces(26 - juniorLine.length)} Junior-level: ${d.value.MI}<br/>
    ${seniorLine} ${spaces(26 - seniorLine.length)} Senior-level: ${d.value.SE}<br/>
    ${execLine} ${spaces(26 - execLine.length)} Executive-level: ${d.value.EX} 
    `)
    .style("visibility", "visible");
  })
  .on("mouseout", function() {
    remote_tooltip.style("visibility", "hidden");
  });


remote_bars.append('rect')
  .attr('class', 'remote')
  .attr('x', remote_x.bandwidth() / 4)
  .attr('y', d => remote_y(d.value.remote))
  .attr('width', remote_x.bandwidth() / 2)
  .attr('height', d => remote_height - remote_y(d.value.remote))
  .attr('stroke', 'black') 
  .attr('stroke-width', 1) ;

remote_bars.append('rect')
  .attr('class', 'notRemote')
  .attr('x', -remote_x.bandwidth() / 4)
  .attr('y', d => remote_y(d.value.notRemote))
  .attr('width', remote_x.bandwidth() / 2)
  .attr('height', d => remote_height - remote_y(d.value.notRemote))
  .attr('stroke', 'black') 
  .attr('stroke-width', 1);

const remote_tooltip = d3.select('.histogram-tooltip')


