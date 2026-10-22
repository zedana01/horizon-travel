/**
 * Horizon Travel Live Client-Side Synchronization Engine
 * Automatically reflects all Admin changes:
 * - Tours & Destinations CRUD
 * - Home Page Hero Title, Description, Image, Badges, Announcement
 * - About Us Page Title, Subtitle, Story, Paragraphs, Image
 * - Contact Us Page Title, Subtitle, WhatsApp, Phone, Email, Address
 * - WhatsApp booking numbers across all buttons
 */

(function() {
    function getAppData() {
        try {
            const raw = localStorage.getItem('horizon_tours_data');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && (Array.isArray(parsed.tours) || parsed.pages || parsed.agency)) {
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
        const pages = data.pages || {};
        const agencyWa = agency.phone ? agency.phone.replace(/[^0-9]/g, '') : '201027093535';

        // 1. Update Global WhatsApp links across any page
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            const currentHref = a.getAttribute('href');
            if (currentHref && agencyWa) {
                a.setAttribute('href', currentHref.replace(/wa\.me\/[0-9]+/, `wa.me/${agencyWa}`));
            }
        });

        // 2. HOME PAGE SYNC (index.html)
        if (pages.home) {
            const h = pages.home;
            const heroTitle = document.getElementById('heroTitle');
            if (heroTitle && h.heroTitle) heroTitle.textContent = h.heroTitle;

            const heroDesc = document.getElementById('heroDesc');
            if (heroDesc && h.heroDesc) heroDesc.textContent = h.heroDesc;

            const heroImg = document.getElementById('heroImg');
            if (heroImg && h.heroImg) heroImg.src = h.heroImg;

            const b1t = document.getElementById('heroBadge1Title');
            if (b1t && h.badge1Title) b1t.textContent = h.badge1Title;

            const b1s = document.getElementById('heroBadge1Sub');
            if (b1s && h.badge1Sub) b1s.textContent = h.badge1Sub;

            const b2t = document.getElementById('heroBadge2Title');
            if (b2t && h.badge2Title) b2t.textContent = h.badge2Title;

            const b2s = document.getElementById('heroBadge2Sub');
            if (b2s && h.badge2Sub) b2s.textContent = h.badge2Sub;

            const topAnnounce = document.querySelector('.tour-topbar-notice span, .topbar-announcement');
            if (topAnnounce && h.announcement) topAnnounce.textContent = h.announcement;
        }

        // 3. ABOUT US PAGE SYNC (about.html)
        if (pages.about) {
            const ab = pages.about;
            const abTitle = document.getElementById('aboutHeroTitle');
            if (abTitle && ab.heroTitle) abTitle.textContent = ab.heroTitle;

            const abSub = document.getElementById('aboutHeroSub');
            if (abSub && ab.heroSubtitle) abSub.textContent = ab.heroSubtitle;

            const abStoryTitle = document.getElementById('aboutStoryTitle');
            if (abStoryTitle && ab.storyTitle) abStoryTitle.textContent = ab.storyTitle;

            const abP1 = document.getElementById('aboutStoryP1');
            if (abP1 && ab.storyP1) abP1.textContent = ab.storyP1;

            const abP2 = document.getElementById('aboutStoryP2');
            if (abP2 && ab.storyP2) abP2.textContent = ab.storyP2;

            const abImg = document.getElementById('aboutMainImg');
            if (abImg && ab.image) abImg.src = ab.image;
        }

        // 4. CONTACT US PAGE SYNC (contact.html)
        if (pages.contact) {
            const ct = pages.contact;
            const ctTitle = document.getElementById('contactHeroTitle');
            if (ctTitle && ct.heroTitle) ctTitle.textContent = ct.heroTitle;

            const ctSub = document.getElementById('contactHeroSub');
            if (ctSub && ct.heroSubtitle) ctSub.textContent = ct.heroSubtitle;

            const ctWaLink = document.getElementById('contactWaLink');
            if (ctWaLink && ct.whatsapp) {
                const clean = ct.whatsapp.replace(/[^0-9]/g, '');
                ctWaLink.href = `https://wa.me/${clean}`;
                ctWaLink.textContent = ct.whatsapp;
            }

            const ctPhoneLink = document.getElementById('contactPhoneLink');
            if (ctPhoneLink && ct.phone) {
                ctPhoneLink.href = `tel:${ct.phone}`;
                ctPhoneLink.textContent = ct.phone;
            }

            const ctEmailLink = document.getElementById('contactEmailLink');
            if (ctEmailLink && ct.email) {
                ctEmailLink.href = `mailto:${ct.email}`;
                ctEmailLink.textContent = ct.email;
            }

            const ctAddr = document.getElementById('contactAddressText');
            if (ctAddr && ct.address) ctAddr.textContent = ct.address;
        }

        // 5. TOURS GRID SYNC (#toursGrid)
        const toursGrid = document.getElementById('toursGrid');
        if (toursGrid && tours.length > 0) {
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/horizon-travel/');
            const visibleTours = isHomePage ? tours.filter(t => t.featured !== false) : tours;
            
            toursGrid.innerHTML = (visibleTours.length > 0 ? visibleTours : tours).map(t => renderCard(t, agencyWa)).join('');

            // If a filter was previously active, reapply
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

        // 6. DESTINATION PAGE TOURS GRID (#destToursGrid)
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

        // 7. TOUR DETAIL PAGE (tour-detail.html / product.html)
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
