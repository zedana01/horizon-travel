/**
 * Horizon Luxury Tours & Travel Engine
 * Version 1.0.0
 */

let horizonData = null;
let horizonInquiries = [];

// 1. DATA INITIALIZATION
function loadHorizonData() {
    try {
        const local = localStorage.getItem('horizon_tours_data');
        if (local) horizonData = JSON.parse(local);
    } catch(e) {
        console.error('Error loading horizon_tours_data:', e);
    }

    try {
        const inq = localStorage.getItem('horizon_inquiries');
        if (inq) horizonInquiries = JSON.parse(inq);
    } catch(e) {}
}

function saveHorizonInquiry(inquiry) {
    try {
        horizonInquiries.unshift(inquiry);
        localStorage.setItem('horizon_inquiries', JSON.stringify(horizonInquiries));
    } catch(e) {}
}

// 2. MOBILE MENU & DRAWER
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    if (!drawer) return;
    
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
        drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function triggerMobileSearch() {
    const input = document.getElementById('mobSearchInput');
    const q = input ? input.value.trim() : '';
    if (q) {
        closeMobileMenu();
        window.location.href = 'tours.html?q=' + encodeURIComponent(q);
    }
}

// 3. TOURS FILTERING
function filterTours(category, btn) {
    if (btn) {
        document.querySelectorAll('.tour-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const cards = document.querySelectorAll('.tour-card');
    cards.forEach(card => {
        const dest = card.getAttribute('data-dest');
        if (category === 'all' || dest === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function scrollToTours() {
    const el = document.getElementById('tours');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'tours.html';
    }
}

function handleCustomSearch() {
    const dest = document.getElementById('formDest');
    const val = dest ? dest.value : 'all';
    if (document.getElementById('tours')) {
        filterTours(val);
        scrollToTours();
    } else {
        window.location.href = 'tours.html?dest=' + encodeURIComponent(val);
    }
}

// 4. BOOKING MODAL & WHATSAPP CHECKOUT
let currentBookingTour = {
    id: null,
    name: 'باقة سياحية فاخرة',
    price: 0
};

function openBookingModal(id, name, price) {
    currentBookingTour = {
        id: id,
        name: name,
        price: price
    };
    const modal = document.getElementById('bookingModal');
    const title = document.getElementById('modalTourTitle');
    const priceEl = document.getElementById('modalTourPrice');

    if (title) title.textContent = name;
    if (priceEl) priceEl.textContent = price + ' ر.س';

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function submitWhatsAppBooking(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('bookName');
    const phoneInput = document.getElementById('bookPhone');
    const dateInput = document.getElementById('bookDate');
    const guestsInput = document.getElementById('bookGuests');
    const notesInput = document.getElementById('bookNotes');

    const travelerName = nameInput ? nameInput.value.trim() : 'ضيف كريم';
    const travelerPhone = phoneInput ? phoneInput.value.trim() : '';
    const travelDate = dateInput ? dateInput.value : 'في أقرب موعد متاح';
    const guestsCount = guestsInput ? guestsInput.value : '2 مسافرين';
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!travelerPhone) {
        showToast('يرجى إدخال رقم الهاتف / الجوال للتواصل');
        return;
    }

    // Save inquiry to admin records
    const inquiry = {
        id: Date.now(),
        tourName: currentBookingTour.name,
        price: currentBookingTour.price,
        travelerName: travelerName,
        phone: travelerPhone,
        date: travelDate,
        guests: guestsCount,
        notes: notes,
        createdAt: new Date().toLocaleString('ar-SA')
    };
    saveHorizonInquiry(inquiry);

    // Format WhatsApp message
    let phone = '201027093535';
    if (horizonData && horizonData.agencyInfo && horizonData.agencyInfo.whatsappFormatted) {
        phone = horizonData.agencyInfo.whatsappFormatted;
    }

    let msg = `*طلب حجز باقة سياحية فاخرة | هورايزون تورز* ✈️🌍%0a%0a`;
    msg += `🏖️ *الباقة:* ${currentBookingTour.name}%0a`;
    if (currentBookingTour.price) msg += `💰 *السعر التقديري:* ${currentBookingTour.price} ر.س%0a`;
    msg += `-----------------------------------%0a`;
    msg += `👤 *اسم المسافر:* ${travelerName}%0a`;
    msg += `📱 *رقم التواصل:* ${travelerPhone}%0a`;
    msg += `📅 *تاريخ السفر المفضل:* ${travelDate}%0a`;
    msg += `👥 *عدد المسافرين:* ${guestsCount}%0a`;
    if (notes) msg += `📝 *ملاحظات خاصة:* ${notes}%0a`;
    msg += `-----------------------------------%0a`;
    msg += `أرجو تأكيد إمكانية الحجز وموافاتي بالتفاصيل وتأكيد التذاكر. شكراً لكم!`;

    const waUrl = `https://wa.me/${phone}?text=${msg}`;
    window.open(waUrl, '_blank');
    closeBookingModal();
    showToast('جاري فتح واتساب لتأكيد حجز رحلتكم مع مستشار السفر...');
}

// Direct Instant WhatsApp Booking
function bookTourDirect(name, price) {
    openBookingModal(Date.now(), name, price);
}

// 5. TOAST NOTIFICATION
function showToast(msg) {
    let toast = document.getElementById('tourToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tourToast';
        toast.className = 'tour-toast';
        toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#0284c7; font-size:18px;"></i> <span id="toastMsg"></span>';
        document.body.appendChild(toast);
    }
    const msgEl = document.getElementById('toastMsg') || toast.querySelector('span');
    if (msgEl) msgEl.textContent = msg;

    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3500);
}

// 6. FAQ ACCORDION
function toggleFaq(el) {
    const item = el.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.tour-faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) {
        item.classList.add('active');
    }
}

// 7. NEWSLETTER
function subscribeNewsletter() {
    const input = document.getElementById('newsletterEmail');
    if (input && input.value.trim()) {
        showToast('شكراً لاشتراككم! تم إرسال كود الخصم HORIZON2026 إلى بريدكم.');
        input.value = '';
    } else {
        showToast('يرجى إدخال البريد الإلكتروني بشكل صحيح');
    }
}

// 8. LIVE CMS
function applyHorizonLiveCMS() {
    if (!horizonData || !horizonData.agencyInfo) return;
    try {
        const info = horizonData.agencyInfo;
        const topAnnounce = document.querySelector('.tour-top-bar span:nth-child(2)');
        if (topAnnounce && info.topbarAnnouncement) topAnnounce.textContent = info.topbarAnnouncement;
    } catch(e) {}
}

// BOOTSTRAP
document.addEventListener('DOMContentLoaded', () => {
    loadHorizonData();
    applyHorizonLiveCMS();

    // Flash countdown timer
    const sEl = document.getElementById('cd-secs');
    const mEl = document.getElementById('cd-mins');
    if (sEl && mEl) {
        setInterval(() => {
            let s = parseInt(sEl.innerText);
            let m = parseInt(mEl.innerText);
            s--;
            if (s < 0) {
                s = 59;
                m--;
                if (m < 0) m = 59;
            }
            sEl.innerText = s < 10 ? '0' + s : s;
            mEl.innerText = m < 10 ? '0' + m : m;
        }, 1000);
    }

    // Search input instant filtering if present
    const searchInput = document.getElementById('searchDestinationInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.tour-card');
            cards.forEach(card => {
                const title = card.querySelector('.tour-card-title').innerText.toLowerCase();
                const cat = card.querySelector('.tour-card-cat').innerText.toLowerCase();
                if (title.includes(query) || cat.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
