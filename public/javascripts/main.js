$(function() {
  // var d3Chart = new D3chart();
  let timeDelta;
  let timeTo;
  let timeFrom;
  
  function setTime() {
    timeDelta = 1200000; // 20 min
    timeTo = (new Date).getTime();
    timeFrom = timeTo - timeDelta;
  }

  function fetchData() {
    setTime();
    
    $.ajax({
      type: "GET",
      url: `/pingpong/data?from=${timeFrom}&to=${timeTo}`,
      success: function (data) {
        
        drawChart(data);
      }
    });
  }

  setTime();
  setInterval(fetchData, 2000);

  function drawChart(data) {
    let width = 800;
    let height = 200;
    let minValue = 0;
    let maxValue = 100;
    let margin = {top: 28, right: 30, bottom: 45, left: 20};
    let chartElement = document.querySelector('#chartTarget');
    chartElement.innerHTML = '';

    let x = d3.scaleBand()
      .domain([timeFrom, timeTo])
      .rangeRound([0, width])
      .padding(0.1);

    let y = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([height, 0]);

    let yAxis = d3.axisLeft(y)
      .ticks(6)
      .tickSizeInner(-width)
      .tickSizeOuter(0)
      .tickPadding(6);

    let xAxis = d3.axisBottom(x)
      .ticks(6)
      .tickPadding(2)
      .tickFormat(d => {
        let date = new Date(d);
        const oo = (val) => val < 10 ? `0${val}` : val;
        return `${oo(date.getHours())} : ${oo(date.getMinutes())}`;
      });

    let svg = d3.select(chartElement).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.time); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.frequency); });

    svg.append('g')
      .attr('class', 'x axis no-grid no-domain')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis no-domain')
      .call(yAxis);

    svg.append('text')
      .attr('class', 'legend-label')
      .attr('style', 'visibility: visible; font-size: 15px;')
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 9})`)
      .style('text-anchor', 'middle')
      .text('time');

    svg.append('text')
      .attr('class', 'legend-label')
      .attr('style', 'visibility: visible; font-size: 15px;')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (height / 2))
      .attr('y', -27)
      .style('text-anchor', 'middle')
      .text('activity');


    svg.selectAll('.axis line').style('shape-rendering', 'crispEdges').style('stroke', 'rgba(0,0,0,0.1');
    svg.selectAll('.axis.no-domain .domain').style('display', 'none');
    svg.selectAll('.axis.no-grid   .domain').style('display', 'none');
    svg.selectAll('.axis.no-grid line').style('display', 'none');
  }

});

