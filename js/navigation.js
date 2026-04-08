function showToast(title,msg,icon){
    document.getElementById('toastTitle').textContent=title;
    document.getElementById('toastMsg').textContent=msg;
    if(icon)document.querySelector('#toastAlert>i').className=icon;
    document.getElementById('toastOverlay').classList.add('show');
    document.getElementById('toastAlert').classList.add('show');
    if(navigator.vibrate)navigator.vibrate(200);
}
function closeToast(){
    document.getElementById('toastOverlay').classList.remove('show');
    document.getElementById('toastAlert').classList.remove('show');
}

// NAV
function navTo(s){
    if(s==='calendar'||s==='map'){s='property';}
    currentSection=s;
    if(typeof gtag==='function')gtag('event','page_view',{page_title:s});
    document.querySelectorAll('.page-section').forEach(el=>el.classList.remove('active'));
    document.getElementById('sec-'+s).classList.add('active');
    document.querySelectorAll('.sidebar-nav .sidebar-btn').forEach(b=>b.classList.remove('active'));
    const sideMap={home:0,property:1,booking:2,reviews:4};
    const si=sideMap[s];if(si!==undefined)document.querySelectorAll('.sidebar-nav .sidebar-btn')[si]?.classList.add('active');
    if(s==='property')document.querySelectorAll('.sidebar-nav .sidebar-btn')[3]?.classList.add('active');
    const mm={home:0,property:1,booking:2,reviews:3};
    document.querySelectorAll('.mob-btn').forEach((b,i)=>{b.classList.toggle('active',i===(mm[s]??-1));});
    if(s==='booking')renderCalendar();
    if(s==='booking'){document.getElementById('formProperty').value=PROPS[currentProp].formValue;calcPrice();}
    window.scrollTo({top:0,behavior:'smooth'});
}

// PROP SWITCH
function switchGlobalProp(p,btn){
    currentProp=p;
    document.querySelectorAll('.prop-switch-btn').forEach(b=>b.classList.remove('active'));
    if(btn)btn.classList.add('active');
    else document.querySelectorAll('.prop-switch-btn').forEach(b=>{
        if((p==='playa'&&b.textContent.includes('Playa'))||(p==='lago'&&b.textContent.includes('Lago')))b.classList.add('active');
    });
    // Apply property theme
    const main=document.querySelector('.main');
    if(main){main.classList.remove('theme-playa','theme-lago');main.classList.add('theme-'+p);}
    // Also apply to sidebar and mobile nav
    const sidebar=document.querySelector('.sidebar');
    if(sidebar){sidebar.classList.remove('theme-playa','theme-lago');sidebar.classList.add('theme-'+p);}
    const mobnav=document.querySelector('.mob-nav');
    if(mobnav){mobnav.classList.remove('theme-playa','theme-lago');mobnav.classList.add('theme-'+p);}
    const pr=PROPS[p];
    calProperty=pr.calProp;renderCalendar();renderPropDetail();renderHomePhotos();
    document.getElementById('mapPlaya').style.display=p==='playa'?'':'none';
    document.getElementById('mapLago').style.display=p==='lago'?'':'none';
    document.getElementById('formProperty').value=pr.formValue;calcPrice();
}

// PROPERTY DETAIL
let galIdx=0,galInt;
function renderPropDetail(){
    const p=PROPS[currentProp],g=document.getElementById('propGallery');
    g.innerHTML=p.images.map((img,i)=>`<img src="${img}" alt="${p.name}" class="${i===0?'active':''}" ${i>0?'loading="lazy"':''} onclick="openLightbox(PROPS['${currentProp}'].images,${i})" style="cursor:zoom-in">`).join('')+
        `<button class="gal-nav prev" onclick="chSlide(-1)"><i class="fas fa-chevron-left"></i></button>`+
        `<button class="gal-nav next" onclick="chSlide(1)"><i class="fas fa-chevron-right"></i></button>`+
        `<div class="gal-dots">${p.images.map((_,i)=>`<div class="gal-dot ${i===0?'active':''}" onclick="goSlide(${i})"></div>`).join('')}</div>`;
    galIdx=0;clearInterval(galInt);galInt=setInterval(()=>chSlide(1),5000);
    document.getElementById('propInfo').innerHTML=`
        <div class="prop-tag ${p.tagClass}"><i class="${p.tagIcon}"></i> ${p.tagText}</div>
        <h2 class="prop-name">${p.name}</h2>
        <p class="prop-desc">${p.desc}</p>
        <div class="amenities">${p.amenities.map(a=>`<div class="amenity"><i class="${a.icon}"></i>${a.t}</div>`).join('')}</div>
        <div class="price-badge"><span class="price">$${p.priceFrom}</span><span class="label">${t('prop.price.from')}</span></div>`;
}
function chSlide(d){const imgs=document.querySelectorAll('#propGallery>img'),dots=document.querySelectorAll('#propGallery .gal-dot');if(!imgs.length)return;imgs[galIdx].classList.remove('active');dots[galIdx]?.classList.remove('active');galIdx=(galIdx+d+imgs.length)%imgs.length;imgs[galIdx].classList.add('active');dots[galIdx]?.classList.add('active');}
function goSlide(i){const imgs=document.querySelectorAll('#propGallery>img'),dots=document.querySelectorAll('#propGallery .gal-dot');if(!imgs.length)return;imgs[galIdx].classList.remove('active');dots[galIdx]?.classList.remove('active');galIdx=i;imgs[galIdx].classList.add('active');dots[galIdx]?.classList.add('active');}
