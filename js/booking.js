// PRICING
const PRICING={
    'rancho-playa':{maxGuests:16,tiers:[[1,6],[7,12],[13,16]],noche:{finsemana:[250,325,375],entresemana:[150,200,250],temporadaAlta:[300,350,400]},daypass:{finsemana:[175,220,275],entresemana:[100,150,200],temporadaAlta:[225,250,300]},pareja:{doble:75,cuadruple:100}},
    'casa-lago':{maxGuests:10,tiers:[[1,5],[6,10]],noche:{finsemana:[250,350],entresemana:[140,240],temporadaAlta:[250,375]},daypass:{finsemana:[100,150],entresemana:[100,150],temporadaAlta:[175,250]},pareja:{doble:75}}
};
const TEMP_ALTA=[['2026-03-29','2026-04-05'],['2026-07-31','2026-08-06'],['2026-12-20','2027-01-04']];
function isTA(ds){if(!ds)return false;for(const[s,e]of TEMP_ALTA)if(ds>=s&&ds<=e)return true;return false;}
function isWE(ds){const d=new Date(ds+'T12:00:00').getDay();return d===0||d===5||d===6;}
function getTier(p,g){const t=PRICING[p].tiers;for(let i=0;i<t.length;i++)if(g>=t[i][0]&&g<=t[i][1])return i;return t.length-1;}
function cntNights(a,b){return Math.max(1,Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5));}

// Per-night rate calculation
function calcNightlyBreakdown(prop,ci,co,guests){
    const d=PRICING[prop];if(!d)return[];
    const ti=getTier(prop,guests);
    const nights=cntNights(ci,co);
    const result=[];
    const start=new Date(ci+'T12:00:00');
    for(let i=0;i<nights;i++){
        const nd=new Date(start);nd.setDate(nd.getDate()+i);
        const ds=nd.toISOString().split('T')[0];
        let rate,tipo;
        if(isTA(ds)){rate=d.noche.temporadaAlta[ti];tipo='ta';}
        else if(isWE(ds)){rate=d.noche.finsemana[ti];tipo='we';}
        else{rate=d.noche.entresemana[ti];tipo='es';}
        result.push({date:ds,rate,tipo,night:i+1});
    }
    return result;
}

function getNightTypeLabel(tipo){
    const labels={ta:window.t('price.noche.ta'),we:window.t('price.noche.we'),es:window.t('price.noche.wd')};
    return labels[tipo]||'';
}

function getNightTypeShort(tipo){
    const dayNames={ta:'T.Alta',we:'Fin/Sem',es:'Entre/Sem'};
    return dayNames[tipo]||'';
}

function updateGuests(){
    const p=document.getElementById('formProperty').value,tp=document.getElementById('formType').value,s=document.getElementById('formGuests'),pv=s.value;
    const pp=window.t('form.people');
    s.innerHTML='<option value="">'+window.t('form.select')+'</option>';if(!p)return;
    if(tp==='pareja'){if(p==='rancho-playa'){s.innerHTML+='<option value="2">2 '+pp+' ($75)</option><option value="4">4 '+pp+' ($100)</option>';}else{s.innerHTML+='<option value="2">2 '+pp+' ($75)</option>';}}
    else{
        const mx=PRICING[p].maxGuests;
        for(let i=1;i<=mx;i++)s.innerHTML+=`<option value="${i}">${i} ${pp}</option>`;
    }
    if(pv&&s.querySelector(`option[value="${pv}"]`))s.value=pv;
}

function toggleDateFields(){
    const t=document.getElementById('formType').value,cg=document.getElementById('checkoutGroup');
    if(t==='daypass'||t==='pareja'){cg.style.display='none';document.getElementById('formCheckout').required=false;}
    else{cg.style.display='';document.getElementById('formCheckout').required=true;}
    if(calBookingType!==t){calBookingType=t;renderCalendar();}
    updateGuests();calcPrice();
}

function toggleScheduleChange(){
    const checked=document.getElementById('schedChange').checked;
    const opts=document.getElementById('schedOpts');
    if(checked){opts.classList.add('visible');}
    else{
        opts.classList.remove('visible');
        document.getElementById('schedCheckinOpt').value='';
        document.getElementById('schedCheckoutOpt').value='';
        document.getElementById('schedNote').style.display='none';
        updateScheduleDisplay();
    }
    calcPrice();
}

