$(function() {
  // var d3Chart = new D3chart();
  let timeDelta;
  let timeTo;
  let timeFrom;
  
  function setTime() {
    timeDelta = 720000; //7200000 = 120 min
    timeTo = (new Date).getTime();
    timeFrom = timeTo - timeDelta;
  }

  function fetchData() {
    setTime();
    
    $.ajax({
      type: "GET",
      url: `/data?from=${timeFrom}&to=${timeTo}`,
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

    let x = d3.scaleLinear()
      .domain([timeFrom, timeTo])
      .rangeRound([0, width]);

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

    let area = d3.area()
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d.value));

    svg.append('path')
      .attr('fill', '#00aa00')
      .attr('d', area(data));

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
  // function D3chart() {
  //   var limit = 60 * 1,
  //       duration = 750,
  //       now = new Date(Date.now() - duration)

  //   var width = 1000,
  //       height = 500

  //   var groups = {
  //       current: {
  //           value: 0,
  //           color: 'orange',
  //           data: d3.range(limit).map(function() {
  //               return 0
  //           })
  //       }
  //   }

  //   var x = d3.time.scale()
  //       .domain([now - (limit - 2), now - duration])
  //       .range([0, width])

  //   var y = d3.scale.linear()
  //       .domain([0, 2000])
  //       .range([height, 0])

  //   var line = d3.svg.line()
  //       .interpolate('basis')
  //       .x(function(d, i) {
  //           return x(now - (limit - 1 - i) * duration)
  //       })
  //       .y(function(d) {
  //           return y(d)
  //       })

  //   var svg = d3.select('#chartTarget').append('svg')
  //       .attr('class', 'chart')
  //       .attr('width', width)
  //       .attr('height', height + 50)

  //   var axis = svg.append('g')
  //       .attr('class', 'x axis')
  //       .attr('transform', 'translate(0,' + height + ')')
  //       .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

  //   var paths = svg.append('g')

  //   for (var name in groups) {
  //       var group = groups[name]
  //       group.path = paths.append('path')
  //           .data([group.data])
  //           .attr('class', name + ' group')
  //           .style('stroke', group.color)
  //   }

  //   D3chart.prototype.tick = function(values) {
  //     now = new Date()

  //       // Add new values
  //       for (var name in groups) {
  //           var group = groups[name];
  //           [].push.apply(group.data, values)
  //           group.path.attr('d', line)
  //       }

  //       // Shift domain
  //       x.domain([now - (limit - 2) * duration, now - duration])

  //       // Slide x-axis left
  //       axis.transition()
  //           .duration(duration)
  //           .ease('linear')
  //           .call(x.axis)

  //       // Slide paths left
  //       paths.attr('transform', null)
  //           .transition()
  //           .duration(duration)
  //           .ease('linear')
  //           .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')

  //       for (var name in groups) {
  //           var group = groups[name]
  //           group.data.shift()
  //       }
  //   }
  // }
});

