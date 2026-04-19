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

    var form=document.getElementById('cta-form');
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var formData=new FormData(form);
        var name=formData.get('name')||'Не указано';
        var phone=formData.get('phone')||'Не указан';
        var city=formData.get('city')||'Не указан';
        var area=formData.get('area')||'Не указана';
        var areaLabels={small:'до 6 соток',medium:'6-15 соток',large:'15+ соток',unknown:'Не знаю'};
        var areaText=areaLabels[area]||area;
        var mailBody='Имя: '+name+'%0A'+
                     'Телефон: '+phone+'%0A'+
                     'Населённый пункт: '+city+'%0A'+
                     'Площадь участка: '+areaText;
        var mailLink='mailto:daynnapresse@gmail.com?subject=Заявка на расчёт автополива&body='+mailBody;
        var tempLink=document.createElement('a');
        tempLink.href=mailLink;
        tempLink.click();
        var btn=form.querySelector('button[type=submit]');
        var original=btn.textContent;
        btn.textContent='Заявка отправлена!';
        btn.style.background='var(--g8)';
        btn.disabled=true;
        setTimeout(function(){
            btn.textContent=original;
            btn.style.background='';
            btn.disabled=false;
            form.reset();
            var phoneField=form.querySelector('input[name=phone]');
            if(phoneField) phoneField.value='+7 ';
        },3000);
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
        if(e.target===waModal) return;
    });

    var reviewForm=document.getElementById('review-form');
    var thanksModal=document.getElementById('review-thanks');
    reviewForm.addEventListener('submit',function(e){
        e.preventDefault();
        var formData=new FormData(reviewForm);
        var mailBody='Имя: '+formData.get('review_name')+'%0A'+
                     'Город: '+(formData.get('review_city')||'не указан')+'%0A'+
                     'Отзыв: '+formData.get('review_text');
        var mailLink='mailto:daynnapresse@gmail.com?subject=Новый отзыв с сайта&body='+mailBody;
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

    var style=document.createElement('style');
    style.textContent='.reveal{opacity:0;transform:translateY(30px);transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1)}.reveal.revealed{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);
})();
