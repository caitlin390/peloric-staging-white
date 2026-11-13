(function(){
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* mobile menu */
  var bt=document.querySelector('.s-burger'),mm=document.getElementById('s-mm');
  if(bt&&mm)bt.addEventListener('click',function(){var o=mm.hidden;mm.hidden=!o;bt.setAttribute('aria-expanded',o);document.body.classList.toggle('mm-open',o);});
  /* magnetic buttons */
  if(fine)document.querySelectorAll('.btn').forEach(function(b){b.classList.add('mag');
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.2+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)';});
    b.addEventListener('mouseleave',function(){b.style.transform='';});});
  /* shelf drag */
  var sh=document.querySelector('.c-shelf');
  if(sh&&fine){var down=false,sx=0,sl=0,moved=false;
    sh.addEventListener('mousedown',function(e){down=true;moved=false;sx=e.pageX;sl=sh.scrollLeft;sh.classList.add('drag');});
    addEventListener('mouseup',function(){down=false;sh.classList.remove('drag');});
    sh.addEventListener('mousemove',function(e){if(!down)return;e.preventDefault();var d=e.pageX-sx;if(Math.abs(d)>4)moved=true;sh.scrollLeft=sl-d;});
    sh.addEventListener('click',function(e){if(moved){e.preventDefault();}},true);}
  /* hero parallax */
  if(fine)[['.pa-hero','.pa-photo .xf',22],['.cc-hero','.cc-photo .xf',18],['.s-hero','.s-hero-photo img',16]].forEach(function(q){var h=document.querySelector(q[0]),t=document.querySelector(q[1]);if(!h||!t)return;
    h.addEventListener('mousemove',function(e){var r=h.getBoundingClientRect();t.style.translate=(-((e.clientX-r.left)/r.width-.5)*q[2])+'px '+(-((e.clientY-r.top)/r.height-.5)*q[2])+'px';t.style.transition='translate .6s cubic-bezier(.2,.7,.2,1)';});
    h.addEventListener('mouseleave',function(){t.style.translate='0 0';});});
  /* care plan tabs */
  document.querySelectorAll('.d-pt').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.d-pt').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b);});
    document.querySelectorAll('.d-doc').forEach(function(d){d.hidden=d.dataset.p!==b.dataset.p;});});});
  /* audience (men / women) + goal filter */
  function apply(view){var g=view.dataset.g||'',f=view.dataset.f||'';
    view.querySelectorAll('[data-g]:not(button)').forEach(function(el){var okG=!g||el.dataset.g.split(' ').indexOf(g)>-1;var okF=!f||!el.dataset.c||el.dataset.c===f;el.hidden=!(okG&&okF);});
    view.querySelectorAll('.gtog button').forEach(function(b){b.classList.toggle('on',(b.dataset.g||'')===g);b.setAttribute('aria-pressed',(b.dataset.g||'')===g);});}
  document.querySelectorAll('.gtog button').forEach(function(b){b.addEventListener('click',function(){var v=b.closest('.view');v.dataset.g=b.dataset.g;apply(v);try{history.replaceState(null,'',b.dataset.g?'?for='+b.dataset.g:location.pathname);}catch(e){}});});
  document.querySelectorAll('[data-setg]').forEach(function(a){a.addEventListener('click',function(){var v=a.closest('.view');v.dataset.g=a.dataset.setg;apply(v);});});
  document.querySelectorAll('.d-chip').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.d-chip').forEach(function(x){x.classList.toggle('on',x===b);});var v=b.closest('.view');v.dataset.f=b.dataset.f;apply(v);});});
  var qf=new URLSearchParams(location.search).get('for'),vw=document.querySelector('.view');
  if(qf&&vw&&vw.querySelector('.gtog')){vw.dataset.g=qf;apply(vw);}
  /* radar */
  var svg=document.getElementById('radar');
  if(svg){
  var P=[['Metabolic',62,'#1E6A76'],['Recovery',48,'#B5562E'],['Longevity',71,'#5C7A3E'],['Hormones',55,'#9E3A48'],['Focus',80,'#5A7FA6']];
  var R=120,NS='http://www.w3.org/2000/svg';
  function pt(i,r){var a=(-90+i*72)*Math.PI/180;return [Math.cos(a)*r,Math.sin(a)*r];}
  function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  [25,50,75,100].forEach(function(v){svg.appendChild(el('polygon',{points:P.map(function(_,i){return pt(i,R*v/100).join(',')}).join(' '),fill:'none',stroke:'rgba(87,214,193,'+(v===100?.45:.16)+')','stroke-width':1}))});
  P.forEach(function(p,i){var e=pt(i,R);svg.appendChild(el('line',{x1:0,y1:0,x2:e[0],y2:e[1],stroke:'rgba(87,214,193,.16)'}));
    var l=pt(i,R+26),t=el('text',{x:l[0],y:l[1]+4,'text-anchor':Math.abs(l[0])<8?'middle':(l[0]>0?'start':'end'),'class':'lab'});t.textContent=p[0];svg.appendChild(t);});
  var faces=P.map(function(p){var f=el('polygon',{fill:p[2],'fill-opacity':.82,stroke:'#061A1E','stroke-width':2,'stroke-linejoin':'round'});svg.appendChild(f);return f;});
  var outline=el('polygon',{fill:'none',stroke:'#57D6C1','stroke-width':1.5});svg.appendChild(outline);
  var dots=P.map(function(){var d=el('circle',{r:3.5,fill:'#E9E7E1'});svg.appendChild(d);return d;});
  function draw(){var pts=P.map(function(p,i){return pt(i,R*p[1]/100)});
    faces.forEach(function(f,i){var a=pts[i],b=pts[(i+1)%5];f.setAttribute('points','0,0 '+a.join(',')+' '+b.join(','));});
    outline.setAttribute('points',pts.map(function(p){return p.join(',')}).join(' '));
    dots.forEach(function(d,i){d.setAttribute('cx',pts[i][0]);d.setAttribute('cy',pts[i][1]);});
    var ix=document.getElementById('idx');if(ix)ix.textContent=Math.round(P.reduce(function(s,p){return s+p[1]},0)/5);}
  var box=document.getElementById('sliders');
  if(box)P.forEach(function(p,i){var w=document.createElement('label');w.className='sl';w.htmlFor='sl'+i;
    w.innerHTML='<span>'+p[0]+'</span><input id="sl'+i+'" type="range" min="10" max="100" value="'+p[1]+'"><output>'+p[1]+'</output>';
    var inp=w.querySelector('input'),out=w.querySelector('output');inp.style.accentColor=p[2];
    inp.addEventListener('input',function(){p[1]=+inp.value;out.textContent=inp.value;draw();});box.appendChild(w);});
  draw();}
  /* member card tilt */
  var c=document.getElementById('mcard');
  if(c&&fine){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.transform='rotateX('+((.5-y)*14)+'deg) rotateY('+((x-.5)*18)+'deg)';c.style.setProperty('--gx',x*100+'%');c.style.setProperty('--gy',y*100+'%');});
    c.addEventListener('mouseleave',function(){c.style.transform='';});}
  else if(c){c.style.transform='rotateX(8deg) rotateY(-12deg)';}
  /* product option picker */
  var pp=document.querySelector('.s-pdp[data-slug]');
  if(pp){var st={i:0,s:1};var amt=document.getElementById('amt'),begin=document.getElementById('begin');
    var base=(window.ROOT||'')+'consult/'+(window.LOCAL?'index.html':'');var slug=pp.dataset.slug;
    function fmt(v){v=+v;return '$'+(v%1?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):v.toLocaleString('en-US'));}
    function render(){var dose=pp.querySelector('[data-group=dose] .opt.on'),plan=pp.querySelector('[data-group=plan] .opt.on'),sup=document.getElementById('supply3');var price,qs='?p='+slug;
      if(dose){var p1=dose.dataset.p,p3=dose.dataset.p3;if(sup){sup.hidden=!p3;if(!p3)st.s=1;sup.querySelector('.s1').textContent=fmt(p1);if(p3)sup.querySelector('.s3').textContent=fmt(p3);sup.querySelectorAll('.opt').forEach(function(o){o.classList.toggle('on',+o.dataset.s===st.s);});}
        price=(st.s===3&&p3)?p3:p1;qs+='&d='+st.i+'&s='+st.s;}
      else if(plan){price=plan.dataset.p;qs+='&s='+st.i;}
      if(price)amt.textContent=fmt(price);begin.href=base+qs;}
    pp.querySelectorAll('[data-group=dose] .opt,[data-group=plan] .opt').forEach(function(o){o.addEventListener('click',function(){o.parentNode.querySelectorAll('.opt').forEach(function(x){x.classList.remove('on');});o.classList.add('on');st.i=+o.dataset.i;render();});});
    pp.querySelectorAll('[data-group=supply] .opt').forEach(function(o){o.addEventListener('click',function(){st.s=+o.dataset.s;render();});});
    render();}
  /* membership request (prototype) */
  document.querySelectorAll('form[data-proto]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();f.classList.add('done');});});
})();
