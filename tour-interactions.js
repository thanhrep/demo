(() => {
  const packages = [
    { value: 'Classic Loop', title: 'Vòng lặp cổ điển', days: '3 ngày / 2 đêm', area: 'Quản Bạ · Đồng Văn · Du Già', price: '165–209 USD', short: 'Cung đường đặc trưng qua những đèo núi và bản làng Hà Giang.', image: 'bg-01.jpg', intro: 'Hành trình vừa đủ để chạm vào những cảnh sắc đặc trưng nhất của cao nguyên đá.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Yên Minh', 'Ngày 2 · Đồng Văn – đèo Mã Pí Lèng – Du Già', 'Ngày 3 · Du Già – Hà Giang'], highlights: ['Cổng trời Quản Bạ và cung đường đá', 'Ngắm sông Nho Quế từ đèo Mã Pí Lèng', 'Nghỉ tại homestay địa phương'], includes: 'Xe đưa đón theo tuyến, hướng dẫn viên bản địa, 2 đêm lưu trú và bữa sáng.' },
    { value: 'Big Loop', title: 'Vòng lặp lớn', days: '4 ngày / 3 đêm', area: 'Lũng Cú · Đồng Văn · Mèo Vạc', price: '180–280 USD', short: 'Thêm thời gian khám phá Lũng Cú, chợ phiên và các làng miền núi.', image: 'bg-02.jpg', intro: 'Phiên bản thong thả hơn của cung đường kinh điển, dành cho người muốn dừng lại lâu hơn.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Yên Minh', 'Ngày 2 · Yên Minh – Lũng Cú – Đồng Văn', 'Ngày 3 · Mã Pí Lèng – Mèo Vạc – Du Già', 'Ngày 4 · Du Già – Hà Giang'], highlights: ['Cột cờ Lũng Cú và phố cổ Đồng Văn', 'Chợ địa phương theo lịch phiên', 'Một đêm yên tĩnh giữa thung lũng'], includes: 'Xe theo đoàn nhỏ, hướng dẫn viên, 3 đêm lưu trú, bữa sáng và vé điểm tham quan cơ bản.' },
    { value: 'Private Escape', title: 'Kỳ nghỉ riêng tư', days: '4 ngày / 3 đêm', area: 'Lộ trình tùy chỉnh', price: 'Từ 390 USD', short: 'Tài xế riêng, điểm dừng linh hoạt và nhịp đi được thiết kế cho bạn.', image: 'bg-03.jpg', intro: 'Một chuyến đi riêng tư để bạn tự chọn nhịp độ, thời gian dừng và nơi muốn khám phá.', route: ['Ngày 1 · Đón tại Hà Giang, khởi hành theo giờ riêng', 'Ngày 2 · Tùy chọn Lũng Cú hoặc làng nghề', 'Ngày 3 · Mã Pí Lèng và trải nghiệm theo sở thích', 'Ngày 4 · Trở về Hà Giang'], highlights: ['Xe riêng và tài xế địa phương', 'Có thể thay đổi điểm dừng', 'Tư vấn lưu trú theo ngân sách'], includes: 'Xe riêng, tài xế, tư vấn lịch trình và hỗ trợ đặt chỗ nghỉ.' },
    { value: 'Sunrise Valley Stay', title: 'Bình minh thung lũng', days: '3 ngày / 2 đêm', area: 'Du Già · thung lũng bản địa', price: 'Từ 245 USD', short: 'Thức dậy giữa thung lũng, ăn sáng tại bản và ngắm bình minh trên núi.', image: 'bg-04.jpg', intro: 'Một kỳ nghỉ nhẹ nhàng, ưu tiên thời gian nghỉ ngơi và những buổi sáng trong trẻo.', route: ['Ngày 1 · Hà Giang – Du Già, nhận phòng homestay', 'Ngày 2 · Ngắm bình minh, đi bộ bản làng và thác nước', 'Ngày 3 · Ăn sáng cùng chủ nhà, trở về Hà Giang'], highlights: ['Ngắm bình minh gần nơi lưu trú', 'Bữa sáng cùng gia đình bản địa', 'Đi bộ ngắn, phù hợp lịch trình thư giãn'], includes: '2 đêm homestay, bữa sáng, hướng dẫn viên địa phương và xe tuyến cơ bản.' },
    { value: 'Family Escape', title: 'Hành trình gia đình', days: '5 ngày / 4 đêm', area: 'Tuyến nhẹ · phòng gia đình', price: 'Từ 295 USD', short: 'Nhịp đi chậm, phòng gia đình và các điểm dừng phù hợp nhiều lứa tuổi.', image: 'bg-05.jpg', intro: 'Lịch trình linh hoạt với chặng đường vừa phải, nơi nghỉ thoải mái và nhiều khoảng nghỉ.', route: ['Ngày 1 · Hà Giang – Quản Bạ, làm quen cung đường', 'Ngày 2 · Yên Minh – Đồng Văn, dừng tại điểm ngắm cảnh', 'Ngày 3 · Tham quan phố cổ và làng văn hóa', 'Ngày 4 · Du Già, nghỉ ngơi và trải nghiệm bản', 'Ngày 5 · Trở về Hà Giang'], highlights: ['Chặng di chuyển ngắn và nhiều điểm nghỉ', 'Phòng gia đình theo tình trạng thực tế', 'Có thể điều chỉnh hoạt động theo độ tuổi'], includes: 'Tư vấn tuyến, xe theo đoàn nhỏ, 4 đêm lưu trú và hỗ trợ sắp xếp phòng gia đình.' },
    { value: 'Cloud Pass Weekend', title: 'Cuối tuần săn mây', days: '2 ngày / 1 đêm', area: 'Quản Bạ · Yên Minh', price: 'Từ 129 USD', short: 'Chuyến đi ngắn qua cổng trời, đèo mây và những điểm ngắm cảnh gần.', image: 'bg-06.jpg', intro: 'Gói cuối tuần gọn nhẹ cho người muốn rời phố và ngắm cao nguyên trong thời gian ngắn.', route: ['Ngày 1 · Hà Giang – cổng trời Quản Bạ – Yên Minh', 'Ngày 2 · Ngắm mây buổi sớm – trở về Hà Giang'], highlights: ['Cổng trời Quản Bạ', 'Điểm ngắm mây theo điều kiện thời tiết', 'Phù hợp kỳ nghỉ cuối tuần'], includes: 'Xe tuyến cơ bản, 1 đêm lưu trú, bữa sáng và hướng dẫn viên.' },
    { value: 'Dong Van Heritage', title: 'Di sản Đồng Văn', days: '3 ngày / 2 đêm', area: 'Phố cổ Đồng Văn · làng Lô Lô Chải', price: 'Từ 219 USD', short: 'Tập trung vào kiến trúc phố cổ, văn hóa bản địa và những câu chuyện vùng biên.', image: 'bg-07.jpg', intro: 'Khám phá cao nguyên qua di sản sống, chợ phiên và những ngôi nhà trình tường.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Yên Minh', 'Ngày 2 · Lũng Cú – Lô Lô Chải – phố cổ Đồng Văn', 'Ngày 3 · Chợ phiên (nếu đúng lịch) – Hà Giang'], highlights: ['Phố cổ Đồng Văn', 'Làng văn hóa Lô Lô Chải', 'Tìm hiểu kiến trúc nhà trình tường'], includes: 'Hướng dẫn viên, xe tuyến, 2 đêm lưu trú và hỗ trợ sắp lịch tham quan.' },
    { value: 'Ma Pi Leng Photo', title: 'Săn ảnh Mã Pí Lèng', days: '3 ngày / 2 đêm', area: 'Mã Pí Lèng · sông Nho Quế', price: 'Từ 239 USD', short: 'Dành thêm thời gian cho các điểm ngắm bình minh, hoàng hôn và hẻm vực.', image: 'bg-08.jpg', intro: 'Lịch trình linh hoạt theo ánh sáng và thời tiết, phù hợp người thích nhiếp ảnh phong cảnh.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Đồng Văn', 'Ngày 2 · Bình minh Mã Pí Lèng – sông Nho Quế', 'Ngày 3 · Điểm ngắm cảnh buổi sớm – Hà Giang'], highlights: ['Khung giờ chụp ảnh linh hoạt', 'Các điểm ngắm đèo và hẻm vực', 'Hướng dẫn viên hỗ trợ chọn vị trí an toàn'], includes: 'Xe tuyến, 2 đêm lưu trú, hướng dẫn viên và tư vấn lịch chụp theo thời tiết.' },
    { value: 'Du Gia Waterfall', title: 'Thác và bản Du Già', days: '3 ngày / 2 đêm', area: 'Du Già · đường làng · thác nước', price: 'Từ 199 USD', short: 'Kết hợp cung đường núi với thời gian nghỉ bên thác và homestay trong bản.', image: 'bg-01.jpg', intro: 'Một hành trình xanh và chậm, dành cho người muốn hòa vào nhịp sống thôn bản.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Du Già', 'Ngày 2 · Đi bộ bản làng và thác nước', 'Ngày 3 · Ăn sáng tại homestay – trở về'], highlights: ['Đi bộ ngắn qua bản', 'Thời gian thư giãn tại thác (theo mùa)', 'Bữa cơm địa phương'], includes: '2 đêm homestay, bữa sáng, xe tuyến và hướng dẫn viên địa phương.' },
    { value: 'Lung Cu Frontier', title: 'Cực Bắc Lũng Cú', days: '4 ngày / 3 đêm', area: 'Lũng Cú · Đồng Văn · Mèo Vạc', price: 'Từ 279 USD', short: 'Theo cung đường phía Bắc, ghé cột cờ Lũng Cú và các bản vùng biên.', image: 'bg-02.jpg', intro: 'Chặng đường nổi bật với cảnh quan biên giới, bản làng và các điểm đến mang dấu ấn lịch sử.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Yên Minh', 'Ngày 2 · Lũng Cú – Lô Lô Chải – Đồng Văn', 'Ngày 3 · Mã Pí Lèng – Mèo Vạc', 'Ngày 4 · Trở về Hà Giang'], highlights: ['Cột cờ Lũng Cú', 'Bản Lô Lô Chải', 'Cung đèo Mã Pí Lèng'], includes: 'Xe tuyến, hướng dẫn viên, 3 đêm lưu trú và tư vấn vé tham quan.' },
    { value: 'Market & Homestay', title: 'Chợ phiên và homestay', days: '3 ngày / 2 đêm', area: 'Chợ phiên · làng bản', price: 'Từ 189 USD', short: 'Sắp xếp lịch theo ngày họp chợ, kết hợp lưu trú và bữa cơm tại nhà dân.', image: 'bg-03.jpg', intro: 'Ghé chợ theo lịch địa phương và dành thời gian tìm hiểu văn hóa vùng cao.', route: ['Ngày 1 · Di chuyển đến khu vực chợ theo lịch', 'Ngày 2 · Chợ phiên – thăm bản – dùng bữa tại homestay', 'Ngày 3 · Trở về Hà Giang'], highlights: ['Lịch chợ được xác nhận trước chuyến đi', 'Trải nghiệm homestay địa phương', 'Thời gian tự do mua đặc sản'], includes: 'Xe tuyến, 2 đêm lưu trú, bữa sáng và hỗ trợ xác nhận lịch chợ.' },
    { value: 'Easy Rider Adventure', title: 'Khám phá cùng Easy Rider', days: '4 ngày / 3 đêm', area: 'Cung đường Hà Giang đầy đủ', price: 'Từ 329 USD', short: 'Ngồi sau tay lái của hướng dẫn viên bản địa, tập trung ngắm cảnh và trải nghiệm.', image: 'bg-04.jpg', intro: 'Dành cho du khách muốn cảm nhận cung đường bằng xe máy cùng người lái có kinh nghiệm.', route: ['Ngày 1 · Hà Giang – Quản Bạ – Yên Minh', 'Ngày 2 · Yên Minh – Lũng Cú – Đồng Văn', 'Ngày 3 · Mã Pí Lèng – Mèo Vạc – Du Già', 'Ngày 4 · Du Già – Hà Giang'], highlights: ['Tài xế địa phương dẫn đường', 'Dừng nghỉ theo nhịp đoàn', 'Trang bị bảo hộ cơ bản theo gói'], includes: 'Easy Rider, xe máy theo gói, hướng dẫn viên và 3 đêm lưu trú. Chi tiết bảo hiểm xác nhận trước khi đặt.' },
    { value: 'Premium Mountain Retreat', title: 'Nghỉ dưỡng núi cao cấp', days: '5 ngày / 4 đêm', area: 'Đồng Văn · Mèo Vạc · Du Già', price: 'Từ 520 USD', short: 'Lộ trình riêng tư, chỗ nghỉ chọn lọc và nhiều thời gian tận hưởng từng điểm đến.', image: 'bg-05.jpg', intro: 'Phiên bản nâng cấp với nhịp độ thư thái, tư vấn nơi lưu trú và dịch vụ theo yêu cầu.', route: ['Ngày 1 · Hà Giang – Quản Bạ, nhận phòng nghỉ dưỡng', 'Ngày 2 · Lũng Cú – Đồng Văn', 'Ngày 3 · Mã Pí Lèng và trải nghiệm riêng', 'Ngày 4 · Du Già, nghỉ tại thung lũng', 'Ngày 5 · Trở về Hà Giang'], highlights: ['Tư vấn nơi nghỉ theo nhu cầu', 'Xe riêng hoặc nhóm nhỏ', 'Lịch trình có thể cá nhân hóa'], includes: 'Tư vấn riêng, xe theo gói và đặt chỗ lưu trú chọn lọc. Mọi dịch vụ được xác nhận trước thanh toán.' }
  ];

  const init = () => {
    const section = document.querySelector('.packages');
    const grid = section?.querySelector('.package-grid');
    if (!section || !grid || section.dataset.tourReady) return;
    section.dataset.tourReady = 'true';
    grid.replaceChildren();

    const select = document.querySelector('#package');
    if (select) {
      const placeholder = new Option('Chọn gói tour', '');
      select.replaceChildren(placeholder);
      packages.forEach(item => select.add(new Option(`${item.title} — ${item.price}/người`, item.value)));
    }

    packages.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = `package-card${index === 3 ? ' featured' : ''}${index >= 5 ? ' demo-package' : ''}`;
      card.dataset.packageIndex = String(index);
      card.tabIndex = 0;
      card.setAttribute('role', 'group');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `Xem chi tiết gói ${item.title}`);
      card.innerHTML = `<img class="tour-card-image" src="assets/${item.image}" alt="Cảnh quan Hà Giang cho gói ${item.title}" loading="lazy">${index >= 5 ? '<span class="tour-demo-chip">GÓI DEMO</span>' : ''}<div class="tour-card-body"><span class="tag">${item.days}</span><h3>${item.title}</h3><p>${item.short}</p><strong>${item.price}<small> / người</small></strong><button class="tour-detail-trigger" type="button">Xem chi tiết <span aria-hidden="true">↗</span></button></div>`;
      card.querySelector('button').addEventListener('click', event => { event.stopPropagation(); openDetail(item, card); });
      card.addEventListener('click', () => openDetail(item, card));
      card.addEventListener('keydown', event => {
        if (event.target === card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openDetail(item, card); }
      });
      grid.appendChild(card);
    });

    const originalCards = [...grid.querySelectorAll('.package-card')];
    const loopCloneCount = Math.min(6, originalCards.length);
    const bindClone = card => {
      const item = packages[Number(card.dataset.packageIndex)];
      card.addEventListener('click', () => openDetail(item, card));
      card.addEventListener('keydown', event => {
        if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openDetail(item, card);
        }
      });
      card.querySelector('button').addEventListener('click', event => {
        event.stopPropagation();
        openDetail(item, card);
      });
    };
    originalCards.slice(-loopCloneCount).reverse().forEach(source => {
      const clone = source.cloneNode(true);
      clone.dataset.loopClone = 'true';
      bindClone(clone);
      grid.prepend(clone);
    });
    originalCards.slice(0, loopCloneCount).forEach(source => {
      const clone = source.cloneNode(true);
      clone.dataset.loopClone = 'true';
      bindClone(clone);
      grid.append(clone);
    });

    const carousel = document.createElement('div');
    carousel.className = 'package-carousel';
    grid.parentNode.insertBefore(carousel, grid);
    carousel.appendChild(grid);
    const controls = document.createElement('div');
    controls.className = 'tour-arrows';
    controls.innerHTML = '<button class="tour-arrow" type="button" aria-label="Gói tour trước">←</button><button class="tour-arrow" type="button" aria-label="Gói tour tiếp theo">→</button>';
    carousel.appendChild(controls);

    const modal = document.createElement('div');
    modal.className = 'tour-detail-overlay';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<section class="tour-detail-panel" role="dialog" aria-modal="true" aria-labelledby="tour-detail-title" tabindex="-1"><button class="tour-detail-close" type="button" aria-label="Đóng">×</button><div class="tour-detail-content"></div></section>';
    document.body.appendChild(modal);
    const panel = modal.querySelector('.tour-detail-panel');
    const detailContent = modal.querySelector('.tour-detail-content');
    let activeCard = null;

    function openDetail(item, card) {
      activeCard = card;
      detailContent.innerHTML = `<img class="tour-detail-image" src="assets/${item.image}" alt="Phong cảnh hành trình ${item.title}"><div class="tour-detail-copy"><span class="tag">${item.days}</span><p class="tour-detail-area">${item.area}</p><h2 id="tour-detail-title">${item.title}</h2><p class="tour-detail-intro">${item.intro}</p><div class="tour-detail-columns"><div><h3>Lịch trình mẫu</h3><ol>${item.route.map(stop => `<li>${stop}</li>`).join('')}</ol></div><div><h3>Điểm nổi bật</h3><ul>${item.highlights.map(point => `<li>${point}</li>`).join('')}</ul></div></div><p class="tour-detail-includes"><b>Dịch vụ tham khảo:</b> ${item.includes}</p><div class="tour-detail-footer"><strong>${item.price}<small> / người</small></strong><button class="tour-book-button" type="button">Chọn gói này</button></div><p class="tour-demo-note">Thông tin demo để tham khảo; lịch trình và giá cuối cùng sẽ được xác nhận trước khi đặt.</p></div>`;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tour-modal-open');
      modal.querySelector('.tour-book-button').addEventListener('click', () => {
        if (select) select.value = item.value;
        closeDetail();
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      requestAnimationFrame(() => { panel.focus(); modal.querySelector('.tour-detail-close').focus({ preventScroll: true }); });
    }
    function closeDetail() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tour-modal-open');
      activeCard?.focus({ preventScroll: true });
    }
    modal.addEventListener('click', event => { if (event.target === modal || event.target.closest('.tour-detail-close')) closeDetail(); });
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll('button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeDetail(); });

    const cards = [...grid.querySelectorAll('.package-card')];
    let centerFrame = 0;
    let settleTimer = 0;
    let recentering = false;
    const centeredScrollLeft = card => {
      const gridRect = grid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return grid.scrollLeft + cardRect.left + cardRect.width / 2 - (gridRect.left + grid.clientWidth / 2);
    };
    const nearestCardIndex = () => {
      const center = grid.getBoundingClientRect().left + grid.clientWidth / 2;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const delta = Math.abs(rect.left + rect.width / 2 - center);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      return nearest;
    };
    const setCenterCard = () => {
      cancelAnimationFrame(centerFrame);
      centerFrame = requestAnimationFrame(() => {
        const closest = nearestCardIndex();
        cards.forEach((card, index) => card.classList.toggle('is-current', index === closest));
      });
    };
    const recenterIfOnClone = () => {
      if (recentering || dragging) return;
      const nearest = nearestCardIndex();
      const card = cards[nearest];
      if (!card?.dataset.loopClone) return;
      const originalIndex = loopCloneCount + Number(card.dataset.packageIndex);
      const original = cards[originalIndex];
      if (!original) return;
      recentering = true;
      grid.style.scrollSnapType = 'none';
      grid.style.scrollBehavior = 'auto';
      grid.scrollLeft = centeredScrollLeft(original);
      requestAnimationFrame(() => {
        grid.style.removeProperty('scroll-behavior');
        grid.style.removeProperty('scroll-snap-type');
        recentering = false;
        setCenterCard();
      });
    };
    grid.addEventListener('scroll', () => {
      setCenterCard();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(recenterIfOnClone, 180);
    }, { passive: true });
    grid.addEventListener('scrollend', recenterIfOnClone, { passive: true });
    window.addEventListener('resize', setCenterCard, { passive: true });
    requestAnimationFrame(() => {
      grid.scrollLeft = centeredScrollLeft(cards[loopCloneCount]);
      setCenterCard();
    });

    const move = direction => {
      const current = nearestCardIndex();
      const next = (current + direction + cards.length) % cards.length;
      const target = centeredScrollLeft(cards[next]);
      grid.scrollTo({ left: target, behavior: 'smooth' });
      cards[next].classList.add('is-transitioning');
      setTimeout(() => cards[next].classList.remove('is-transitioning'), 850);
    };
    controls.querySelector('.tour-arrow:first-child').addEventListener('click', () => move(-1));
    controls.querySelector('.tour-arrow:last-child').addEventListener('click', () => move(1));

    let dragging = false;
    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragLastX = 0;
    let dragLastTime = 0;
    let dragVelocity = 0;
    let dragMoved = false;
    let momentumFrame = 0;
    grid.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return;
      dragging = true;
      dragMoved = false;
      dragPointerId = event.pointerId;
      dragStartX = dragLastX = event.clientX;
      dragStartScroll = grid.scrollLeft;
      dragLastTime = performance.now();
      dragVelocity = 0;
      cancelAnimationFrame(momentumFrame);
      grid.style.scrollSnapType = 'none';
      grid.classList.add('is-dragging');
      grid.setPointerCapture(event.pointerId);
    });
    grid.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== dragPointerId) return;
      const now = performance.now();
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 5) dragMoved = true;
      grid.scrollLeft = dragStartScroll - delta;
      const elapsed = Math.max(1, now - dragLastTime);
      dragVelocity = (dragLastX - event.clientX) / elapsed;
      dragLastX = event.clientX;
      dragLastTime = now;
    });
    const endDrag = event => {
      if (!dragging || (event && event.pointerId !== dragPointerId)) return;
      dragging = false;
      if (event && grid.hasPointerCapture(dragPointerId)) grid.releasePointerCapture(dragPointerId);
      dragPointerId = null;
      grid.classList.remove('is-dragging');
      // Keep a deliberate, controlled glide: enough momentum to feel like a swipe,
      // but short enough that the carousel settles cleanly on the next card.
      let velocity = Math.max(-1.45, Math.min(1.45, dragVelocity * 12));
      let previous = performance.now();
      const coast = now => {
        const elapsed = Math.min(32, now - previous);
        previous = now;
        grid.scrollLeft += velocity * elapsed;
        velocity *= Math.pow(.89, elapsed / 16);
        if (Math.abs(velocity) > .055) momentumFrame = requestAnimationFrame(coast);
        else {
          grid.style.removeProperty('scroll-snap-type');
          const nearest = nearestCardIndex();
          grid.scrollTo({ left: centeredScrollLeft(cards[nearest]), behavior: 'smooth' });
          setTimeout(recenterIfOnClone, 650);
        }
      };
      momentumFrame = requestAnimationFrame(coast);
    };
    grid.addEventListener('pointerup', endDrag);
    grid.addEventListener('pointercancel', endDrag);
    grid.addEventListener('click', event => {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }, true);

    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { section.classList.add('is-revealed'); reveal.disconnect(); }
    }), { threshold: .18 });
    reveal.observe(section);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