function updateScheduleDisplay(){
    const ciOpt=document.getElementById('schedCheckinOpt').value;
    const coOpt=document.getElementById('schedCheckoutOpt').value;
    document.getElementById('schedCheckin').textContent=ciOpt==='early'?'8:00 AM':'3:00 PM';
    document.getElementById('schedCheckout').textContent=coOpt==='late'?'6:00 PM':'1:00 PM';
    const note=document.getElementById('schedNote');
    if(ciOpt||coOpt){
        let cost=0;
        if(ciOpt==='early')cost+=50;
        if(coOpt==='late')cost+=50;
        let msg='⚠ ';
        if(ciOpt==='early'&&coOpt==='late')msg+=`Entrada 8AM y salida 6PM (+$${cost}). Sujeto a disponibilidad.`;
        else if(ciOpt==='early')msg+='Entrada anticipada 8AM (+$50). Sujeto a disponibilidad.';
        else msg+='Salida extendida hasta 6PM (+$50). Sujeto a disponibilidad.';
        note.textContent=msg;note.style.display='block';
    }else{note.style.display='none';}
}

function getScheduleExtra(){
    if(!document.getElementById('schedChange').checked)return 0;
    const ci=document.getElementById('schedCheckinOpt').value;
    const co=document.getElementById('schedCheckoutOpt').value;
    let cost=0;
    if(ci==='early')cost+=50;
    if(co==='late')cost+=50;
    return cost;
}

function getExtrasTotal(){
    const p=document.getElementById('formProperty').value;
    if(p!=='rancho-playa')return 0;
    const eg=parseInt(document.getElementById('extraGuests').value)||0;
    const er=document.getElementById('extraRoom').checked?50:0;
    return(eg*15)+er;
}

