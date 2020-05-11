getLastMonths = function(nb){
  const today = new Date();
  let lastMonths = []
  for(var i = nb; i > 0; i--) {
    let d = new Date(today.getFullYear(), today.getMonth() + 1 - i, 1);
    let month = d.getMonth() + 1;
    if(month <10 ){
      month = "0" + month
    }
    let year = d.getFullYear();
    let result = month + "-" + year
    lastMonths.push(result)
  }
  return lastMonths
}

displayLastMonths = function(nb){
  const today = new Date();
  var monthAbv = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  let lastMonths = []
  for(var i = nb; i > 0; i--) {
    let d = new Date(today.getFullYear(), today.getMonth()+1 - i, 1);
    let month = d.getMonth();
    let year = d.getFullYear();
    let result = monthAbv[month] + " " + year
    lastMonths.push(result)
  }
  return lastMonths
}

// Graph 1 //
const canvas1 = document.getElementById("chartStudent1")
let data1 = [
  countApp._0,
  countApp._1,
  countApp._2
]
const chart1 = {
  type: 'doughnut',
  data: { 
    datasets: [{
      data: data1,
      backgroundColor: [
        'rgba(255,190,90, 0.7)',
        'rgba(90, 190, 90, 0.7)',
        'rgba(255, 90, 90, 0.7)'
      ]
    }],
    labels: [
      'Candidatures en cours',
      'Candidatures acceptées',
      'Candidatures refusées'
    ]               
  },
  options: {
    title: {
      display: true,
      text: "Etat des candidatures"
    },
    legend: {
      display: false
    }
  }
};

// Graph 2 //
const canvas2 = document.getElementById("chartStudent2");
  //format data
const lastSixMonths = getLastMonths(6);
let thisMonthMinus5=0, thisMonthMinus4=0, thisMonthMinus3=0, thisMonthMinus2=0, thisMonthMinus1=0, thisMonth=0
for(const log of logs){
  let monthYear = log.postedAt.substring(5,8) + log.postedAt.substring(0,4);
  switch(monthYear){
    case(lastSixMonths[0]):
      thisMonthMinus5++;
      break;
    case(lastSixMonths[1]):
      thisMonthMinus4++;
      break;
    case(lastSixMonths[2]):
      thisMonthMinus3++;
      break;
    case(lastSixMonths[3]):
      thisMonthMinus2++;
      break;
    case(lastSixMonths[4]):
      thisMonthMinus1++;
      break;
    case(lastSixMonths[5]):
      thisMonth++
      break;
  }
}
let data2 = [thisMonthMinus5, thisMonthMinus4, thisMonthMinus3, thisMonthMinus2, thisMonthMinus1, thisMonth]
const chart2 = {
  type: 'bar',
  data: {
    datasets: [{
      data: data2,
      backgroundColor: [
        'rgba(255, 99, 90, 0.3)',
        'rgba(54, 162, 235, 0.3)',
        'rgba(255, 206, 86, 0.3)',
        'rgba(75, 192, 192, 0.3)',
        'rgba(153, 102, 255, 0.3)',
        'rgba(255, 159, 64, 0.3)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }],
    labels: displayLastMonths(6)
  },
  options: {
    title: {
      display: true,
      text: "Activités par mois"
    },
    legend: {
      display: false
    }
  }
}

// Display graphs on load
window.onload = () => {
  new Chart(canvas1, chart1)
  new Chart(canvas2, chart2)
  data1 = ""
  data2 = ""
}