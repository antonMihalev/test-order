$(function () {
  app.init();
});

var app = {
  orders: [],
  fields: ['title', 'category', 'deadline', 'status'],
  templateId: '#sprint-template',
  url: 'js/data.json',
  init: getOrders,
}

function getOrders() {
  $.getJSON(this.url, function (data) {
    app.orders = data.slice();
    parseOrders();
  });
}

function parseOrders() {
  app.orders.forEach(function(element){
    buildOrder(element);
  });
}

function buildOrder(element) {
  var order = $(app.templateId)
      .clone()
      .removeAttr('id')
      .css('display', 'flex')
      .addClass('sprint__status_' + element.status);
  var statusBarWidth = element.currentStep / element.steps * 100 + '%';

  app.fields.forEach(function(field){
    order.find('.sprint__' + field).html(element[field]);      
  });

  order.find('.sprint__timeleft').html(getTimeLeft(element.deadline));

  // build status-bar
  order.find('.status-bar__inner').css({'width': statusBarWidth})

  order.appendTo('.content__inner');
}

function getTimeLeft(deadline) {
  var currentDate = new Date();
  var deadlineDate = new Date(deadline + ' ' + currentDate.getFullYear());
  var diffDate = (deadlineDate - currentDate) / (24 * 3600 * 1000);
  var diffResult = '';
  
  console.log(deadlineDate);

  if (diffDate > 1) {
    diffResult = Math.floor(diffDate) + ' days';
  } else {
    diffResult = Math.floor(diffDate* 24)  + ' hours'
  }

  return diffResult + ' left';
}