let lastAvailCheck='';
function checkAvailability(showAlert){
    const p=document.getElementById('formProperty').value;
    const t=document.getElementById('formType').value;
    const ci=document.getElementById('formCheckin').value;
    const co=document.getElementById('formCheckout').value;
    const errDiv=document.getElementById('availError');
    const errMsg=document.getElementById('availErrorMsg');

    if(!p||!ci){errDiv.style.display='none';return true;}

    const prop=p;
    const dates=bookedDates[prop]||[];
    const coData=checkoutDatesData[prop]||[];
    const checkKey=p+ci+co+t+document.getElementById('schedCheckinOpt').value+document.getElementById('schedCheckoutOpt').value;

    // === CHECK-IN DATE VALIDATION ===
    if(dates.includes(ci)){
        const m=window.t('avail.booked');
        errMsg.textContent=m;errDiv.style.display='block';
        if(showAlert&&lastAvailCheck!==checkKey)showToast(window.t('toast.unavailable'),m,'fas fa-calendar-times');
        lastAvailCheck=checkKey;return false;
    }

    // Check if checkin date has a transition (checkout or checkin of another booking)
    const ciTransitions=coData.filter(c=>c.date===ci);
    if(ciTransitions.length>0){
        // Detect late checkout: flag OR horaCheckout contains 6PM/18/19
        const hasLate=ciTransitions.some(c=>c.lateCheckout||((String(c.horaCheckout||'').indexOf('6')!==-1||String(c.horaCheckout||'').indexOf('18')!==-1||String(c.horaCheckout||'').indexOf('19')!==-1)&&c.type==='checkout'));
        if(hasLate){
            const m=window.t('avail.late');
            errMsg.textContent=m;errDiv.style.display='block';
            if(showAlert&&lastAvailCheck!==checkKey)showToast(window.t('toast.unavailable'),m,'fas fa-calendar-times');
            lastAvailCheck=checkKey;return false;
        }
        const hasCheckoutOnDate=ciTransitions.some(c=>c.type==='checkout');
        const hasCheckinOnDate=ciTransitions.some(c=>c.type==='checkin');
        // For daypass/pareja: ANY transition means the date is not fully free
        if((t==='daypass'||t==='pareja')&&(hasCheckoutOnDate||hasCheckinOnDate)){
            const m='Esta fecha tiene huéspedes entrando o saliendo. No está disponible para '+(t==='daypass'?'Day Pass':'Promo Pareja')+'.';
            errMsg.textContent=m;errDiv.style.display='block';
            if(showAlert&&lastAvailCheck!==checkKey)showToast(window.t('toast.unavailable'),m,'fas fa-calendar-times');
            lastAvailCheck=checkKey;return false;
        }
        if(hasCheckoutOnDate){
            // Someone checks out this day — can only enter at 3PM, no daypass/pareja
            if(t==='daypass'||t==='pareja'){
                const m=window.t('avail.daypass.no');
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast(window.t('toast.unavailable'),m,'fas fa-calendar-times');
                lastAvailCheck=checkKey;return false;
            }
            const schedCI=document.getElementById('schedCheckinOpt');
            if(schedCI&&schedCI.value==='early'){
                schedCI.value='';updateScheduleDisplay();
                const m=window.t('avail.early.blocked');
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast(window.t('toast.unavailable'),m,'fas fa-clock');
                lastAvailCheck=checkKey;return true;
            }
        }
    }

    // === CHECK-OUT DATE VALIDATION (for noche) ===
    if(t==='noche'&&co){
        // Check if checkout date is fully booked
        if(dates.includes(co)){
            // Checkout date is booked — but check if it's a checkin day with standard 3PM
            const coTransitions=coData.filter(c=>c.date===co);
            const hasCheckinOnCo=coTransitions.some(c=>c.type==='checkin');
            if(!hasCheckinOnCo){
                const m=`La fecha ${co} (checkout) ya está reservada. No puede terminar su estancia ese día.`;
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast('Conflicto de fechas',m,'fas fa-calendar-times');
                lastAvailCheck=checkKey;return false;
            }
            // Has a checkin at 3PM that day — can checkout at 1PM, but block late checkout
            const schedCO=document.getElementById('schedCheckoutOpt');
            if(schedCO&&schedCO.value==='late'){
                schedCO.value='';updateScheduleDisplay();
                const m='Hay huéspedes entrando a las 3PM el día de su salida. Su checkout debe ser a la 1:00 PM.';
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast('Horario restringido',m,'fas fa-clock');
                lastAvailCheck=checkKey;return true;
            }
        }else{
            // Checkout date is not booked — check if has a checkin transition
            const coTransitions=coData.filter(c=>c.date===co&&c.type==='checkin');
            if(coTransitions.length>0){
                // Someone checks in at 3PM this day — can checkout at 1PM but NOT late
                const schedCO=document.getElementById('schedCheckoutOpt');
                if(schedCO&&schedCO.value==='late'){
                    schedCO.value='';updateScheduleDisplay();
                    const m='Hay huéspedes entrando a las 3PM el día de su salida. Su checkout debe ser a la 1:00 PM.';
                    errMsg.textContent=m;errDiv.style.display='block';
                    if(showAlert&&lastAvailCheck!==checkKey)showToast('Horario restringido',m,'fas fa-clock');
                    lastAvailCheck=checkKey;return true;
                }
            }
        }

        // Check intermediate dates
        const start=new Date(ci+'T12:00:00'),end=new Date(co+'T12:00:00');
        for(let d=new Date(start);d<end;d.setDate(d.getDate()+1)){
            const ds=d.toISOString().split('T')[0];
            if(ds===ci||ds===co)continue; // already validated above
            if(dates.includes(ds)){
                const m=`La fecha ${ds} ya está reservada. Su rango incluye fechas ocupadas.`;
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast('Conflicto de fechas',m,'fas fa-calendar-times');
                lastAvailCheck=checkKey;return false;
            }
            // Also check if intermediate date has any transition (would mean overlap)
            const midTrans=coData.filter(c=>c.date===ds);
            if(midTrans.length>0){
                const m=`La fecha ${ds} tiene una reserva parcial. Su rango incluye fechas con huéspedes.`;
                errMsg.textContent=m;errDiv.style.display='block';
                if(showAlert&&lastAvailCheck!==checkKey)showToast('Conflicto de fechas',m,'fas fa-calendar-times');
                lastAvailCheck=checkKey;return false;
            }
        }
    }

    errDiv.style.display='none';
    lastAvailCheck=checkKey;
    return true;
}

