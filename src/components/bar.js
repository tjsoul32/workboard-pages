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
    data: ['普通', '重要', '很重要', '非常重要'],
    textStyle: {
      color: '#000'
    }
  },
  colors: ['#73ccff', '#42d885', '#f7ba2a', '#ff4949'],
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
