// CALENDAR
let calMonth=new Date().getMonth(),calYear=new Date().getFullYear(),calProperty='rancho-playa',calBookingType='noche';
const API_URL='https://script.google.com/macros/s/AKfycby97NSFtuo0QZ2t6dQ7x4CN5D9MGIRx1SqaXsBZZglR_ElKM4ALOK1PnhQE58G6jlA/exec';
let bookedDates={'rancho-playa':[],'casa-lago':[]};
let bookedDetails={'rancho-playa':[],'casa-lago':[]};
let checkoutDatesData={'rancho-playa':[],'casa-lago':[]};

// Extraer hora local (El Salvador UTC-6) desde ISO de Google Sheets
function sheetHour(iso){if(!iso||typeof iso!=='string')return null;const m=iso.match(/T(\d{2}):/);if(!m)return null;return(parseInt(m[1])+18)%24;}

async function fetchAvailability(){
    if(!API_URL)return;
    try{
        const r=await fetch(API_URL+'?action=availability');const d=await r.json();
        if(d.success&&d.reservations){bookedDetails=d.reservations;}
        // Guardar bookedDates originales del API (contiene bloqueos manuales)
        const apiBD=d.success&&d.bookedDates?d.bookedDates:{};
        // Reconstruir TODO desde reservations (no confiar en backend)
        if(d.success&&d.reservations){
            for(const prop in d.reservations){
                const bd=[],cod=[];
                const allResDates=new Set();
                d.reservations[prop].forEach(res=>{
                    const ci=res.checkin,co=res.checkout,tipo=res.tipo;
                    const hCI=sheetHour(res.horaCheckin),hCO=sheetHour(res.horaCheckout);
                    const isLate=res.cambioHorario&&hCO!==null&&hCO>=17;
                    const isEarly=res.cambioHorario&&hCI!==null&&hCI<=10;
                    if(tipo==='noche'&&ci&&co){
                        const s=new Date(ci+'T12:00:00'),e=new Date(co+'T12:00:00');
                        const dates=[];
                        for(let dt=new Date(s);dt<=e;dt.setDate(dt.getDate()+1)){
                            dates.push(dt.toISOString().split('T')[0]);
                        }
                        dates.forEach(dd=>{
                            allResDates.add(dd);
                            if(dd===co&&!isLate){
                                // Checkout estandar 1PM: transicion
                                cod.push({date:dd,horaCheckout:hCO||13,lateCheckout:false,type:'checkout'});
                            }else if(dd===ci&&!isEarly){
                                // Checkin estandar 3PM: ocupado + transicion
                                if(!bd.includes(dd))bd.push(dd);
                                cod.push({date:dd,horaCheckin:hCI||15,lateCheckout:false,type:'checkin'});
                            }else{
                                // Dias intermedios o late/early: totalmente bloqueados
                                if(!bd.includes(dd))bd.push(dd);
                                if(dd===co&&isLate){
                                    cod.push({date:dd,horaCheckout:hCO,lateCheckout:true,type:'checkout'});
                                }
                            }
                        });
                    }else if((tipo==='daypass'||tipo==='pareja')&&ci){
                        allResDates.add(ci);
                        if(!bd.includes(ci))bd.push(ci);
                    }
                });
                // Preservar bloqueos manuales del API (fechas no cubiertas por reservas)
                if(apiBD[prop]){
                    apiBD[prop].forEach(dd=>{
                        if(!allResDates.has(dd)&&!bd.includes(dd))bd.push(dd);
                    });
                }
                bookedDates[prop]=bd;
                checkoutDatesData[prop]=cod;
            }
        }else{
            if(d.success&&d.bookedDates)bookedDates=d.bookedDates;
            if(d.success&&d.checkoutDates)checkoutDatesData=d.checkoutDates;
        }
        renderCalendar();
    }
    catch(e){console.log('Cal: local',e);}
}
fetchAvailability();

function getCalMonths(){return t('cal.months').split(',');}
function getCalDays(){return t('cal.days').split(',');}
const CAL_VISIBLE=window.innerWidth>=768?3:1;