function calcPrice(){
    updateGuests();
    const p=document.getElementById('formProperty').value,t=document.getElementById('formType').value,ci=document.getElementById('formCheckin').value,co=document.getElementById('formCheckout').value,g=parseInt(document.getElementById('formGuests').value)||0,pets=parseInt(document.getElementById('formPets').value)||0;
    const disp=document.getElementById('priceDisplay');

    // Show/hide extras section based on property
    const extSec=document.getElementById('extrasSection');
    const extGR=document.getElementById('extraGuestsRow');
    const extRR=document.getElementById('extraRoomRow');
    if(p==='rancho-playa'){
        extSec.style.display='';
        extGR.style.display='flex';
        extRR.style.display='flex';
    }else{
        extSec.style.display='none';
        document.getElementById('extraGuests').value='0';
        document.getElementById('extraRoom').checked=false;
    }

    if(!p||!t||!ci||!g){disp.classList.remove('visible');return;}

    // Check availability (show toast)
    checkAvailability(true);

    let rate=0,nights=1,label='',sub=0,nightlyData=[];const d=PRICING[p];
    if(t==='pareja'){rate=g<=2?d.pareja.doble:(d.pareja.cuadruple||d.pareja.doble);label=window.t('price.couple');sub=rate;}
    else if(t==='daypass'){const ti=getTier(p,g);if(isTA(ci)){rate=d.daypass.temporadaAlta[ti];label=window.t('price.dp.ta');}else if(isWE(ci)){rate=d.daypass.finsemana[ti];label=window.t('price.dp.we');}else{rate=d.daypass.entresemana[ti];label=window.t('price.dp.wd');}sub=rate;}
    else{
        if(!co){disp.classList.remove('visible');return;}
        nights=cntNights(ci,co);
        nightlyData=calcNightlyBreakdown(p,ci,co,g);
        // Apply 3rd night 30% discount
        let thirdNightDiscount=0;
        if(nights>=3&&nightlyData.length>=3){
            thirdNightDiscount=Math.round(nightlyData[2].rate*0.3);
            nightlyData[2].discount=thirdNightDiscount;
            nightlyData[2].finalRate=nightlyData[2].rate-thirdNightDiscount;
        }
        sub=nightlyData.reduce((s,n)=>(n.discount?s+n.finalRate:s+n.rate),0);
        rate=nights>0?Math.round(sub/nights):0;
        // Determine primary label from first night
        if(nightlyData.length>0)label=getNightTypeLabel(nightlyData[0].tipo);
        else label=window.t('price.noche.we');
    }
    const pc=pets*20,schedExtra=getScheduleExtra(),extrasTotal=getExtrasTotal();
    const tot=sub+pc+schedExtra+extrasTotal,dep=Math.ceil(tot*0.4),rem=tot-dep;
    document.getElementById('priceLabel').textContent=label;
    document.getElementById('pricePerNight').textContent=nights>1?'~$'+rate+'/n':'$'+rate;
    // Nightly breakdown
    const bkEl=document.getElementById('nightlyBreakdown');
    if(bkEl){
        if(nightlyData.length>1){
            const dayAbbr=['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
            let html='';
            nightlyData.forEach(n=>{
                const dd=new Date(n.date+'T12:00:00');
                const dayName=dayAbbr[dd.getDay()];
                const shortType=getNightTypeShort(n.tipo);
                if(n.discount){
                    html+=`<div class="price-row breakdown-row"><span>${dayName} ${dd.getDate()} <small class="bk-type">${shortType}</small></span><span class="amt"><s style="opacity:0.5;font-size:0.8em">$${n.rate}</s> $${n.finalRate} <small style="color:var(--accent-dark)">-30%</small></span></div>`;
                }else{
                    html+=`<div class="price-row breakdown-row"><span>${dayName} ${dd.getDate()} <small class="bk-type">${shortType}</small></span><span class="amt">$${n.rate}</span></div>`;
                }
            });
            bkEl.innerHTML=html;bkEl.style.display='block';
        }else bkEl.style.display='none';
    }
    // 3rd night promo banner
    const promoEl=document.getElementById('thirdNightPromo');
    if(promoEl){
        if(t==='noche'&&nights===2&&nightlyData.length===2){
            const ti=getTier(p,g);
            const nextDay=new Date(co+'T12:00:00');
            const nextDs=nextDay.toISOString().split('T')[0];
            let est;if(isTA(nextDs))est=d.noche.temporadaAlta[ti];else if(isWE(nextDs))est=d.noche.finsemana[ti];else est=d.noche.entresemana[ti];
            const disc=Math.round(est*0.3);
            promoEl.innerHTML=`<i class="fas fa-gift"></i> <strong>+1 noche con 30% OFF</strong> — Agregá una 3ª noche por solo $${est-disc} (ahorrás $${disc})`;
            promoEl.style.display='flex';
        }else if(t==='noche'&&nights>=3&&nightlyData.length>=3&&nightlyData[2].discount){
            promoEl.innerHTML=`<i class="fas fa-check-circle" style="color:#4caf50"></i> <strong>¡Descuento aplicado!</strong> — Estás ahorrando $${nightlyData[2].discount} en tu 3ª noche (30% OFF)`;
            promoEl.style.display='flex';
        }else promoEl.style.display='none';
    }
    const nr=document.getElementById('nightsRow');if(t==='daypass'||t==='pareja')nr.style.display='none';else{nr.style.display='flex';document.getElementById('nightsLabel').textContent='x '+nights+' '+(nights>1?window.t('price.nights.plural'):window.t('price.nights'));document.getElementById('subtotalPrice').textContent='$'+sub;}
    const pr=document.getElementById('petsRow');if(pets>0){pr.style.display='flex';document.getElementById('petsLabel').textContent=pets+' '+(pets>1?window.t('price.pets'):window.t('price.pet'))+' x $20';document.getElementById('petsCost').textContent='$'+pc;}else pr.style.display='none';
    const sr=document.getElementById('schedRow');sr.style.display=schedExtra>0?'flex':'none';
    document.getElementById('schedCost').textContent='$'+schedExtra;
    const er=document.getElementById('extrasRow');
    if(extrasTotal>0){er.style.display='flex';document.getElementById('extrasCost').textContent='$'+extrasTotal;
        let elbl=[];const eg=parseInt(document.getElementById('extraGuests').value)||0;
        if(eg>0)elbl.push(eg+' extra'+(eg>1?'s':'')+' $'+eg*15);
        if(document.getElementById('extraRoom').checked)elbl.push('5ta hab $50');
        document.getElementById('extrasLabel').innerHTML='<i class="fas fa-plus-circle"></i> '+elbl.join(' + ');
    }else er.style.display='none';
    document.getElementById('totalPrice').textContent='$'+tot;
    document.getElementById('depositPrice').textContent='$'+dep;
    document.getElementById('remainingPrice').textContent='$'+rem;
    disp.classList.add('visible');
}

function handleBooking(e){
    e.preventDefault();

    // Validate availability
    if(!checkAvailability(true)){
        showToast('No disponible','No se puede completar la reserva. Hay un conflicto de disponibilidad con las fechas seleccionadas.','fas fa-calendar-times');
        return;
    }

    const ps=document.getElementById('formProperty'),pn=ps.options[ps.selectedIndex].text,pv=ps.value;
    const tp=document.getElementById('formType'),tn=tp.options[tp.selectedIndex].text;
    const ci=document.getElementById('formCheckin').value,co=document.getElementById('formCheckout').value;
    const g=document.getElementById('formGuests').value,pets=document.getElementById('formPets').value;
    const nm=document.getElementById('formName').value,dui=document.getElementById('formDUI').value;
    const ph=document.getElementById('formPhone').value,em=document.getElementById('formEmail').value;
    const msg=document.getElementById('formMsg').value;
    const tot=document.getElementById('totalPrice').textContent.replace('$',''),dep=document.getElementById('depositPrice').textContent.replace('$','');
    const schedExtra=getScheduleExtra();
    const ciTime=document.getElementById('schedCheckin').textContent;
    const coTime=document.getElementById('schedCheckout').textContent;
    const extrasTotal=getExtrasTotal();
    const extraGuests=parseInt(document.getElementById('extraGuests').value)||0;
    const extraRoom=document.getElementById('extraRoom').checked;
    let schedDesc='';
    if(schedExtra>0){
        let parts=[];
        if(ciTime==='8:00 AM')parts.push('Entrada 8AM +$50');
        if(coTime==='6:00 PM')parts.push('Salida 6PM +$50');
        schedDesc=`(Cambio de horario: ${parts.join(' + ')})`;
    }
    if(API_URL){
        const ciudad=document.getElementById('formCity')?document.getElementById('formCity').value:'';
        const comoNosConocio=document.getElementById('formSource')?document.getElementById('formSource').value:'';
        fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({_ts:Date.now(),action:'booking',propiedad:pv,tipo:tp.value,checkin:ci,checkout:tp.value==='noche'?co:'',huespedes:g,mascotas:pets,total:tot,anticipo:dep,nombre:nm,dui,telefono:ph,email:em,notas:msg,horaCheckin:ciTime,horaCheckout:coTime,cambioHorario:schedExtra>0,personasExtra:extraGuests,quintaHabitacion:extraRoom,ciudad,como_nos_conocio:comoNosConocio})}).then(r=>r.json()).then(d=>{if(d.success){fetchAvailability();showBookingSuccess(d.id,pn,ci,co,tot,dep);}}).catch(er=>console.log('Backend:',er));
    }
    let t=`*🏝️ Solicitud de Reserva — Genesis Experience*\n\n📍 *Propiedad:* ${pn}\n📋 *Tipo:* ${tn}\n📅 *Fecha:* ${ci}`;
    if(tp.value==='noche'&&co)t+=` → ${co}`;
    t+=`\n🕐 *Check-in:* ${ciTime}\n🕐 *Check-out:* ${coTime}\n`;
    if(schedExtra>0)t+=`⏰ *${schedDesc}*\n`;
    t+=`👥 *Huéspedes:* ${g}\n`;if(parseInt(pets)>0)t+=`🐾 *Mascotas:* ${pets}\n`;
    if(extraGuests>0)t+=`➕ *Personas extra:* ${extraGuests} ($${extraGuests*15})\n`;
    if(extraRoom)t+=`🛏️ *5ta habitación:* Sí ($50)\n`;
    t+=`\n💰 *Total:* $${tot}\n💳 *Anticipo 40%:* $${dep}\n\n👤 *Nombre:* ${nm}\n🪪 *DUI:* ${dui}\n📞 *Tel:* ${ph}\n`;
    const ciudad=document.getElementById('formCity')?document.getElementById('formCity').value:'';
    const comoNosConocio=document.getElementById('formSource')?document.getElementById('formSource').value:'';
    if(em)t+=`📧 *Email:* ${em}\n`;
    if(ciudad)t+=`📍 *Ciudad:* ${ciudad}\n`;
    if(comoNosConocio)t+=`💡 *Nos encontró por:* ${comoNosConocio}\n`;
    if(msg)t+=`\n📝 *Notas:* ${msg}\n`;
    t+=`\n🏦 *Datos para anticipo:*\nBAC | Cuenta de ahorro: *125659128*\nA nombre de: *NELSON BALMORE MORALES MELENDEZ*\nMonto anticipo: *$${dep}*\n\n⚠️ *Tienes 1 día hábil para completar el anticipo o la reserva será eliminada.*\n\n📎 *Respond\u00e9 a este mensaje con la captura de tu comprobante de pago para confirmar tu reserva.*\n\n━━━━━━━━━━━━━━━━━━━━━━\n_Solicitud enviada desde genesis-experiences.com_`;
    if(typeof gtag==='function')gtag('event','booking_submit',{property:pv,type:tp.value,total:tot,guests:g});
    window.open(`https://wa.me/50374762493?text=${encodeURIComponent(t)}`,'_blank');
}

