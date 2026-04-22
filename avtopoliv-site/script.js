(function(){
    var burger=document.getElementById('burger');
    var nav=document.getElementById('nav');
    burger.addEventListener('click',function(){
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.classList.toggle('nav-open');
    });
    nav.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click',function(){
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.classList.remove('nav-open');
        });
    });

    var header=document.getElementById('header');
    window.addEventListener('scroll',function(){
        if(window.pageYOffset>50){
            header.classList.add('scrolled');
        }else{
            header.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.faq-item__question').forEach(function(btn){
        btn.addEventListener('click',function(){
            var item=btn.parentElement;
            var isOpen=item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open')});
            btn.setAttribute('aria-expanded',!isOpen);
            if(!isOpen) item.classList.add('open');
        });
    });

    document.querySelectorAll('.service-card__toggle').forEach(function(btn){
        btn.addEventListener('click',function(){
            var extra=btn.nextElementSibling;
            var isOpen=extra.classList.contains('open');
            btn.setAttribute('aria-expanded',!isOpen);
            if(isOpen){
                extra.classList.remove('open');
                btn.innerHTML='Подробнее &darr;';
            }else{
                extra.classList.add('open');
                btn.innerHTML='Свернуть &uarr;';
            }
        });
    });

    var N8N_WEBHOOK_URL = 'https://kabanit.ru/webhook/kabanit-form';

    var form = document.getElementById('cta-form');
    var ctaThanks = document.getElementById('cta-thanks');

    function showMessage(text, type) {
        var msg = document.getElementById('formMessage');
        msg.textContent = text;
        msg.className = 'form-message ' + type;
        msg.style.display = 'block';
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(function() { msg.style.display = 'none'; }, 6000);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        var submitBtn = form.querySelector('button[type=submit]');
        if (submitBtn.disabled) return;

        var nameVal = form.querySelector('input[name=name]').value.trim();
        var phoneVal = form.querySelector('input[name=phone]').value.trim();
        var consent = form.querySelector('#consent-cta').checked;
        var areaVal = form.querySelector('select[name=area]').value;

        if (!nameVal) { form.querySelector('input[name=name]').focus(); return; }
        if (!phoneVal || phoneVal.length < 6) { form.querySelector('input[name=phone]').focus(); return; }
        if (!areaVal) { showMessage('Пожалуйста, выберите площадь участка.', 'error'); return; }
        if (!consent) { showMessage('Пожалуйста, дайте согласие на обработку персональных данных.', 'error'); return; }

        var originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';

        var payload = {
            name: nameVal,
            phone: phoneVal,
            city: form.querySelector('input[name=city]').value.trim(),
            area: areaVal,
            consent: consent,
            source: 'avtopoliv-site',
            form_id: 'cta-form',
            page_url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        try {
            var response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            showMessage('✅ Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
            ctaThanks.classList.add('show');
            setTimeout(function() { ctaThanks.classList.remove('show'); }, 4000);
            form.reset();
            var phoneField = form.querySelector('input[name=phone]');
            if (phoneField) phoneField.value = '+7 ';
            submitBtn.textContent = 'Отправлено ✓';
            setTimeout(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 30000);
        } catch (err) {
            showMessage('❌ Ошибка при отправке. Позвоните нам: +7 (937) 322-49-05', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    ctaThanks.addEventListener('click', function(e) {
        if (e.target === ctaThanks) ctaThanks.classList.remove('show');
    });

    var phoneInput=form.querySelector('input[name=phone]');
    phoneInput.addEventListener('focus',function(){
        if(!this.value||this.value.length<3) this.value='+7 ';
    });
    phoneInput.addEventListener('keydown',function(e){
        var pos=this.selectionStart;
        if(pos<3&&(e.key==='Backspace'||e.key==='Delete')){
            e.preventDefault();
        }
    });
    phoneInput.addEventListener('input',function(e){
        var val=e.target.value.replace(/\D/g,'');
        if(!val.startsWith('7')) val='7'+val;
        if(val.length>11) val=val.slice(0,11);
        var f='+7';
        if(val.length>1) f+=' ('+val.slice(1,4);
        if(val.length>4) f+=') '+val.slice(4,7);
        if(val.length>7) f+='-'+val.slice(7,9);
        if(val.length>9) f+='-'+val.slice(9,11);
        e.target.value=f;
    });

    var counters=document.querySelectorAll('.counter');
    var counterObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                var el=entry.target;
                var target=parseInt(el.dataset.target);
                var duration=1500;
                var start=0;
                var startTime=null;
                function animate(timestamp){
                    if(!startTime) startTime=timestamp;
                    var progress=Math.min((timestamp-startTime)/duration,1);
                    var eased=1-Math.pow(1-progress,3);
                    el.textContent=Math.floor(eased*target);
                    if(progress<1) requestAnimationFrame(animate);
                    else el.textContent=target;
                }
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    },{threshold:0.5});
    counters.forEach(function(c){counterObserver.observe(c)});

    var reviewTrack=document.querySelector('.reviews__track');
    var reviewCards=document.querySelectorAll('.review-card');
    var dotsContainer=document.getElementById('review-dots');
    var prevBtn=document.getElementById('review-prev');
    var nextBtn=document.getElementById('review-next');
    var currentSlide=0;
    var totalSlides=reviewCards.length;

    for(var i=0;i<totalSlides;i++){
        var dot=document.createElement('div');
        dot.className='reviews__dot'+(i===0?' active':'');
        dot.dataset.index=i;
        dot.addEventListener('click',function(){
            goToSlide(parseInt(this.dataset.index));
        });
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index){
        currentSlide=index;
        if(currentSlide<0) currentSlide=totalSlides-1;
        if(currentSlide>=totalSlides) currentSlide=0;
        reviewTrack.style.transform='translateX(-'+currentSlide*100+'%)';
        document.querySelectorAll('.reviews__dot').forEach(function(d,i){
            d.classList.toggle('active',i===currentSlide);
        });
    }

    prevBtn.addEventListener('click',function(){goToSlide(currentSlide-1)});
    nextBtn.addEventListener('click',function(){goToSlide(currentSlide+1)});

    var autoSlide=setInterval(function(){goToSlide(currentSlide+1)},5000);
    var slider=document.getElementById('reviews-slider');
    slider.addEventListener('mouseenter',function(){clearInterval(autoSlide)});
    slider.addEventListener('mouseleave',function(){autoSlide=setInterval(function(){goToSlide(currentSlide+1)},5000)});

    var touchStartX=0;
    var touchEndX=0;
    slider.addEventListener('touchstart',function(e){touchStartX=e.changedTouches[0].screenX},false);
    slider.addEventListener('touchend',function(e){
        touchEndX=e.changedTouches[0].screenX;
        var diff=touchStartX-touchEndX;
        if(Math.abs(diff)>50){
            if(diff>0) goToSlide(currentSlide+1);
            else goToSlide(currentSlide-1);
        }
    },false);

    document.querySelectorAll('.tag--city').forEach(function(tag){
        tag.addEventListener('click',function(){
            var city=tag.dataset.city;
            var cityInput=form.querySelector('input[name=city]');
            if(city) cityInput.value=city;
            document.getElementById('cta').scrollIntoView({behavior:'smooth'});
        });
    });

    var waModal=document.getElementById('wa-modal');
    var waClose=document.getElementById('wa-modal-close');
    document.querySelectorAll('[aria-label="WhatsApp"]').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.preventDefault();
            waModal.classList.add('show');
        });
    });
    waClose.addEventListener('click',function(){
        waModal.classList.remove('show');
    });
    waModal.addEventListener('click',function(e){
        if(e.target===waModal) waModal.classList.remove('show');
    });

    var reviewForm=document.getElementById('review-form');
    var thanksModal=document.getElementById('review-thanks');
    reviewForm.addEventListener('submit',function(e){
        e.preventDefault();
        var formData=new FormData(reviewForm);
        var mailBody='Имя: '+formData.get('review_name')+'%0A'+
                     'Город: '+(formData.get('review_city')||'не указан')+'%0A'+
                     'Отзыв: '+formData.get('review_text');
        var mailLink='mailto:kurbanjacordions@mail.ru?subject=Новый отзыв с сайта&body='+mailBody;
        var tempLink=document.createElement('a');
        tempLink.href=mailLink;
        tempLink.click();
        thanksModal.classList.add('show');
        reviewForm.reset();
        setTimeout(function(){thanksModal.classList.remove('show')},3500);
    });
    thanksModal.addEventListener('click',function(e){
        if(e.target===thanksModal) thanksModal.classList.remove('show');
    });

    var revealObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});

    document.querySelectorAll('.service-card,.benefit,.process__step,.price-card,.portfolio-item,.faq-item,.trust__item,.bonus-card').forEach(function(el){
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ── Lightbox ──
    var lb=document.getElementById('lb');
    var lbImg=document.getElementById('lb-img');
    var lbCaption=document.getElementById('lb-caption');
    var lbCounter=document.getElementById('lb-counter');
    var lbClose=document.getElementById('lb-close');
    var lbPrev=document.getElementById('lb-prev');
    var lbNext=document.getElementById('lb-next');
    var lbImages=[];
    var lbIdx=0;

    document.querySelectorAll('.portfolio-item').forEach(function(item){
        var img=item.querySelector('.portfolio-item__img img');
        var title=item.querySelector('.portfolio-item__info h3');
        if(!img) return;
        var idx=lbImages.length;
        lbImages.push({src:img.src,alt:img.alt,caption:title?title.textContent:''});
        item.querySelector('.portfolio-item__img').addEventListener('click',function(){lbOpen(idx);});
    });

    function lbOpen(idx){
        lbIdx=idx;
        lbRender();
        lb.classList.add('show');
        lb.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
    }
    function lbClose2(){
        lb.classList.remove('show');
        lb.setAttribute('aria-hidden','true');
        document.body.style.overflow='';
    }
    function lbRender(){
        var d=lbImages[lbIdx];
        lbImg.src=d.src;
        lbImg.alt=d.alt;
        lbCaption.textContent=d.caption;
        lbCounter.textContent=(lbIdx+1)+' / '+lbImages.length;
    }
    lbClose.addEventListener('click',lbClose2);
    lbPrev.addEventListener('click',function(){lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;lbRender();});
    lbNext.addEventListener('click',function(){lbIdx=(lbIdx+1)%lbImages.length;lbRender();});
    lb.addEventListener('click',function(e){if(e.target===lb)lbClose2();});
    document.addEventListener('keydown',function(e){
        if(!lb.classList.contains('show'))return;
        if(e.key==='Escape')lbClose2();
        if(e.key==='ArrowLeft'){lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;lbRender();}
        if(e.key==='ArrowRight'){lbIdx=(lbIdx+1)%lbImages.length;lbRender();}
    });
    var lbTX=0;
    lb.addEventListener('touchstart',function(e){lbTX=e.changedTouches[0].screenX;},false);
    lb.addEventListener('touchend',function(e){
        var diff=lbTX-e.changedTouches[0].screenX;
        if(Math.abs(diff)>40){
            lbIdx=diff>0?(lbIdx+1)%lbImages.length:(lbIdx-1+lbImages.length)%lbImages.length;
            lbRender();
        }
    },false);

})();