function renderSingleMonth(year,month,container){
    const wkdays=document.createElement('div');wkdays.className='cal-weekdays';
    wkdays.innerHTML=getCalDays().map(d=>'<div class="cal-wk">'+d+'</div>').join('');
    container.appendChild(wkdays);
    const grid=document.createElement('div');grid.className='cal-grid';
    const fd=new Date(year,month,1).getDay(),dim=new Date(year,month+1,0).getDate();
    const today=new Date(),ts=today.toISOString().split('T')[0];
    for(let i=0;i<fd;i++){const e=document.createElement('div');e.className='cal-day empty';grid.appendChild(e);}
    for(let d=1;d<=dim;d++){
        const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const e=document.createElement('div');e.className='cal-day';e.textContent=d;e.style.animationDelay=`${d*0.02}s`;
        const dObj=new Date(year,month,d);
        if(dObj<new Date(today.getFullYear(),today.getMonth(),today.getDate()))e.classList.add('past');
        else if(ds===ts)e.classList.add('today');
        else{
            const isBooked=bookedDates[calProperty]&&bookedDates[calProperty].includes(ds);
            const allTrans=(checkoutDatesData[calProperty]||[]).filter(c=>c.date===ds);
            const hasCheckout=allTrans.some(c=>c.type==='checkout'&&!c.lateCheckout);
            const hasCheckin=allTrans.some(c=>c.type==='checkin');
            // Detect late checkout: lateCheckout flag OR horaCheckout contains 6PM
            const hasLate=allTrans.some(c=>c.lateCheckout||((String(c.horaCheckout||'').indexOf('6')!==-1||String(c.horaCheckout||'').indexOf('18')!==-1||String(c.horaCheckout||'').indexOf('19')!==-1)&&c.type==='checkout'));
            const nextD=new Date(year,month,d+1);
            const nextDs=`${nextD.getFullYear()}-${String(nextD.getMonth()+1).padStart(2,'0')}-${String(nextD.getDate()).padStart(2,'0')}`;
            const nextBooked=bookedDates[calProperty]&&bookedDates[calProperty].includes(nextDs);
            const nextHasCheckin=(checkoutDatesData[calProperty]||[]).some(c=>c.date===nextDs&&c.type==='checkin');

            if(isBooked){
                if(hasCheckout&&hasCheckin){
                    e.classList.add('booked');
                    const tip=document.createElement('div');tip.className='cal-tip';
                    tip.innerHTML='<i class="fas fa-exchange-alt"></i> '+t('cal.tip.transition');
                    e.appendChild(tip);
                }else if(hasCheckin&&!hasCheckout){
                    e.classList.add('booked');
                    const tip=document.createElement('div');tip.className='cal-tip';
                    tip.innerHTML='<i class="fas fa-sign-in-alt"></i> '+t('cal.tip.checkin');
                    e.appendChild(tip);
                }else if(hasLate){
                    e.classList.add('booked');
                    const tip=document.createElement('div');tip.className='cal-tip';
                    tip.innerHTML='<i class="fas fa-clock"></i> '+t('cal.tip.late');
                    e.appendChild(tip);
                }else{
                    e.classList.add('booked');
                }
            }else if(allTrans.length>0){
                if(hasCheckout&&hasCheckin){
                    e.classList.add('booked');
                    const tip=document.createElement('div');tip.className='cal-tip';
                    tip.innerHTML='<i class="fas fa-exchange-alt"></i> '+t('cal.tip.transition');
                    e.appendChild(tip);
                }else if(hasCheckout&&!hasCheckin){
                    if((nextBooked&&!nextHasCheckin)||calBookingType==='daypass'||calBookingType==='pareja'){
                        e.classList.add('booked');
                        const tip=document.createElement('div');tip.className='cal-tip';
                        if(calBookingType==='daypass'||calBookingType==='pareja'){
                            tip.innerHTML='<i class="fas fa-ban"></i> '+t('cal.tip.daypass.no')+(calBookingType==='daypass'?'Day Pass':t('form.couple'));
                        }else{
                            tip.innerHTML='<i class="fas fa-ban"></i> '+t('cal.tip.nextblocked');
                        }
                        e.appendChild(tip);
                    }else{
                        e.classList.add('checkout-day');
                        const tip=document.createElement('div');tip.className='cal-tip';
                        tip.innerHTML='<i class="fas fa-sign-out-alt"></i> '+t('cal.tip.checkout');
                        e.appendChild(tip);
                    }
                }else if(hasCheckin&&!hasCheckout){
                    e.classList.add('booked');
                    const tip=document.createElement('div');tip.className='cal-tip';
                    tip.innerHTML='<i class="fas fa-sign-in-alt"></i> '+t('cal.tip.checkin');
                    e.appendChild(tip);
                }
            }else{
                e.classList.add('available');
                e.style.cursor='pointer';
                e.addEventListener('click',function(){selectCalDate(ds);});
                // Price level color-code
                if(typeof isTA==='function'&&typeof isWE==='function'){
                    let pt;if(isTA(ds))pt='ta';else if(isWE(ds))pt='we';else pt='es';
                    e.classList.add('price-'+pt);
                }
            }
            // Mensaje emergente en fechas bloqueadas
            if(e.classList.contains('booked')){
                e.style.cursor='not-allowed';
                e.addEventListener('click',function(){
                    const months=getCalMonths();
                    const dateLabel=d+' de '+months[month];
                    let msg;
                    if(hasCheckout&&hasCheckin){
                        msg='El '+dateLabel+' hay un grupo saliendo y otro entrando. Este día no tiene disponibilidad completa.';
                    }else if(hasCheckin){
                        msg='El '+dateLabel+' ya hay un check-in programado a las 3:00 PM. Esta fecha no está disponible.';
                    }else if(hasLate){
                        msg='El '+dateLabel+' hay una salida extendida hasta las 6:00 PM. No podemos recibir otro grupo ese día.';
                    }else{
                        msg='El '+dateLabel+' ya está reservado. Por favor elegí otra fecha disponible en el calendario.';
                    }
                    showToast('📅 Fecha no disponible', msg, 'fas fa-calendar-times');
                });
            }
        }
        // Checkout days are also clickable (available from 3PM)
        if(e.classList.contains('checkout-day')){
            e.style.cursor='pointer';
            e.addEventListener('click',function(){selectCalDate(ds);});
        }
        // Highlight selected range
        if(calSelCI&&ds===calSelCI)e.classList.add('cal-selected','cal-sel-start');
        if(calSelCO&&ds===calSelCO)e.classList.add('cal-selected','cal-sel-end');
        if(calSelCI&&calSelCO&&ds>calSelCI&&ds<calSelCO)e.classList.add('cal-range');
        grid.appendChild(e);
    }
    container.appendChild(grid);
}

