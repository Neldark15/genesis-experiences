// HOME PHOTOS
function renderHomePhotos(){
    const p=PROPS[currentProp];
    const photos=p.images.slice(1,5);
    document.getElementById('homePhotos').innerHTML=photos.map((img,i)=>`<div class="home-photo gcard" onclick="openLightbox(PROPS['${currentProp}'].images,${i+1})" style="cursor:zoom-in"><img src="${img}" alt="${p.name}" loading="lazy"></div>`).join('');
}

// HOME REVIEWS (vertical)
function renderHomeRevs(){
    document.getElementById('homeRevs').innerHTML=REVIEWS.slice(0,4).map((r,i)=>`
        <div class="home-rev" style="animation-delay:${i*0.08}s">
            <div class="home-rev-avatar">${r.src==='google'?'<i class="fab fa-google" style="font-size:.9rem"></i>':r.ini}</div>
            <div class="home-rev-body">
                <div class="home-rev-top"><span class="home-rev-name">${r.name}${r.src==='google'?' <span style="font-size:.65rem;background:rgba(66,133,244,.15);color:#4285f4;padding:1px 6px;border-radius:8px;margin-left:4px">Google</span>':''}</span><span class="home-rev-stars">${'★'.repeat(r.stars)}</span></div>
                <div class="home-rev-text">"${r.text}"</div>
            </div>
        </div>`).join('');
}

// REVIEWS
function renderRevs(){
    document.getElementById('revGrid').innerHTML=REVIEWS.map((r,i)=>`
        <div class="rev-card gcard${r.isUser?' user-rev':''}">
            <div class="rev-top">
                <div class="rev-avatar">${r.src==='google'?'<i class="fab fa-google" style="font-size:.9rem"></i>':r.ini}</div>
                <div class="rev-meta"><div class="rev-name">${r.name}${r.src==='google'?' <span style="font-size:.65rem;background:rgba(66,133,244,.15);color:#4285f4;padding:1px 6px;border-radius:8px;margin-left:4px">Google</span>':''}${r.prop?' <span style="font-size:.62rem;color:var(--text-light);">• '+r.prop+'</span>':''}</div><div class="rev-date">${r.date}</div></div>
                <div class="rev-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
            </div>
            <div class="rev-text">${r.text}</div>
            ${r.photo?'<img class="rev-photo" src="'+r.photo+'" alt="Foto de '+r.name+'" loading="lazy">':''}
            ${r.isUser?`<div class="rev-share-row">
                <button class="btn-share ig" onclick="shareStory(${i})"><i class="fab fa-instagram"></i> Compartir Story</button>
                <button class="btn-share wa" onclick="shareStory(${i})"><i class="fab fa-whatsapp"></i> Compartir</button>
            </div>`:''}
        </div>`).join('');
}
function shareStory(idx){
    const rev=REVIEWS[idx];
    if(rev)generateStoryCard(rev);
}

// ===== REVIEW FORM LOGIC =====
let revPhotoData=null;

