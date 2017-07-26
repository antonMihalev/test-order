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

  order.find('.sprint__status').html(isStatusMessage(element.statusMessage));

  // build status-bar
  order.find('.status-bar__inner').css({'width': statusBarWidth});

  //build bids
  if (!element.assigned.name) order.find('.sprint__assigned').html('<p>' +element.bids +' bids</p>');

  //build assigned
  order.find('.sprint__assigned_photo').html('<a href="#"><img src="'+ element.assigned.icon +'" alt="'+ element.assigned.name +'"></a>');
  order.find('.sprint__descr_nickname').html('<p>'+ element.assigned.name +'</p>');
  order.find('.sprint__descr_rating').html('<p>'+ element.assigned.rate +'</p>');

  //build price
  order.find('.sprint__price_general').html('$'+element.price);
  order.find('.sprint__price_paid').html('$'+element.paid);

  //build id
  order.find('.sprint__id').html('<p>#'+ element.id +'</p>');



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

function isStatusMessage(message){
  if(message){
  	return message;
  }  
}

