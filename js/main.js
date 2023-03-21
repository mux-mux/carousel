window.addEventListener('DOMContentLoaded', () => {
  //Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContainer = document.querySelector('.tabheader__items'),
    tabContent = document.querySelectorAll('.tabcontent');

  function hideTabContent() {
    tabs.forEach((tab) => {
      tab.classList.remove('tabheader__item_active');
    });

    tabContent.forEach((content) => {
      content.classList.add('sidepanel__hide');
      content.classList.remove('sidepanel__show');
    });
  }

  function showTabContent(i = 0) {
    tabs[i].classList.add('tabheader__item_active');

    tabContent[i].classList.remove('sidepanel__hide');
    tabContent[i].classList.add('sidepanel__show');
  }

  hideTabContent();
  showTabContent();

  tabsContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, i) => {
        if (target == tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer
  const deadline = '2023-03-12';

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(total / (1000 * 60 * 60 * 24)),
      hours = Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((total / 1000 / 60) % 60),
      seconds = Math.floor((total / 1000) % 60);

    return {
      total: total,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = t.days;
      hours.innerHTML = t.hours;
      minutes.innerHTML = t.minutes;
      seconds.innerHTML = t.seconds;

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock('.timer', deadline);

  //Modal
  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('sidepanel__hide');
    modal.classList.remove('sidepanel__show');
    document.body.style.overflow = '';
  }
  function openModal() {
    modal.classList.add('sidepanel__show');
    modal.classList.remove('sidepanel__hide');
    document.body.style.overflow = 'hidden';
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  //Class for Cards

  /* -> #1*/
  class ItemCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.classes = classes;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.course = 27;
      //this points to current object
      //call method convertUSDUAH to trigger convertion
      this.convertUSDUAH();
    }

    convertUSDUAH() {
      this.price = this.price * this.course;
    }

    render() {
      const div = document.createElement('div');
      if (this.classes.length === 0) {
        this.div = 'menu__item';
        div.classList.add(this.div);
      } else {
        this.classes.forEach((className) => div.classList.add(className));
      }
      div.innerHTML = `
        <img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(div);
    }
  }

  //AsyncAwait
  // 1.postData = async(url,data)=> await res.json()
  // 2.call postData(url, json).then().catch().fianlly()
  // 3.json = JSON.stringify(Object.fromEntries(formData.entries()))
  // 4.getResource = async(url) => if(!res.ok) throw new Error('') else return await res.json()
  // 5.call getResource('url').then(data=>{data.forEach(({destruct})=>{new ItemCard(redestruct).render()})})

  const getResource = async (url) => {
    const res = await fetch(url);
    //fetch only OK when status 200-299
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getResource('http://localhost:3000/menu').then((data) => {
    //why response Array -> look at db.json -> menu
    //destructuring -> const img = obj.img, altimg = obj.altimg
    data.forEach(({ img, altimg, title, descr, price }) => {
      //new ItemCard points to -> #1
      //why new -> prototype of ItemCard. prototype inherits props & methods of Class ItemCard
      new ItemCard(
        img,
        altimg,
        title,
        descr,
        price,
        '.menu .container'
      ).render();
    });
  });

  // Forms
  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'icons/spinner.svg',
    success: 'Thanks! We will call you soon!',
    failure: 'Error happened. Try once again!',
    remove: function () {
      console.log('a');
    },
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  //arrow function when context does not matter
  const postData = async (url, data) => {
    //fetch returns object -> fetch(url).then(succCallBackFn, failureCallBackFn);
    //await waits for result returned
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: data,
    });
    //If no awaits -> go further without waiting result
    //await bcs could be huge response body and it`ll take time to handel it
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      // form.insert(statusMessage);
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form); //form must have attr name

      //  Arrays                Object                              JSON
      //.entries [[], []] |  .fromEntries {key:val, key:val}  |  .stringify {'key': val, 'key': val}
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          message.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  //SHOW THANKS

  function showThanksModal(msg) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('sidepanel__hide');
    openModal();

    const thankModal = document.createElement('div');
    thankModal.classList.add('modal__dialog');
    thankModal.innerHTML = `
    <div class="modal__content">
      <div class="modal__close" data-close>x</div>
      <div class="modal__title">${msg}</div>
    </div>
    `;

    document.querySelector('.modal').append(thankModal);

    setTimeout(() => {
      thankModal.remove();
      prevModalDialog.classList.add('sidepanel__show');
      prevModalDialog.classList.remove('sidepanel__hide');
      closeModal();
    }, 4000);
  }

  //JSON DB   npx json-server db.json
  fetch('http://localhost:3000/menu')
    .then((data) => data.json())
    .then((res) => console.log(res));

  //CAROUSEL
  //1. query slides, prev, next, total slides counter, current slide number, slidesWrapper-overflow, slidesInner-400%, set width as wrapper width, index = 1, offset = 0
  //2. set styles inner = 100 * 4 '%', disp=flex, transit=0.5s all
  //3. set wrapper overflow=hidden
  //4. set each slide width = wrapper width
  //5. next addEv if(offset == int(width)*sl.len-1) offset 0 else offset += int(width) transform translateX${offset}
  //6. prev addEv if(offset == 0) offset int(width)*sl.len-1 else offset -= int(width) transform translateX${offset}
  //7. numbers next if(slideIndex==length) 1 else ++ if(slides.length<10) 0slides.length else slides.length
  //8. numbers prev if(slideIndex==1) slides.length else -- if(slides.length<10) 0slides.length else slides.length

  const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;
  let slideIndex = 1,
    offset = 0;

  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  next.addEventListener('click', () => {
    if (offset == parseInt(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += parseInt(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
    dots.forEach((dot) => dot, (style.opacity = '.5'));
    dots[slideIndex - 1].style.opacity = 1;
  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = parseInt(width) * (slides.length - 1);
    } else {
      offset -= parseInt(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
    dots.forEach((dot) => dot, (style.opacity = '.5'));
    dots[slideIndex - 1].style.opacity = 1;
  });

  //NAVS Carousel
  //1. query whole slider not only wrapper position relative, dots []
  //2. create indic = ol.carousel-indicators cssText abs,0,0,0,z15,df,jcc,mr15%,ml15%,lsn
  //3. add nav wrapper slider.append(indic)
  //4. loop make circles count of total slides craete li setAttr('data-slide-to', i+1)
  //5. cssText bx-sz cont-box fl 0 1 auto w30 h6 mr3 ml 3 curp bgc#fff bgclip padd-box bt 10 sol trans bb 10 sol trans op .5 transit op .6s ease indic.append(dot) dots.push(dot)
  //6. add active class if i == 0 op = 1
  //7. click left right move slide num prev, next dots.each op .5 dots[slideIndex - 1].style.opacity = 1
  //9. click dot move to slide num dot.each slideIndex = e get attr data-slide-to
  //8. ^ offset int(width)*slTo-1 transform translateX${offset}
  //9. ^ click dot move to slide num dot.each slideIndex = e get attr data-slide-to
  //10. ^ if(slides.length<10) 0slides.length else slides.length

  const slider = document.querySelector('.offer__slider');

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
    dots = [];

  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
  `;
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 6px;
      margin-right: 3px;
      margin-left: 3px;
      cursor: pointer;
      background-color: #fff;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;
    `;
    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      slideIndex = slideTo;
      offset = parseInt(width) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      dots.forEach((dot) => dot, (style.opacity = '.5'));
      dots[slideIndex - 1].style.opacity = 1;

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }
    });
  });
});