function showBookingSuccess(id,propName,ci,co,tot,dep){
    var compMsg=encodeURIComponent('📎 *Comprobante de pago*\nReserva: *'+(id||'Genesis')+'*\nAnticipo: *$'+dep+'*\n\nAdjunto mi comprobante de transferencia.');
    var overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
    overlay.innerHTML='<div style="background:white;border-radius:20px;padding:28px 24px;max-width:420px;width:100%;text-align:center;font-family:Outfit,sans-serif;">'+
        '<div style="font-size:3rem;margin-bottom:10px;">✅</div>'+
        '<h2 style="color:#1a2d4a;margin-bottom:6px;font-size:1.15em;">'+window.t('success.title')+'</h2>'+
        '<p style="color:#666;font-size:0.85em;margin-bottom:16px;">'+window.t('success.msg')+'</p>'+
        (id?'<div style="background:#f0f7ff;padding:10px;border-radius:10px;margin-bottom:14px;"><span style="font-size:0.75em;color:#666;">'+window.t('success.id')+'</span><br><strong style="font-size:1.1em;color:#1a2d4a;">'+id+'</strong></div>':'')+
        '<div style="text-align:left;background:#f8f9fa;padding:14px;border-radius:10px;font-size:0.85em;margin-bottom:14px;">'+
            '<div style="margin-bottom:5px;">📍 <strong>'+propName+'</strong></div>'+
            '<div style="margin-bottom:5px;">📅 '+ci+(co?' → '+co:'')+'</div>'+
            '<div style="margin-bottom:5px;">💰 Total: <strong>$'+tot+'</strong></div>'+
            '<div>💳 Anticipo: <strong>$'+dep+'</strong></div>'+
        '</div>'+
        '<div style="text-align:left;background:rgba(91,141,184,0.06);border:1px solid rgba(91,141,184,0.15);padding:14px;border-radius:10px;font-size:0.82em;margin-bottom:14px;">'+
            '<div style="font-weight:700;color:#3d7199;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><i class="fas fa-university"></i> Datos para transferencia</div>'+
            '<div style="color:#555;line-height:1.7;">'+
                '<strong>Banco:</strong> BAC<br>'+
                '<strong>Cuenta de ahorro:</strong> 125659128<br>'+
                '<strong>A nombre de:</strong> NELSON BALMORE MORALES MELENDEZ<br>'+
                '<strong>Monto anticipo:</strong> $'+dep+
            '</div>'+
        '</div>'+
        '<div style="background:#fff3cd;border:1px solid #ffe082;padding:10px 14px;border-radius:10px;font-size:0.78em;color:#856404;margin-bottom:16px;display:flex;align-items:center;gap:8px;">'+
            '<i class="fas fa-exclamation-triangle" style="flex-shrink:0;"></i>'+
            '<span>Tienes <strong>1 d\u00eda h\u00e1bil</strong> para completar el anticipo o la reserva ser\u00e1 eliminada.</span>'+
        '</div>'+
        '<a href="https://wa.me/50374762493?text='+compMsg+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;background:#25d366;color:white;border:none;border-radius:12px;font-size:0.92em;font-weight:700;cursor:pointer;font-family:Outfit,sans-serif;text-decoration:none;margin-bottom:10px;">'+
            '<i class="fab fa-whatsapp" style="font-size:1.2em;"></i> Enviar comprobante de pago'+
        '</a>'+
        '<button onclick="this.closest(\'div[style]\').parentElement.remove()" style="padding:10px 28px;background:#f0f0f0;color:#666;border:none;border-radius:10px;font-size:0.85em;font-weight:500;cursor:pointer;font-family:Outfit,sans-serif;">Cerrar</button>'+
    '</div>';
    overlay.addEventListener('click',function(ev){if(ev.target===overlay)overlay.remove();});
    document.body.appendChild(overlay);
}

