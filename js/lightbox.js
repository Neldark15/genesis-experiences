// LIGHTBOX / ZOOM GALLERY
(function(){
    let lbImages=[], lbIdx=0, lbEl=null;
    let touchStartX=0, touchEndX=0;

    function createLightbox(){
        if(document.getElementById('lightboxOverlay')) return;
        const el=document.createElement('div');
        el.id='lightboxOverlay';
        el.className='lightbox-overlay';
        el.innerHTML=`
            <button class="lb-close" aria-label="Cerrar">&times;</button>
            <button class="lb-nav lb-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
            <button class="lb-nav lb-next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
            <div class="lb-img-wrap">
                <img class="lb-img" alt="">
            </div>
            <div class="lb-counter"></div>`;
        document.body.appendChild(el);

        // Close on overlay click (outside image)
        el.addEventListener('click',function(e){
            if(e.target===el) closeLightbox();
        });
        el.querySelector('.lb-close').addEventListener('click', closeLightbox);
        el.querySelector('.lb-prev').addEventListener('click', function(){ navigateLb(-1); });
        el.querySelector('.lb-next').addEventListener('click', function(){ navigateLb(1); });

        // Touch swipe
        const wrap=el.querySelector('.lb-img-wrap');
        wrap.addEventListener('touchstart',function(e){ touchStartX=e.changedTouches[0].screenX; },{passive:true});
        wrap.addEventListener('touchend',function(e){
            touchEndX=e.changedTouches[0].screenX;
            const diff=touchStartX-touchEndX;
            if(Math.abs(diff)>50){
                navigateLb(diff>0?1:-1);
            }
        },{passive:true});

        lbEl=el;
    }

    function navigateLb(dir){
        lbIdx=(lbIdx+dir+lbImages.length)%lbImages.length;
        updateLb();
    }

    function updateLb(){
        if(!lbEl) return;
        const img=lbEl.querySelector('.lb-img');
        img.src=lbImages[lbIdx];
        lbEl.querySelector('.lb-counter').textContent=(lbIdx+1)+' / '+lbImages.length;
    }

    window.openLightbox=function(images, startIndex){
        lbImages=images;
        lbIdx=startIndex||0;
        createLightbox();
        updateLb();
        // Show with animation
        requestAnimationFrame(function(){
            lbEl.classList.add('active');
        });
        document.body.style.overflow='hidden';
    };

    function closeLightbox(){
        if(!lbEl) return;
        lbEl.classList.remove('active');
        document.body.style.overflow='';
        setTimeout(function(){
            if(lbEl && !lbEl.classList.contains('active')){
                lbEl.remove();
                lbEl=null;
            }
        },300);
    }
    window.closeLightbox=closeLightbox;

    // Keyboard navigation
    document.addEventListener('keydown',function(e){
        if(!lbEl || !lbEl.classList.contains('active')) return;
        if(e.key==='Escape') closeLightbox();
        else if(e.key==='ArrowLeft') navigateLb(-1);
        else if(e.key==='ArrowRight') navigateLb(1);
    });
})();
