// Общие эффекты, кнопка "показать пароль" и логика чат-бота
(() => {
  const bar = document.createElement('div'); bar.id = 'progress';
  const glow = document.createElement('div'); glow.id = 'glow';
  document.body.append(bar, glow);

  const nav = document.querySelector('nav');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) * 100 + '%';
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 20);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  // волна при клике
  document.addEventListener('click', e => {
    const b = e.target.closest('button:not(.eye),.navbtn,.left a'); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const s = document.createElement('span'); s.className = 'ripple';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 600);
  });

  // кнопка "глаз" у всех полей пароля
  const svg = p => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const EYE = svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>');
  const OFF = svg('<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>');
  document.querySelectorAll('input[type=password]').forEach(inp => {
    const w = document.createElement('div'); w.className = 'pw-wrap';
    w.style.marginBottom = getComputedStyle(inp).marginBottom; inp.style.marginBottom = '0';
    inp.parentNode.insertBefore(w, inp); w.appendChild(inp);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'eye';
    b.setAttribute('aria-label', 'Показать пароль'); b.innerHTML = EYE;
    b.onclick = () => {
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password'; b.innerHTML = show ? OFF : EYE;
      b.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    };
    w.appendChild(b);
  });

  // === Интерактивный Чат-бот ===
  const chatBox = document.getElementById('chatBox');
  const openBtn = document.getElementById('openChatBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const heroBtn = document.getElementById('heroChatBtn');
  const navBtn = document.getElementById('navChatBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMsgs = document.getElementById('chatMsgs');

  const toggleChat = (show) => {
    if (!chatBox) return;
    if (show === undefined) chatBox.classList.toggle('open');
    else if (show) chatBox.classList.add('open');
    else chatBox.classList.remove('open');
    if (chatBox.classList.contains('open')) {
      chatInput?.focus();
    }
  };

  if (openBtn) openBtn.onclick = () => toggleChat(true);
  if (closeBtn) closeBtn.onclick = () => toggleChat(false);
  if (heroBtn) heroBtn.onclick = () => toggleChat(true);
  if (navBtn) navBtn.onclick = () => toggleChat(true);

  if (chatForm) {
    chatForm.onsubmit = (e) => {
      e.preventDefault();
      const txt = chatInput.value.trim();
      if (!txt) return;

      // Отрисовка сообщения пользователя
      const uMsg = document.createElement('div');
      uMsg.className = 'cm me';
      uMsg.textContent = txt;
      chatMsgs.appendChild(uMsg);
      chatInput.value = '';
      chatMsgs.scrollTop = chatMsgs.scrollHeight;

      // Эффект печати бота
      const typing = document.createElement('div');
      typing.className = 'cm bot typing';
      typing.textContent = 'Печатает...';
      chatMsgs.appendChild(typing);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const reply = getBotReply(txt);
        const bMsg = document.createElement('div');
        bMsg.className = 'cm bot';
        bMsg.textContent = reply;
        chatMsgs.appendChild(bMsg);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
      }, 700);
    };
  }

  function getBotReply(q) {
    const s = q.toLowerCase();
    if (s.includes('привет') || s.includes('здравствуй') || s.includes('добрый')) {
      return 'Здравствуйте! Рад вас приветствовать. Как я могу помочь вам сегодня?';
    }
    if (s.includes('цена') || s.includes('стоимость') || s.includes('тариф') || s.includes('сколько')) {
      return 'У нас есть 3 тарифа: \n1. Старт — Бесплатно 14 дней.\n2. Бизнес — 29 000 ₸/мес.\n3. Корпоративный — индивидуально.\nПодробнее можно узнать в разделе "Тарифы"!';
    }
    if (s.includes('пробн') || s.includes('бесплатн')) {
      return 'Вы можете протестировать систему бесплатно в течение 14 дней! Банковская карта не требуется.';
    }
    if (s.includes('crm') || s.includes('интеграц') || s.includes('данны')) {
      return 'NeuroFlow легко интегрируется с вашей CRM, сервисами аналитики, службой поддержки и платежными системами.';
    }
    if (s.includes('контакт') || s.includes('поддержка') || s.includes('связаться')) {
      return 'Вы можете оставить заявку через форму внизу страницы или написать нам на почту поддержки!';
    }
    return 'Спасибо за вопрос! Вы можете опробовать все функции NeuroFlow бесплатно, зарегистрировавшись прямо сейчас, или оставить заявку на консультацию через форму на сайте.';
  }
})();
