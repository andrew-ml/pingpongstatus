$(function() {
  // var d3Chart = new D3chart();
  let timeDelta = 30 * 60000; // 30 min;
  let timeTo;
  let timeFrom;

  function setTime() {
    timeTo = (new Date).getTime();
    timeFrom = timeTo - timeDelta;
  }

  function fetchData() {
    setTime();
    
    $.ajax({
      type: "GET",
      url: `http://iot.kha.dataart.com/pingpong/data?from=${timeFrom}&to=${timeTo}`,
      success: function (data) {
        const cleanedUpData = cleanUpData(data);
        drawChart(cleanedUpData);
      }
    });
  }

  function cleanUpData(data) {
    const INTERVAL = 10000 // 10 sec
    const l = data.length;

    if (l < 2) {
      return [];
    }

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i].time - data[i - 1].time > INTERVAL &&
          data[i + 1].time - data[i].time > INTERVAL) {
        data[i].value = 0;
      }
    }

    if (data[1].time - data[0].time > INTERVAL) {
      data[1].value = 0;
    }

    if (data[l - 1].time - data[l - 2].time > INTERVAL) {
      data[l - 1].value = 0;
    }

    return data;
  }

  $('.js-select-time a').on('click', function (e) {
    let $el = $(this);
    e.preventDefault();
    const mins = $el.data('time-min');
    timeDelta = mins * 60000;
    $el.siblings().removeClass('active');
    $el.addClass('active');
  });

  setTime();
  setInterval(fetchData, 2000);

  function drawChart(data) {
    let chartElement = document.querySelector('#chartTarget');
    const width = chartElement.offsetWidth;

    const height = 200;
    const minValue = 0;
    const maxValue = 100;
    const margin = {top: 28, right: 30, bottom: 45, left: 45};
    const barWidth = 3;

    chartElement.innerHTML = '';

    let x = d3.scaleTime()
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
      .ticks(8)
      .tickPadding(2);

    let svg = d3.select(chartElement).append('svg')
      .attr('width', width)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.time); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", barWidth)
        .attr("height", function(d) { return height - y(d.value); })
        .attr('fill', '#00aa00');

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
      .style('text-anchor', 'middle');
      // .text('time');

    svg.append('text')
      .attr('class', 'legend-label')
      .attr('style', 'visibility: visible; font-size: 15px;')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (height / 2))
      .attr('y', -30)
      .style('text-anchor', 'middle')
      .text('activity');


    svg.selectAll('.axis line').style('shape-rendering', 'crispEdges').style('stroke', 'rgba(0,0,0,0.1');
    svg.selectAll('.axis.no-domain .domain').style('display', 'none');
    svg.selectAll('.axis.no-grid   .domain').style('display', 'none');
    svg.selectAll('.axis.no-grid line').style('display', 'none');
  }

});

