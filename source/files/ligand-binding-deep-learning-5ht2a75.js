var categories = []
var expected = []
var range = []
var average = []

function drawDiagram () {
  Highcharts.chart('container', {
   chart: {
     zoomType: 'xy'
   },
   title: {
     text: null
   },
   xAxis: [{
     categories: categories
   }],
   yAxis: [{
     labels: {
       format: '{value}',
       style: {
         color: Highcharts.getOptions().colors[1]
       }
     },
     title: {
       text: '',
       style: {
         color: Highcharts.getOptions().colors[1]
       }
     },
     min: 0,
     max: 1
   }],

   tooltip: {
     shared: true
   },

   series: [{
     name: 'expected',
     type: 'scatter',
     data: expected,
     tooltip: {
       pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}</b> '
     }
   }, {
     name: 'range',
     type: 'errorbar',
     color: '#fff',
     data: range,
     tooltip: {
       pointFormat: '(range: {point.low}-{point.high})<br/>'
     }
   }, {
     name: 'average',
     type: 'scatter',
     data: average,
     tooltip: {
       pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}</b> '
     }
   }]
  })
}

fetch('/files/ligand-binding-deep-learning-5ht2a75.json').then(function (result) {
 return result.json()
}).then(function (json) {
 var sort = Object.keys(json).sort(function (a, b) {
   return json[a].actual.average - json[b].actual.average
 })

 Object.keys(json).forEach(function (key) {
   var value = json[key]
   var index = sort.indexOf(key)

   categories[index] = key
   expected[index] = value.expected
   range[index] = [value.actual.min, value.actual.max]
   average[index] = value.actual.average
 })
}).then(function () {
 drawDiagram()
})