function renderCalendar(){
    const visible=window.innerWidth>=768?3:1;
    const CAL_MONTHS=getCalMonths();
    document.getElementById('calMonthYear').textContent=CAL_MONTHS[calMonth]+' '+calYear;
    const multi=document.getElementById('calMulti');multi.innerHTML='';
    for(let offset=0;offset<visible;offset++){
        let m=calMonth+offset,y=calYear;
        if(m>11){m-=12;y++;}
        const col=document.createElement('div');col.className='cal-month-col';
        if(visible>1){
            const title=document.createElement('div');title.className='cal-month-title';
            title.textContent=getCalMonths()[m]+' '+y;
            col.appendChild(title);
        }
        renderSingleMonth(y,m,col);
        multi.appendChild(col);
    }
}
function changeMonth(d){calMonth+=d;if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;}renderCalendar();}

let calSelCI=null,calSelCO=null;
function selectCalDate(ds){
    const t=calBookingType;
    if(t==='daypass'||t==='pareja'){
        // Single date selection
        calSelCI=ds;calSelCO=null;
        document.getElementById('formCheckin').value=ds;
        toggleDateFields();calcPrice();
        renderCalendar();
        navTo('booking');
        return;
    }
    // Overnight: first click=checkin, second click=checkout
    if(!calSelCI||calSelCO||ds<=calSelCI){
        calSelCI=ds;calSelCO=null;
        document.getElementById('formCheckin').value=ds;
        document.getElementById('formCheckout').value='';
        document.getElementById('formCheckout').min=ds;
        toggleDateFields();calcPrice();
        renderCalendar();
    }else{
        calSelCO=ds;
        document.getElementById('formCheckout').value=ds;
        calcPrice();
        renderCalendar();
        navTo('booking');
    }
}

renderCalendar();