// ===== VIP CHECK =====
function checkVipStatus(){
    var dui=(document.getElementById('formDUI').value||'').trim();
    if(dui.length>=9)checkVipCard(dui);
}

function checkVipCard(duiParam){
    var dui=duiParam||(document.getElementById('vipDUI')?document.getElementById('vipDUI').value:'');
    dui=(dui||'').trim();
    var cardEl=document.getElementById('vipCard');
    var bannerEl=document.getElementById('vipBanner');
    if(!dui||dui.length<8){
        if(cardEl)cardEl.style.display='none';
        if(bannerEl)bannerEl.style.display='none';
        return;
    }
    var apiUrl=typeof API_URL!=='undefined'?API_URL:null;
    if(!apiUrl)return;

    // Also sync to form DUI field
    var formDUI=document.getElementById('formDUI');
    if(formDUI&&!formDUI.value)formDUI.value=dui;

    fetch(apiUrl+'?action=check_vip&dui='+encodeURIComponent(dui))
        .then(function(r){return r.json();})
        .then(function(d){
            if(!d.success){if(cardEl)cardEl.style.display='none';return;}
            // API retorna: vip:null para 1 reserva, vip:{level,nombre,reservas} para 2+
            // Reclassify: null=cobre(1), bronce(2)=plata, plata(4+)=oro, oro(6+)=oro
            var reservas=d.vip?d.vip.reservas:1;
            var nombre=d.vip?d.vip.nombre:'';
            // Si vip es null y d.success, el DUI fue encontrado con al menos 1 reserva
            // Si el DUI no existe en la base, la API retorna count=0 y vip=null con reservas=0
            // Pero no podemos distinguir — asumimos que si alguien ingresa su DUI, es cliente
            var level,levelName,levelClass,disc,benefits,logo;

            if(d.vip&&reservas>=3){
                level='oro';levelName='ORO';levelClass='vip-oro';disc=15;
                logo='img/logo-gold.jpg';
                benefits=[
                    {icon:'fas fa-percent',text:'15% de descuento en reservas'},
                    {icon:'fas fa-clock',text:'Late checkout gratis (6PM)'},
                    {icon:'fas fa-share-alt',text:'Código de referido activo'},
                    {icon:'fas fa-crown',text:'Prioridad en temporada alta'}
                ];
            }else if(reservas>=2){
                level='plata';levelName='PLATA';levelClass='vip-plata';disc=10;
                logo='img/logo-blue.jpg';
                benefits=[
                    {icon:'fas fa-percent',text:'10% de descuento en reservas'},
                    {icon:'fas fa-sign-in-alt',text:'Check-in prioritario'},
                    {icon:'fas fa-star',text:'Acceso anticipado a promociones'}
                ];
            }else if(reservas>=1){
                level='cobre';levelName='COBRE';levelClass='vip-cobre';disc=5;
                logo='img/logo-blue.jpg';
                benefits=[
                    {icon:'fas fa-percent',text:'5% de descuento en próxima reserva'},
                    {icon:'fas fa-gift',text:'Sorpresa de bienvenida'}
                ];
            }else{
                // vip:null — cliente con 1 reserva o nuevo. Mostrar cobre como bienvenida
                level='cobre';levelName='COBRE';levelClass='vip-cobre';disc=5;
                logo='img/logo-blue.jpg';
                reservas=d.vip?d.vip.reservas:1;
                benefits=[
                    {icon:'fas fa-percent',text:'5% de descuento en pr\u00f3xima reserva'},
                    {icon:'fas fa-gift',text:'Sorpresa de bienvenida'}
                ];
            }

            var duiClean=dui.replace(/[^0-9]/g,'');
            var code='GEN-'+(duiClean.length>=4?duiClean.slice(-4):'0000');

            var benefitsHtml=benefits.map(function(b){
                return '<div class="vc-benefit"><i class="'+b.icon+'"></i> '+b.text+'</div>';
            }).join('');

            var html='<div class="vip-card '+levelClass+'">'+
                '<div class="vc-pattern"></div>'+
                '<div class="vc-shine"></div>'+
                '<div class="vc-header">'+
                    '<img src="'+logo+'" alt="Genesis" class="vc-logo">'+
                    '<span class="vc-level">'+levelName+'</span>'+
                '</div>'+
                '<div class="vc-body">'+
                    '<div class="vc-name">'+(nombre||'Cliente Genesis')+'</div>'+
                    '<div class="vc-member">Miembro Genesis Experience</div>'+
                    '<div class="vc-stats">'+
                        '<div><span class="vc-stat-val">'+reservas+'</span><span class="vc-stat-label">Reservas</span></div>'+
                        '<div><span class="vc-stat-val">'+disc+'%</span><span class="vc-stat-label">Descuento</span></div>'+
                        '<div><span class="vc-stat-val">'+code+'</span><span class="vc-stat-label">Código</span></div>'+
                    '</div>'+
                '</div>'+
                '<div class="vc-benefits">'+benefitsHtml+'</div>'+
                '<div class="vc-footer">Genesis Experience &bull; Club VIP</div>'+
            '</div>';

            if(cardEl){cardEl.innerHTML=html;cardEl.style.display='block';}
            // Also update form banner
            if(bannerEl){
                bannerEl.innerHTML='<span class="vip-emoji">'+(level==='oro'?'🥇':level==='plata'?'🥈':'🥉')+'</span><div><strong>¡Bienvenido de vuelta, '+(nombre||'estimado cliente')+'!</strong><br>Club VIP <strong>'+levelName+'</strong> — '+disc+'% de descuento aplicado</div>';
                bannerEl.style.display='flex';
            }
        })
        .catch(function(){
            if(cardEl)cardEl.style.display='none';
        });
}
