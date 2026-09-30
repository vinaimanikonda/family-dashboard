(function () {
 'use strict';
 var KEY='family-dashboard-v1', state, activeDay='', lastFocus=null, panel='', saveFailed=false;
 var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function el(id){return document.getElementById(id);}
 function pad(n){return n<10?'0'+n:String(n);}
 function dateKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
 function clone(o){return JSON.parse(JSON.stringify(o));}
 function normalize(s){
  if(s && s.version===1 && s.tasks){
   /* Migrate the original two columns without embedding their former labels. */
   if(!s.tasks.person1 && !s.tasks.person2){
    var keys=Object.keys(s.tasks);
    if(keys.length===2){s.tasks={person1:s.tasks[keys[0]],person2:s.tasks[keys[1]]};}
   }
   if(!s.names){s.names=clone(FAMILY_DEFAULTS.names);}
  }
  return s;
 }
 function valid(s){
  if(!s||s.version!==1||!s.tasks||!s.names||typeof s.names.person1!=='string'||typeof s.names.person2!=='string'||!s.completion||typeof s.completion!=='object'||Array.isArray(s.completion)||!s.calendar||!Array.isArray(s.calendar.events)||typeof s.meals!=='string'||typeof s.grocery!=='string'){return false;}
  return ['person1','person2'].every(function(p){return Array.isArray(s.tasks[p])&&s.tasks[p].every(function(t){return t&&typeof t.id==='string'&&typeof t.text==='string';});})&&s.calendar.events.every(function(e){return e&&typeof e.id==='string'&&typeof e.date==='string'&&typeof e.title==='string';});
 }
 try {var raw=localStorage.getItem(KEY);state=normalize(raw?JSON.parse(raw):clone(FAMILY_DEFAULTS));if(!valid(state)){throw new Error('Invalid saved data');}}
 catch(e){state=clone(FAMILY_DEFAULTS);saveFailed=true;}
 function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state));saveFailed=false;}catch(e){saveFailed=true;}
  status();
 }
 function status(){el('save-status').textContent=saveFailed?'Changes are not saved. Storage is unavailable or saved data could not be read.':'Saved on this iPad · new checkboxes each day';el('save-status').className=saveFailed?'notice':'';}
 function currentChecks(){return state.completion[activeDay]||{};}
 function renderTasks(){
  var count=0,total=0,checks=currentChecks();
  ['person1','person2'].forEach(function(person){
   el('name-'+person).textContent=state.names[person];el('initial-'+person).textContent=state.names[person].charAt(0).toUpperCase();
   var box=el(person);box.textContent='';
   state.tasks[person].forEach(function(task){
    var label=document.createElement('label'),input=document.createElement('input'),mark=document.createElement('span'),text=document.createElement('span');
    label.className='task';input.type='checkbox';input.checked=checks[task.id]===true;input.setAttribute('aria-label',task.text);mark.className='check';mark.textContent='✓';mark.setAttribute('aria-hidden','true');text.className='task-text';text.textContent=task.text;
    input.onchange=function(){tick();if(!state.completion[activeDay]){state.completion[activeDay]={};}state.completion[activeDay][task.id]=input.checked;save();renderTasks();var inputs=box.getElementsByTagName('input');for(var i=0;i<inputs.length;i++){if(state.tasks[person][i].id===task.id){inputs[i].focus();break;}}};
    label.appendChild(input);label.appendChild(mark);label.appendChild(text);box.appendChild(label);total++;if(input.checked){count++;}
   });
   if(!state.tasks[person].length){var empty=document.createElement('p');empty.className='empty';empty.textContent='All clear. Enjoy your day!';box.appendChild(empty);}
  });
  el('progress').textContent=count+' of '+total+' done';
 }
 function weekDates(){var now=new Date(),mon=new Date(now.getFullYear(),now.getMonth(),now.getDate());mon.setDate(mon.getDate()-((mon.getDay()+6)%7));var dates=[];for(var i=0;i<7;i++){var d=new Date(mon);d.setDate(mon.getDate()+i);dates.push(d);}return dates;}
 /* Replace this provider function for a future calendar connection; retain normalized events. */
 function eventsForDate(key){return state.calendar.events.filter(function(e){return e.date===key;});}
 function renderWeek(){var dates=weekDates();el('week').textContent='';el('week-range').textContent=months[dates[0].getMonth()].slice(0,3)+' '+dates[0].getDate()+' – '+months[dates[6].getMonth()].slice(0,3)+' '+dates[6].getDate();dates.forEach(function(d){var day=document.createElement('div'),heading=document.createElement('strong'),key=dateKey(d),events=eventsForDate(key);day.className='day'+(key===activeDay?' today':'');heading.textContent=days[d.getDay()]+' '+d.getDate();if(key===activeDay){day.setAttribute('aria-label','Today');}day.appendChild(heading);if(!events.length){events=[{title:'—'}];}events.forEach(function(e){var p=document.createElement('p');p.textContent=e.title;day.appendChild(p);});el('week').appendChild(day);});}
 function tick(){var now=new Date(),key=dateKey(now),h=now.getHours();el('clock').textContent=(h%12||12)+':'+pad(now.getMinutes())+' '+(h<12?'AM':'PM');el('date').textContent=days[now.getDay()]+', '+months[now.getMonth()]+' '+now.getDate();if(key!==activeDay){activeDay=key;var ordinal=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);el('quote').textContent=FAMILY_QUOTES[ordinal%FAMILY_QUOTES.length];el('quote-source').textContent='Daily encouragement · Our family collection';renderTasks();renderWeek();}}
 function close(){el('overlay').hidden=true;document.body.className='';panel='';if(lastFocus){lastFocus.focus();}}
 function button(text,fn,parent){var b=document.createElement('button');b.textContent=text;b.onclick=fn;(parent||el('panel-body')).appendChild(b);return b;}
 function paragraph(text,cls){var p=document.createElement('p');p.textContent=text;p.className=cls||'';el('panel-body').appendChild(p);}
 function editor(label,value,id){var l=document.createElement('label'),t=document.createElement('textarea');l.className='editor';l.textContent=label;t.value=value;t.id=id;l.appendChild(t);el('panel-body').appendChild(l);return t;}
 function lines(value){return value.split(/\r?\n/).map(function(s){return s.trim();}).filter(function(s){return s.length>0;});}
 function commit(){save();renderTasks();renderWeek();if(saveFailed){paragraph('Could not save. Keep this panel open and copy your changes before closing.','notice');}else{close();}}
 function open(name){
  if(el('overlay').hidden){lastFocus=document.activeElement;}panel=name;el('panel-body').textContent='';el('overlay').hidden=false;document.body.className='modal-open';
  var titles={more:'Family tools',names:'Edit names',tasks:'Edit daily tasks',week:'Plan this week',meals:'Meals',grocery:'Grocery'};el('panel-title').textContent=titles[name];
  if(name==='more'){
   paragraph('A little planning for the days ahead.');var menu=document.createElement('div');menu.className='menu';el('panel-body').appendChild(menu);
   button('Edit names',function(){open('names');},menu);button('Edit daily tasks',function(){open('tasks');},menu);button('Plan this week',function(){open('week');},menu);
   paragraph('Tasks repeat daily. Checkmarks reset at local midnight. Everything you enter stays in this browser on this device; it does not sync to other devices.','help');
  }else if(name==='names'){
   paragraph('Names are saved only in this browser on this device. They are not sent to GitHub. Leave a name blank to use its generic label.');
   ['person1','person2'].forEach(function(p,i){var l=document.createElement('label'),input=document.createElement('input');l.className='editor';l.textContent='Child '+(i+1);input.type='text';input.id='edit-name-'+p;input.value=state.names[p];input.maxLength=40;input.autocomplete='off';input.setAttribute('autocorrect','off');input.spellcheck=false;l.appendChild(input);el('panel-body').appendChild(l);});
   button('Save names',function(){['person1','person2'].forEach(function(p){state.names[p]=el('edit-name-'+p).value.trim().slice(0,40)||FAMILY_DEFAULTS.names[p];});commit();}).className='primary';
  }else if(name==='tasks'){
   paragraph('One task per line. These repeat every day. Keep about four per person for the clearest home screen.');
   editor(state.names.person1,state.tasks.person1.map(function(t){return t.text;}).join('\n'),'edit-person1');editor(state.names.person2,state.tasks.person2.map(function(t){return t.text;}).join('\n'),'edit-person2');
   button('Save tasks',function(){['person1','person2'].forEach(function(p){var old=state.tasks[p].slice();state.tasks[p]=lines(el('edit-'+p).value).map(function(text){for(var i=0;i<old.length;i++){if(old[i].text===text){return old.splice(i,1)[0];}}return {id:p+'-'+Date.now()+'-'+Math.random().toString(36).slice(2),text:text};});});commit();}).className='primary';
  }else if(name==='week'){
   paragraph('One event per line. Plans are saved for these dates, not repeated weekly.');var dates=weekDates();dates.forEach(function(d,i){editor(days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate(),eventsForDate(dateKey(d)).map(function(e){return e.title;}).join('\n'),'day-'+i);});
   button('Save week',function(){var keys=dates.map(dateKey);state.calendar.events=state.calendar.events.filter(function(e){return keys.indexOf(e.date)===-1;});dates.forEach(function(d,i){lines(el('day-'+i).value).forEach(function(t,j){state.calendar.events.push({id:dateKey(d)+'-'+j,date:dateKey(d),title:t,source:'local'});});});commit();}).className='primary';
  }else{
   paragraph(name==='meals'?'Keep a simple meal plan here.':'Keep your shopping list here, one item per line.');editor(name==='meals'?'Meal notes':'Shopping list',state[name],'notes');button('Save',function(){state[name]=el('notes').value;commit();}).className='primary';
  }
  el('close').focus();
 }
 el('close').onclick=close;
 var buttons=document.querySelectorAll('[data-panel]');for(var i=0;i<buttons.length;i++){buttons[i].onclick=function(){open(this.getAttribute('data-panel'));};}
 document.addEventListener('keydown',function(e){if(el('overlay').hidden){return;}if(e.key==='Escape'||e.keyCode===27){close();return;}if(e.key==='Tab'||e.keyCode===9){var focusable=el('overlay').querySelectorAll('button,textarea,input'),first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 window.addEventListener('pageshow',tick);document.addEventListener('visibilitychange',tick);
 window.addEventListener('storage',function(e){if(e.key===KEY&&e.newValue){try{var incoming=normalize(JSON.parse(e.newValue));if(valid(incoming)){state=incoming;renderTasks();renderWeek();}}catch(ignore){}}});
 tick();status();setInterval(tick,15000);
 if('serviceWorker' in navigator && window.location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js').catch(function(){/* Online dashboard remains usable without offline caching. */});}
}());
