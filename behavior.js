let wrap = document.querySelector('.wrap');
var day = "";
var date = "";

document.querySelectorAll('.member').forEach(function(elm){
    elm.addEventListener('click',function(e){
        if(!this.querySelector('.selected')){
            this.classList.add('selected');
            wrap.classList.add('member-selected'); 
            addCalendar(this.querySelector('.calendar'));
        }
        e.preventDefault();
        e.stopPropagation();
    })
});

document.querySelectorAll('.deselect-member, .restart').forEach(function(elm){
    elm.addEventListener('click',function(e){
        this.parentElement.classList.remove('selected');
        wrap.classList.remove('member-selected');
        wrap.classList.remove('date-selected');
        wrap.classList.remove('slot-selected');
        wrap.classList.remove('booking-complete');
        if(document.querySelector('td.selected') != null){
            document.querySelector('td.selected').classList.remove('selected');
        }
        if(document.querySelector('li.selected') != null){
            document.querySelector('li.selected').classList.remove('selected');
        }
        if(document.querySelector('.member.selected') != null){
            document.querySelector('.member.selected').classList.remove('selected');
        }
        e.preventDefault();
        e.stopPropagation();
    })
});

document.querySelectorAll('.deselect-date').forEach(function(elm){
    elm.addEventListener('click', function(e){
        wrap.classList.remove('date-selected');
        wrap.classList.remove('slot-selected');
        if(document.querySelector('td.selected') != null){
          document.querySelector('td.selected').classList.remove('selected');
      }
        e.preventDefault();
        e.stopPropagation();   
    })
});

document.querySelectorAll('.deselect-slot').forEach(function(elm){
    elm.addEventListener('click', function(e){
        wrap.classList.remove('slot-selected');
        document.querySelector('li.selected').classList.remove('selected');
        e.preventDefault();
        e.stopPropagation();
    });
});

document.querySelectorAll('.form input[type="submit"]').forEach(function(elm){
    elm.addEventListener('click', function(e){
        var name = this.parentElement.querySelector('input[type="text"]').value;
        var mail = this.parentElement.querySelector('input[type="email"]').value;
        var data = 'name='+name+'&mail='+mail+'&day='+day+'&date='+date;
        var ajax = new XMLHttpRequest();
        e.preventDefault();
        e.stopPropagation();
        ajax.onreadystatechange = function(){
          if(ajax.readyState == 4){
              wrap.classList.toggle('booking-complete');
          }
        }
        ajax.open("POST", "toBook.php");
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send(data);
    });
});

  
  function invokeCalendarListener(){
    document.querySelectorAll('.calendar tr:not(.days) td:not(.disabled)').forEach(function(elm){
        elm.addEventListener('click',function(e){
          if(this.getAttribute('class') != null){
            addSlots();
            this.classList.add('selected');
            date = this.innerHTML;
            day = this.getAttribute('data-day');
            document.querySelector('.date').innerHTML = day + ', ' + date;
            setTimeout(function(){
                wrap.classList.add('date-selected');
            },10);
            e.preventDefault();
            e.stopPropagation();
          }
        })
    });
  }
  
  
  function invokeSlotsListener(){
    document.querySelectorAll('.slots li').forEach(function(elm){
        elm.addEventListener('click', function(e){
            this.classList.add('selected');
            wrap.classList.add('slot-selected');
            setTimeout(function(){
                document.querySelector('.selected.member input[name="name"]').addEventListener('focus',function(e){
                })
            }, 700);
            e.preventDefault();
            e.stopPropagation();
        })
    });
  }
  
  
  
  function addSlots(container){
    
    var number = 9;
    var time = ['9','10','11','12','13','14','15','16','17'];
    var endings = ':00';
    var timeDisplay = '';
    var slots = '';
    var front = '';
    for(var i = 0; i < number; i++){
      front = time[i];
      timeDisplay = front + endings;
      slots += '<li>'+timeDisplay+'</li>';
    }
    
    document.querySelector('.selected .slots').innerHTML = slots;
    
    invokeSlotsListener();
  }
  
  function addCalendar(container){
    //get dates
    var today = new Date();
    var day = today.getDay()
    var date = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var first = new Date();
    first.setDate(1);
    var startDay = first.getDay();
    var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    var current = 1 - startDay;
    
    //assemble calendar
    var calendar = '<label class="date"></label><label class="month">'+monthNames[month]+'</label> <label class="year">'+year+'</label>';
    
    calendar += '<table><tr class="days">';
    dayLabels.forEach(function(label){
      calendar += '<th>'+label+'</th>';
    })
    calendar += '</tr><tr>';
    var dayClasses = '';
    while( current <= 30){
      if (current > 0){
        dayClasses = '';
        today.setDate(current);
        if (today.getDay() == 0 || today.getDay() == 6){
          dayClasses += ' disabled';
        }
        if (current < date){
          dayClasses += ' disabled';
        }
        if (current == date){
          dayClasses += ' today';
        }
        calendar += '<td class="'+dayClasses+'" data-day="'+dayNames[(current + startDay)%7]+'">'+current+'</td>';
      } else {
        calendar += '<td></td>';
      }
      
      if ( (current + startDay) % 7 == 0){
        calendar += '</tr><tr>';
      }
      
      current++
    }
    
    calendar += '</tr></table>';
    container.innerHTML = calendar;
    
    invokeCalendarListener();
  }