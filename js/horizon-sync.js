/**
 * Horizon Travel Live Client-Side Synchronization Engine
 * Automatically reflects all Admin changes (Tours, Destinations, Prices, Images, WhatsApp, CMS)
 * across index.html, tours.html, destination.html, and tour-detail.html in real time.
 */

(function() {
    function getAppData() {
        try {
            const raw = localStorage.getItem('horizon_tours_data');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.tours) && parsed.tours.length > 0) {
                    return parsed;
                }
            }
        } catch(e) {
            console.error('Error reading horizon_tours_data:', e);
        }
        return null;
    }

    function renderCard(t, agencyWa) {
        const destSlug = (t.dest || t.destination || 'maldives').toLowerCase();
        let cleanDest = destSlug;
        if (destSlug === 'switzerland' || destSlug === 'swiss') cleanDest = 'swiss';
        if (destSlug === 'turkey' || destSlug === 'cappadocia') cleanDest = 'cappadocia';
        if (destSlug === 'sharm') cleanDest = 'egypt';

        const oldPriceHtml = t.oldPrice ? `<div class="tour-price-old">${Number(t.oldPrice).toLocaleString('en-US')} ر.س</div>` : '';
        const badgeText = t.badge || 'عرض خاص';
        const waNumber = agencyWa || '201027093535';
        const waMsg = encodeURIComponent(`مرحباً، أود حجز ${t.name} بسعر ${Number(t.price).toLocaleString('en-US')} ر.س`);
        const imgSrc = t.image.startsWith('data:') ? t.image : (t.image.startsWith('http') ? t.image : t.image);

        return `
        <div class="tour-card" data-dest="${cleanDest}">
            <div class="tour-card-badge">${badgeText}</div>
            <a href="tour-detail.html?id=${t.id}" class="tour-card-img-box" style="display:block;">
                <img src="${imgSrc}" alt="${t.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/maldives.jpg'">
            </a>
            <div class="tour-card-body">
                <div>
                    <div class="tour-card-cat">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${t.destName || 'وجهة عالمية'} • ${t.duration || '6 أيام'}</span>
                    </div>
                    <h3 class="tour-card-title"><a href="tour-detail.html?id=${t.id}" style="color:inherit; text-decoration:none;">${t.name}</a></h3>
                    <div class="tour-card-specs">
                        <span><i class="fa-solid fa-plane"></i> طيران دولي</span>
                        <span><i class="fa-solid fa-hotel"></i> 5 نجوم فاخر</span>
                        <span><i class="fa-solid fa-utensils"></i> إفطار يومي</span>
                    </div>
                    <div class="tour-card-rating">
                        <div class="tour-card-stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="tour-card-reviews">5.0 (${t.reviewsCount || 48} تقييم)</span>
                    </div>
                </div>
                <div class="tour-card-footer">
                    <div class="tour-card-price">
                        <span class="tour-price-from">ابتداءً من</span>
                        <div class="tour-price-val">${Number(t.price).toLocaleString('en-US')} <span>ر.س</span></div>
                        ${oldPriceHtml}
                    </div>
                    <div style="display:flex; gap:8px;">
                        <a href="https://wa.me/${waNumber}?text=${waMsg}" target="_blank" rel="noopener" class="tour-card-btn" style="background:#25d366; color:#fff;" title="حجز عبر واتساب">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                        <a href="tour-detail.html?id=${t.id}" class="tour-card-btn" title="تفاصيل الرحلة">
                            <i class="fa-solid fa-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function syncStorefront() {
        const data = getAppData();
        if (!data) return;

        const tours = data.tours || [];
        const agency = data.agency || {};
        const agencyWa = agency.phone ? agency.phone.replace(/[^0-9]/g, '') : '201027093535';

        // 1. Update WhatsApp links across the page
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            const currentHref = a.getAttribute('href');
            a.setAttribute('href', currentHref.replace(/wa\.me\/[0-9]+/, `wa.me/${agencyWa}`));
        });

        // 2. Update Topbar Announcement if element exists
        const topbarAnnounceEl = document.querySelector('.tour-topbar-notice span, .topbar-announcement');
        if (topbarAnnounceEl && agency.topbarAnnouncement) {
            topbarAnnounceEl.textContent = agency.topbarAnnouncement;
        }

        // 3. Update Hero Title & Description if customized
        const heroTitleEl = document.querySelector('.tour-hero-title');
        if (heroTitleEl && agency.heroTitle) {
            heroTitleEl.textContent = agency.heroTitle;
        }
        const heroDescEl = document.querySelector('.tour-hero-desc');
        if (heroDescEl && agency.heroDesc) {
            heroDescEl.textContent = agency.heroDesc;
        }

        // 4. Update Tours Grid on Homepage (index.html) or Tours Page (tours.html)
        const toursGrid = document.getElementById('toursGrid');
        if (toursGrid && tours.length > 0) {
            // Check if we are on index.html (filter by featured) or tours.html (all)
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/horizon-travel/');
            const visibleTours = isHomePage ? tours.filter(t => t.featured !== false) : tours;
            
            toursGrid.innerHTML = (visibleTours.length > 0 ? visibleTours : tours).map(t => renderCard(t, agencyWa)).join('');

            // If a destination filter was previously selected, re-apply it
            if (typeof window.filterTours === 'function') {
                const activeFilterBtn = document.querySelector('.tour-filter-btn.active');
                if (activeFilterBtn) {
                    const fnStr = activeFilterBtn.getAttribute('onclick') || '';
                    const match = fnStr.match(/filterTours\('([^']+)'/);
                    if (match && match[1]) {
                        window.filterTours(match[1], activeFilterBtn);
                    }
                }
            }
        }

        // 5. Update Destination Page Grid (#destToursGrid)
        const destToursGrid = document.getElementById('destToursGrid');
        if (destToursGrid && tours.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const currentDest = (urlParams.get('dest') || 'all').toLowerCase();
            const cleanDest = (currentDest === 'switzerland' || currentDest === 'swiss') ? 'swiss' :
                              (currentDest === 'turkey' || currentDest === 'cappadocia') ? 'cappadocia' :
                              (currentDest === 'sharm') ? 'egypt' : currentDest;

            const filtered = (cleanDest === 'all' || !cleanDest) ? tours : tours.filter(t => {
                const tDest = (t.dest || t.destination || '').toLowerCase();
                const cleanTDest = (tDest === 'switzerland' || tDest === 'swiss') ? 'swiss' :
                                  (tDest === 'turkey' || tDest === 'cappadocia') ? 'cappadocia' :
                                  (tDest === 'sharm') ? 'egypt' : tDest;
                return cleanTDest === cleanDest;
            });

            destToursGrid.innerHTML = filtered.map(t => renderCard(t, agencyWa)).join('');
        }

        // 6. Update Tour Detail Page (tour-detail.html / product.html)
        const detailTitle = document.getElementById('detailTitle');
        if (detailTitle) {
            const urlParams = new URLSearchParams(window.location.search);
            const tourId = parseInt(urlParams.get('id')) || 1;
            const tour = tours.find(t => t.id === tourId) || tours[0];

            if (tour) {
                document.title = `${tour.name} | وكالة هورايزون تورز`;
                detailTitle.textContent = tour.name;

                const detailHeroImg = document.getElementById('detailHeroImg');
                if (detailHeroImg) {
                    const imgSrc = tour.image.startsWith('data:') ? tour.image : (tour.image.startsWith('http') ? tour.image : tour.image);
                    detailHeroImg.src = imgSrc;
                }

                const detailBadge = document.getElementById('detailBadge');
                if (detailBadge) detailBadge.textContent = tour.badge || 'عرض خاص';

                const detailCat = document.getElementById('detailCat');
                if (detailCat) detailCat.textContent = `${tour.destName || 'وجهة عالمية'} • ${tour.duration || '6 أيام'}`;

                const detailDesc = document.getElementById('detailDesc');
                if (detailDesc) detailDesc.textContent = tour.desc;

                const detailDuration = document.getElementById('detailDuration');
                if (detailDuration) detailDuration.textContent = tour.duration;

                const detailPrice = document.getElementById('detailPrice');
                if (detailPrice) detailPrice.textContent = `${Number(tour.price).toLocaleString('en-US')} ر.س`;

                const detailWaBtn = document.getElementById('detailWaBtn');
                if (detailWaBtn) {
                    const msg = encodeURIComponent(`مرحباً وكالة هورايزون تورز، أود حجز ${tour.name} بسعر ${Number(tour.price).toLocaleString('en-US')} ر.س`);
                    detailWaBtn.href = `https://wa.me/${agencyWa}?text=${msg}`;
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncStorefront);
    } else {
        syncStorefront();
    }
})();
