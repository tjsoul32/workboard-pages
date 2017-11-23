var barOption = {
  title: {
    text: '',
    textStyle: {
      color: '#000'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    x: 'right',
    y: 'bottom',
    data: [],
    textStyle: {
      color: '#000'
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'value',
      axisTick: {show: false},
      axisLabel: {
        textStyle: {
          color: '#000'
        }
      },
      minInterval: 1,
      boundaryGap: [0, 0.01]
    }
  ],
  yAxis: [
    {
      type: 'category',
      data: [''],
      axisLabel: {
        textStyle: {
          color: '#000'
        }
      }
    }
  ],
  series: [
  ]
}

export default barOption
