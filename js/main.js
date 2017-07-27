$(function () {
  app.init();
  customSelectInit();
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

// function sortElement(sortBy){
// 	clearContaner();
// 	console.log(sortBy)
// }

console.log(app.orders);


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

function getStatusOrders(status){
 
  if (status == 'recent') {
    getRecentOrders();
    // alert(status+'status in "if"')
    return;
  }

  clearContainer();

  app.orders.forEach(function(element){
  	// alert(element.status)
    if (element.status === status){
      buildOrder(element);
      // alert(buildOrder(element));
    } 
  	// alert(app.orders.status)
  	console.log(element.status)
  	
  });
}

function getRecentOrders() {
  clearContainer();

  var recent = app.orders.sort(function(a, b) {
    var aDate = new Date(a.createDate);
    var bDate = new Date(b.createDate);
    return bDate - aDate;
  });
   // alert(recent+'statussss')

  recent.forEach(function(element) {
    buildOrder(element);
  }, this);
}

function sortElementsBy(sortBy) {
  var sortedArray = [];
  // 'id', 'deadline', 'price'
    if (sortBy == 'deadline') {
    sortedArray = app.orders.sort(function(a,b){
      return new Date(b[sortBy]) - new Date(a[sortBy]);
    });
  } else {
    sortedArray = app.orders.sort(function(a,b){
      return a[sortBy] - b[sortBy];
    });
  }
   
  clearContainer();

  sortedArray.forEach(function(el){
    buildOrder(el);
  });
}

function clearContainer(){
  $('.content__inner').children().remove();
}

$('.header__status_btn').on('click', function(e){
  getStatusOrders($(this).data('sort'));

  e.preventDefault();
  $(this).removeClass('active');
  $(this).addClass('active');
});

function customSelectInit() {
  var $selectBox = $('#sort-select');

  $selectBox.select2({
    minimumResultsForSearch: Infinity
  });

  $selectBox.on("select2:select", function (e) { 
    sortElementsBy(e.params.data.id);
    // alert(e.params.data.id);
  });
}
// $('.sort-list')
// $('.taskbody')children().remove();