function previewRevPhoto(input){
    if(input.files&&input.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            revPhotoData=e.target.result;
            document.getElementById('revPhotoImg').src=revPhotoData;
            document.getElementById('revPhotoPreview').style.display='block';
            document.getElementById('revPhotoArea').style.display='none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function clearRevPhoto(){
    revPhotoData=null;
    document.getElementById('revPhoto').value='';
    document.getElementById('revPhotoPreview').style.display='none';
    document.getElementById('revPhotoArea').style.display='';
}

function submitReview(e){
    e.preventDefault();
    const name=document.getElementById('revName').value.trim();
    const prop=document.getElementById('revProp').value;
    const dateVal=document.getElementById('revDate').value;
    const stars=parseInt(document.querySelector('input[name="revStars"]:checked').value);
    const text=document.getElementById('revText').value.trim();
    if(!name||!prop||!dateVal||!text)return showToast('Campos requeridos','Por favor complete todos los campos.','fas fa-exclamation-circle');

    // Format date
    const [y,m]=dateVal.split('-');
    const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const dateStr=months[parseInt(m)-1]+' '+y;
    const ini=name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();

    // Add to REVIEWS array and re-render
    const newRev={name,ini,stars,date:dateStr,text,prop,photo:revPhotoData,isUser:true};
    REVIEWS.unshift(newRev);
    renderRevs();
    renderHomeRevs();

    // Send to WhatsApp
    const starText='★'.repeat(stars)+'☆'.repeat(5-stars);
    let waMsg=`🌟 *NUEVA RESEÑA - Genesis Experience*\n\n`;
    waMsg+=`👤 *${name}*\n`;
    waMsg+=`🏠 ${prop}\n`;
    waMsg+=`📅 ${dateStr}\n`;
    waMsg+=`${starText} (${stars}/5)\n\n`;
    waMsg+=`💬 "${text}"\n\n`;
    if(revPhotoData)waMsg+=`📸 _El huésped adjuntó una foto_\n\n`;
    waMsg+=`━━━━━━━━━━━━━━━━━━━━━━\n_Reseña desde genesis-experiences.com_`;
    window.open('https://wa.me/50374762493?text='+encodeURIComponent(waMsg),'_blank');

    // Generate story card
    setTimeout(()=>generateStoryCard(newRev),500);

    // Reset form
    document.getElementById('reviewForm').reset();
    document.getElementById('star1').checked=true;
    clearRevPhoto();
    showToast('¡Gracias por tu reseña!','Tu experiencia ha sido publicada.','fas fa-check-circle');
}

// ===== STORY CARD GENERATOR (Canvas) =====
function generateStoryCard(rev){
    const canvas=document.getElementById('storyCanvas');
    const ctx=canvas.getContext('2d');
    const W=1080,H=1920;
    canvas.width=W;canvas.height=H;

    // Background gradient
    const grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,'#1a2d4a');
    grad.addColorStop(0.5,'#2a4a6b');
    grad.addColorStop(1,'#1a2d4a');
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,W,H);

    // Decorative circles
    ctx.globalAlpha=0.06;
    ctx.fillStyle='#7ba8cc';
    ctx.beginPath();ctx.arc(900,200,300,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(180,1700,250,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;

    // Top line accent
    const lineGrad=ctx.createLinearGradient(0,0,W,0);
    lineGrad.addColorStop(0,'#5b8db8');lineGrad.addColorStop(1,'#6bb8d0');
    ctx.fillStyle=lineGrad;
    ctx.fillRect(0,0,W,6);

    // Brand name
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.font='600 28px Outfit, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('GENESIS EXPERIENCE',W/2,80);

    // Subtitle
    ctx.fillStyle='rgba(255,255,255,0.25)';
    ctx.font='300 22px Outfit, sans-serif';
    ctx.fillText('Ranchos Exclusivos en El Salvador',W/2,115);

    const drawContent=(photoImg)=>{
        let yPos=180;

        // Photo section
        if(photoImg){
            const maxPW=W-120,maxPH=700;
            let pw=photoImg.width,ph=photoImg.height;
            const scale=Math.min(maxPW/pw,maxPH/ph);
            pw*=scale;ph*=scale;
            const px=(W-pw)/2;

            // Photo frame
            ctx.save();
            const r=24;
            ctx.beginPath();
            ctx.moveTo(px+r,yPos);ctx.lineTo(px+pw-r,yPos);
            ctx.arcTo(px+pw,yPos,px+pw,yPos+r,r);
            ctx.lineTo(px+pw,yPos+ph-r);
            ctx.arcTo(px+pw,yPos+ph,px+pw-r,yPos+ph,r);
            ctx.lineTo(px+r,yPos+ph);
            ctx.arcTo(px,yPos+ph,px,yPos+ph-r,r);
            ctx.lineTo(px,yPos+r);
            ctx.arcTo(px,yPos,px+r,yPos,r);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(photoImg,px,yPos,pw,ph);
            ctx.restore();

            // Photo border glow
            ctx.strokeStyle='rgba(91,141,184,0.3)';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(px+r,yPos);ctx.lineTo(px+pw-r,yPos);
            ctx.arcTo(px+pw,yPos,px+pw,yPos+r,r);
            ctx.lineTo(px+pw,yPos+ph-r);
            ctx.arcTo(px+pw,yPos+ph,px+pw-r,yPos+ph,r);
            ctx.lineTo(px+r,yPos+ph);
            ctx.arcTo(px,yPos+ph,px,yPos+ph-r,r);
            ctx.lineTo(px,yPos+r);
            ctx.arcTo(px,yPos,px+r,yPos,r);
            ctx.closePath();
            ctx.stroke();

            yPos+=ph+50;
        }else{
            yPos=450;
        }

        // Quote icon
        ctx.fillStyle='rgba(232,169,72,0.3)';
        ctx.font='200px serif';
        ctx.textAlign='center';
        ctx.fillText('\u201C',W/2,yPos+80);

        yPos+=120;

        // Review text (word wrap)
        ctx.fillStyle='#ffffff';
        ctx.font='300 38px Outfit, sans-serif';
        ctx.textAlign='center';
        const words=rev.text.split(' ');
        let line='';
        const lines=[];
        const maxW=W-160;
        for(const w of words){
            const test=line+w+' ';
            if(ctx.measureText(test).width>maxW&&line){
                lines.push(line.trim());
                line=w+' ';
            }else line=test;
        }
        if(line.trim())lines.push(line.trim());
        const maxLines=photoImg?6:10;
        const displayLines=lines.slice(0,maxLines);
        if(lines.length>maxLines)displayLines[maxLines-1]+='...';
        displayLines.forEach((l,i)=>{
            ctx.fillText(l,W/2,yPos+i*52);
        });

        yPos+=displayLines.length*52+50;

        // Stars
        ctx.fillStyle='#e8a948';
        ctx.font='48px serif';
        ctx.textAlign='center';
        ctx.fillText('★'.repeat(rev.stars)+'☆'.repeat(5-rev.stars),W/2,yPos);

        yPos+=60;

        // Divider
        const divGrad=ctx.createLinearGradient(W/2-100,0,W/2+100,0);
        divGrad.addColorStop(0,'rgba(91,141,184,0)');
        divGrad.addColorStop(0.5,'rgba(91,141,184,0.5)');
        divGrad.addColorStop(1,'rgba(91,141,184,0)');
        ctx.fillStyle=divGrad;
        ctx.fillRect(W/2-100,yPos,200,1);

        yPos+=40;

        // Author
        ctx.fillStyle='#ffffff';
        ctx.font='600 36px Outfit, sans-serif';
        ctx.textAlign='center';
        ctx.fillText(rev.name,W/2,yPos);

        yPos+=36;
        ctx.fillStyle='rgba(255,255,255,0.5)';
        ctx.font='300 26px Outfit, sans-serif';
        ctx.fillText(rev.prop+' \u2022 '+rev.date,W/2,yPos);

        // Bottom branding
        ctx.fillStyle='rgba(91,141,184,0.4)';
        ctx.fillRect(60,H-140,W-120,1);

        ctx.fillStyle='rgba(255,255,255,0.6)';
        ctx.font='italic 600 34px "Playfair Display", serif';
        ctx.textAlign='center';
        ctx.fillText('Genesis Experience',W/2,H-85);

        ctx.fillStyle='rgba(255,255,255,0.3)';
        ctx.font='300 22px Outfit, sans-serif';
        ctx.fillText('genesis-experiences.com',W/2,H-50);

        // Show overlay
        document.getElementById('storyOverlay').classList.add('show');
    };

    if(rev.photo){
        const img=new Image();
        img.onload=()=>drawContent(img);
        img.src=rev.photo;
    }else{
        drawContent(null);
    }
}

function downloadStory(){
    const canvas=document.getElementById('storyCanvas');
    const link=document.createElement('a');
    link.download='genesis-experience-resena.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
}
function closeStory(){
    document.getElementById('storyOverlay').classList.remove('show');
}
