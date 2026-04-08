// INIT
const tISO=new Date().toISOString().split('T')[0];
document.getElementById('formCheckin').min=tISO;
document.getElementById('formCheckout').min=tISO;
document.getElementById('formCheckin').addEventListener('change',function(){document.getElementById('formCheckout').min=this.value;calcPrice();});
document.getElementById('formProperty').addEventListener('change',function(){updateGuests();calcPrice();});
toggleDateFields();renderPropDetail();renderRevs();renderHomePhotos();renderHomeRevs();
document.getElementById('mapLago').style.display='none';
if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}

// Deep links: /reservas, /disponibilidad, /ubicacion, /resenas
(function(){
    const path=window.location.pathname.replace(/\/$/,'');
    const routes={'/reservas':'booking','/disponibilidad':'booking','/ubicacion':'property','/resenas':'reviews'};
    const sec=routes[path];
    if(sec){setTimeout(function(){navTo(sec);},100);}
})();

// Scroll reveal
(function(){
    const els=document.querySelectorAll('.gcard,.prop-card-home,.rev-card,.price-summary,.rev-form-wrap,.map-card,.home-rev,.quick-item');
    els.forEach(el=>el.classList.add('reveal'));
    const obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}
        });
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    els.forEach(el=>obs.observe(el));
})();
