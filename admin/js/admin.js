/**
 * Horizon Tours & Travel Executive Admin Engine
 * PIN protected (default: 1234)
 * Full CRUD for Tours, Destinations, Images (Base64 file upload + URL), CMS, and Storefront Sync
 */

const DEFAULT_DATA = {
  agency: {
    name: "وكالة هورايزون تورز للسياحة والسفر",
    nameEn: "HORIZON LUXURY ESCAPES",
    phone: "01027093535",
    hotline: "9200 88 777",
    email: "booking@horizon-travel.com",
    address: "برج المملكة، طريق الملك فهد، الرياض، المملكة العربية السعودية",
    workingHours: "السبت إلى الخميس: 9:00 ص - 10:00 م (خدمة الطوارئ 24/7)",
    adminPin: "1234",
    license: "ترخيص وزارة السياحة رقم 73491/ت | عضو منظمة IATA المعتمد",
    topbarAnnouncement: "عروض حصرية تصل إلى 35% على باقات المالديف وسويسرا عند الحجز المبكر هذا الأسبوع!",
    heroTitle: "اكتشف روعة العالم مع برامج هورايزون السياحية الفاخرة",
    heroDesc: "أفخم الرحلات المنظمة وحجوزات الفنادق والمنتجعات حول العالم مع أفضل تجربة عملاء وخدمات كونسيرج متكاملة 24/7."
  },
  destinations: [
    {
      id: "maldives",
      slug: "maldives",
      name: "جزر المالديف الفاخرة",
      badge: "MALDIVES LUXURY ESCAPES",
      image: "images/maldives.jpg",
      desc: "فيلات عائمة فوق المياه الفيروزية مع خصوصية ملكية تامة وشواطئ رملية بيضاء نقية.",
      count: "3 باقات"
    },
    {
      id: "swiss",
      slug: "swiss",
      name: "سويسرا وقمم جبال الألب",
      badge: "SWISS ALPS & LAKES",
      image: "images/swiss_alps.jpg",
      desc: "بحيرات نقية، قطارات بانورامية فاخرة، ومرتفعات خضراء وشلالات أسطورية في إنترلاكن ولوسيرن.",
      count: "4 باقات"
    },
    {
      id: "cappadocia",
      slug: "cappadocia",
      name: "تركيا ومناطيد كابادوكيا",
      badge: "TURKEY & CAPPADOCIA",
      image: "images/cappadocia.jpg",
      desc: "التحليق بالمناطيد الهوائية وقت الشروق، والإقامة في أجنحة الكهوف الفاخرة وسحر البوسفور.",
      count: "3 باقات"
    },
    {
      id: "egypt",
      slug: "egypt",
      name: "مصر وقصور النيل الملكي",
      badge: "EGYPT & NILE CRUISE",
      image: "images/egypt_pyramids.jpg",
      desc: "كروز نيلي 5 نجوم دي لوكس بين الأقصر وأسوان، أهرامات الجيزة، ومنتجعات شرم الشيخ الفاخرة.",
      count: "3 باقات"
    },
    {
      id: "alula",
      slug: "alula",
      name: "العلا وسحر صحراء المملكة",
      badge: "ALULA HERITAGE & DESERT",
      image: "images/alula.jpg",
      desc: "استكشف مدائن صالح، جبل الفيل، وقاعات مرايا في قلب الطبيعة الصحراوية الساحرة.",
      count: "2 باقة"
    }
  ],
  tours: [
    {
      id: 1,
      name: "باقة المالديف الملكية - فيلات عائمة فوق الماء مع مسبح خاص",
      dest: "maldives",
      destName: "جزر المالديف",
      price: 4850,
      oldPrice: 6200,
      badge: "خصم 22%",
      duration: "6 أيام / 5 ليالٍ",
      image: "images/maldives.jpg",
      inclusions: "طيران دولي مباشر، فيلا عائمة مع مسبح خاص، إفطار يومي، تنقلات قارب سريع",
      desc: "عش تجربة الفخامة المطلقة في فيلا عائمة فوق المحيط الهندي مع مسبح خاص لا متناهي وخدمة خادم شخصي على مدار 24 ساعة.",
      rating: 5,
      reviewsCount: 48,
      featured: true
    },
    {
      id: 2,
      name: "روائع سويسرا وجبال الألب - إنترلاكن، جنيف وزيورخ الساحرة",
      dest: "swiss",
      destName: "سويسرا والألب",
      price: 6900,
      oldPrice: 8500,
      badge: "الأكثر طلباً",
      duration: "8 أيام / 7 ليالٍ",
      image: "images/swiss_alps.jpg",
      inclusions: "طيران دولي، قطار جبلي بانورامي، فنادق 5 نجوم، جولات سياحية كاملة",
      desc: "جولة ساحرة بين جبال الألب والبحيرات الكريستالية مع ركوب القطار البانورامي الذهبي والإقامة في أفخم فنادق إنترلاكن وزيورخ.",
      rating: 5,
      reviewsCount: 62,
      featured: true
    },
    {
      id: 3,
      name: "سحر إسطنبول ومناطيد كابادوكيا - مغامرة خيالية في كهوف الأناضول",
      dest: "cappadocia",
      destName: "تركيا وكابادوكيا",
      price: 3400,
      oldPrice: 4200,
      badge: "عرض التوفير",
      duration: "7 أيام / 6 ليالٍ",
      image: "images/cappadocia.jpg",
      inclusions: "طيران دولي وداخلي، رحلة منطاد هوائي، أجنحة كهوف فاخرة، جولة البوسفور الخاصة",
      desc: "تجربة فريدة تجمع بين عراقة إسطنبول وسحر كابادوكيا برحلة المنطاد الهوائي وقت شروق الشمس والإقامة في أرقى فنادق الكهوف.",
      rating: 5,
      reviewsCount: 39,
      featured: true
    },
    {
      id: 4,
      name: "أسطورة الفراعنة - رحلة نيلية كروز 5 نجوم بين الأقصر وأسوان",
      dest: "egypt",
      destName: "مصر وسحر النيل",
      price: 2950,
      oldPrice: 3800,
      badge: "شامل الكروز",
      duration: "5 أيام / 4 ليالٍ",
      image: "images/egypt_pyramids.jpg",
      inclusions: "كروز نيلي دي لوكس 5 نجوم، طيران داخلي، مرشد سياحي مصري متخصص، زيارة المعابد",
      desc: "إبحار ملكي في نهر النيل الخالد على متن كروز فاخر وزيارة وادي الملوك ومعبد الكرنك ومعبد فيلة مع إقامة كاملة.",
      rating: 5,
      reviewsCount: 54,
      featured: true
    },
    {
      id: 5,
      name: "منتجع شانغريلا المالديف - باقة الاستجمام العائلي الشامل كلياً",
      dest: "maldives",
      destName: "جزر المالديف",
      price: 5400,
      oldPrice: 6800,
      badge: "شامل كلياً",
      duration: "7 أيام / 6 ليالٍ",
      image: "images/maldives.jpg",
      inclusions: "طيران مباشر، وجبات كاملة ومشروبات، أنشطة بحرية مجانية، نادي للأطفال",
      desc: "الملاذ العائلي الأرقى في جزر المالديف مع أنشطة الغطس والغوص في الشعب المرجانية وخدمة متكاملة على مدار الساعة.",
      rating: 5,
      reviewsCount: 31,
      featured: true
    },
    {
      id: 6,
      name: "قطار الألب البانورامي الذهبي - رحلة الطبيعة والبحيرات النقية",
      dest: "swiss",
      destName: "سويسرا والألب",
      price: 7800,
      oldPrice: 9400,
      badge: "VIP فاخر",
      duration: "9 أيام / 8 ليالٍ",
      image: "images/swiss_alps.jpg",
      inclusions: "طيران درجة رجال الأعمال، قطار بانورامي درجة أولى، منتجعات صحية فاخرة",
      desc: "رحلة من الدرجة الأولى عبر أجمل ممرات الألب الجليدية وزيارة قمة يونغفراويوخ أعلى محطة قطار في أوروبا.",
      rating: 5,
      reviewsCount: 44,
      featured: true
    },
    {
      id: 7,
      name: "عطلة أنطاليا وبودروم الشاطئية - منتجعات الريفييرا التركية الفارهة",
      dest: "cappadocia",
      destName: "تركيا وكابادوكيا",
      price: 3950,
      oldPrice: 4900,
      badge: "شاطئي فاخر",
      duration: "6 أيام / 5 ليالٍ",
      image: "images/cappadocia.jpg",
      inclusions: "طيران دولي، منتجع شاطئي فخم، يخت خاص في بحر إيجه، جميع الوجبات",
      desc: "استمتع بمياه البحر المتوسط الفيروزية واليخوت الفارهة والإقامة في أرقى منتجعات الريفييرا التركية.",
      rating: 5,
      reviewsCount: 28,
      featured: true
    },
    {
      id: 8,
      name: "واحة العلا وتراث الحجر - تجربة التخييم الفلكي الفاخر",
      dest: "alula",
      destName: "العلا وسحر الصحراء",
      price: 4200,
      oldPrice: 5100,
      badge: "إرث سعودي",
      duration: "4 أيام / 3 ليالٍ",
      image: "images/alula.jpg",
      inclusions: "طيران مباشر للعلا، منتجع خيام فاخر، جولة مدائن صالح الخاصة، عشاء تحت النجوم",
      desc: "انغمس في عبق التاريخ وعظمة الآثار النبطية في العلا مع إقامة فندقية فاخرة في وادي عشار وتجربة مراقبة النجوم.",
      rating: 5,
      reviewsCount: 47,
      featured: true
    }
  ]
};

let appData = null;
let currentEditingTourId = null;
let currentEditingDestSlug = null;

// 1. INITIALIZATION
function initData() {
  const local = localStorage.getItem('horizon_tours_data');
  if (local) {
    try {
      appData = JSON.parse(local);
    } catch(e) {
      console.error('Error parsing local horizon_tours_data:', e);
    }
  }

  if (!appData || !Array.isArray(appData.tours) || appData.tours.length === 0) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveAppData();
  }

  // Ensure default agency info has all fields
  if (!appData.agency) appData.agency = { ...DEFAULT_DATA.agency };
  if (!appData.destinations) appData.destinations = [ ...DEFAULT_DATA.destinations ];

  checkAuth();
}

// 2. AUTHENTICATION
function checkAuth() {
  const authed = sessionStorage.getItem('horizon_admin_authed');
  const authScreen = document.getElementById('authScreen');
  if (authed === 'true') {
    authScreen.style.display = 'none';
    renderDashboard();
  } else {
    authScreen.style.display = 'flex';
    setTimeout(() => {
      const pinInp = document.getElementById('pinInput');
      if (pinInp) pinInp.focus();
    }, 150);
  }
}

function handleAuth(e) {
  e.preventDefault();
  const pin = document.getElementById('pinInput').value.trim();
  const validPin = (appData && appData.agency && appData.agency.adminPin) ? appData.agency.adminPin : '1234';

  if (pin === validPin) {
    sessionStorage.setItem('horizon_admin_authed', 'true');
    document.getElementById('authScreen').style.display = 'none';
    renderDashboard();
    showToast('تم تسجيل الدخول بنجاح، مرحباً بك في لوحة الإدارة!');
  } else {
    const err = document.getElementById('authError');
    err.style.display = 'block';
    document.getElementById('pinInput').value = '';
    setTimeout(() => { err.style.display = 'none'; }, 4000);
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('horizon_admin_authed');
  window.location.reload();
}

function toggleSidebar() {
  const sb = document.getElementById('adminSidebar');
  if (sb) sb.classList.toggle('open');
}

// 3. TAB CONTROLLER
function switchTab(tabId, btn) {
  document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';

  if (btn) {
    document.querySelectorAll('.sidebar-menu .menu-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
  }

  const titles = {
    'tabOverview': 'نظرة عامة وإحصائيات الوكالة',
    'tabTours': 'إدارة وتحديث الباقات السياحية',
    'tabDestinations': 'إدارة الأقسام والوجهات السياحية',
    'tabCMS': 'إعدادات الموقع ونصوص الصفحات',
    'tabInquiries': 'سجل طلبات الحجز والاستفسارات',
    'tabBackup': 'النسخ الاحتياطي واستعادة البيانات'
  };
  document.getElementById('headerTitle').textContent = titles[tabId] || 'لوحة التحكم الشاملة';

  const sb = document.getElementById('adminSidebar');
  if (sb && window.innerWidth <= 900) sb.classList.remove('open');
}

// 4. TOAST NOTIFIER
function showToast(msg) {
  const t = document.getElementById('adminToast');
  document.getElementById('toastMsg').textContent = msg;
  t.style.display = 'flex';
  setTimeout(() => { t.style.display = 'none'; }, 3500);
}

// 5. RENDER DASHBOARD
function renderDashboard() {
  if (!appData) return;

  const tours = appData.tours || [];
  const inquiries = getStoredInquiries();
  const dests = appData.destinations || [];

  // Update Stats
  document.getElementById('statToursCount').textContent = tours.length;
  document.getElementById('statInquiriesCount').textContent = inquiries.length;
  document.getElementById('statDestsCount').textContent = dests.length;
  if (appData.agency && appData.agency.phone) {
    document.getElementById('statWhatsApp').textContent = appData.agency.phone;
  }

  // Populate Destination Select dropdown in Tour Modal
  populateDestSelect();

  // Render Sub-tables
  renderOverviewInquiries(inquiries);
  renderToursTable(tours);
  renderDestinationsTable(dests);
  renderInquiriesTable(inquiries);
  populateCMSForm();
}

function populateDestSelect() {
  const sel = document.getElementById('modalTourDest');
  if (!sel || !appData || !appData.destinations) return;
  sel.innerHTML = appData.destinations.map(d => `<option value="${d.slug}">${d.name}</option>`).join('');
}

// Inquiries helper
function getStoredInquiries() {
  try {
    const raw = localStorage.getItem('horizon_bookings');
    return raw ? JSON.parse(raw) : [
      { id: 1, name: 'عبدالله السعدون', phone: '0501234567', email: 'abdullah@example.com', tourName: 'باقة المالديف الملكية', guests: 2, date: '2026-11-15', notes: 'شهر عسل، يرغب بفيلا عائمة مع مسبح خاص', created: '2026-10-22' },
      { id: 2, name: 'سارة المنصور', phone: '0559876543', email: 'sara.m@example.com', tourName: 'روائع سويسرا وجبال الألب', guests: 4, date: '2026-12-01', notes: 'عائلة مع طفلين، تفضيل قطار بانورامي', created: '2026-10-21' }
    ];
  } catch(e) {
    return [];
  }
}

function renderOverviewInquiries(inquiries) {
  const tbody = document.getElementById('overviewRecentInquiries');
  if (!tbody) return;
  if (!inquiries.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8; padding:24px;">لا توجد طلبات حجز مسجلة حتى الآن</td></tr>';
    return;
  }

  const wa = (appData.agency && appData.agency.phone) ? appData.agency.phone.replace(/[^0-9]/g, '') : '201027093535';

  tbody.innerHTML = inquiries.slice(0, 5).map((inq, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="font-weight:800;">${inq.name}</td>
      <td><a href="tel:${inq.phone}" style="color:var(--primary); text-decoration:none;">${inq.phone}</a></td>
      <td><span class="badge badge-primary">${inq.tourName || 'استفسار عام'}</span></td>
      <td>${inq.guests || 2} أفراد</td>
      <td>${inq.date || 'مرن'}</td>
      <td><span class="badge badge-success">جديد</span></td>
      <td>
        <a href="https://wa.me/${wa}?text=مرحباً%20${encodeURIComponent(inq.name)}،%20بخصوص%20حجزك%20في%20هورايزون%20تورز" target="_blank" class="btn btn-outline btn-sm" style="color:#25d366;">
          <i class="fa-brands fa-whatsapp"></i> تواصل
        </a>
      </td>
    </tr>
  `).join('');
}

// 6. TOURS MANAGER
function renderToursTable(tours) {
  const tbody = document.getElementById('toursTableBody');
  if (!tbody) return;
  if (!tours.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:28px; color:#94a3b8;">لا توجد باقات سياحية مسجلة. اضغط "إضافة باقة جديدة" بالأعلى!</td></tr>';
    return;
  }

  tbody.innerHTML = tours.map(t => {
    const imgSrc = t.image.startsWith('data:') ? t.image : (t.image.startsWith('http') ? t.image : `../${t.image}`);
    return `
    <tr>
      <td><img src="${imgSrc}" alt="${t.name}" class="tour-thumb" onerror="this.src='../images/maldives.jpg'"></td>
      <td style="font-weight:800; max-width:240px; line-height:1.4;">${t.name}</td>
      <td><span class="badge badge-primary">${t.destName || t.dest}</span></td>
      <td><i class="fa-regular fa-clock" style="color:var(--text-muted); margin-left:4px;"></i> ${t.duration}</td>
      <td style="font-weight:900; color:var(--primary); font-size:15px; white-space:nowrap;">
        ${Number(t.price).toLocaleString('en-US')} ر.س
        ${t.oldPrice ? `<div style="font-size:11.5px; color:#94a3b8; text-decoration:line-through;">${Number(t.oldPrice).toLocaleString('en-US')} ر.س</div>` : ''}
      </td>
      <td><span class="badge badge-warning">${t.badge || 'مميز'}</span></td>
      <td>
        <input type="checkbox" style="cursor:pointer; transform:scale(1.2);" ${t.featured !== false ? 'checked' : ''} onchange="toggleTourFeatured(${t.id}, this.checked)" title="تفعيل في الصفحة الرئيسية">
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editTour(${t.id})" title="تعديل"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteTour(${t.id})" title="حذف"><i class="fa-solid fa-trash"></i></button>
          <a href="../tour-detail.html?id=${t.id}" target="_blank" class="btn btn-outline btn-sm" title="معاينة في المتجر"><i class="fa-solid fa-eye"></i></a>
        </div>
      </td>
    </tr>
  `}).join('');
}

function filterAdminTours() {
  const q = document.getElementById('tourSearchInput').value.toLowerCase().trim();
  const tours = appData.tours || [];
  const filtered = tours.filter(t => (t.name && t.name.toLowerCase().includes(q)) || (t.destName && t.destName.toLowerCase().includes(q)));
  renderToursTable(filtered);
}

function toggleTourFeatured(tourId, isFeatured) {
  const tour = appData.tours.find(t => t.id === tourId);
  if (tour) {
    tour.featured = isFeatured;
    saveAppData();
    showToast('تم تحديث حالة الظهور في الصفحة الرئيسية');
  }
}

function openAddTourModal() {
  currentEditingTourId = null;
  document.getElementById('tourModalTitle').textContent = 'إضافة باقة سياحية جديدة';
  document.getElementById('tourForm').reset();
  document.getElementById('modalTourId').value = '';
  document.getElementById('modalTourImgPreview').style.display = 'none';
  populateDestSelect();
  document.getElementById('tourModal').style.display = 'flex';
}

function editTour(id) {
  const tour = appData.tours.find(t => t.id === id);
  if (!tour) return;
  currentEditingTourId = id;
  populateDestSelect();

  document.getElementById('tourModalTitle').textContent = 'تعديل الباقة: ' + tour.name;
  document.getElementById('modalTourId').value = tour.id;
  document.getElementById('modalTourName').value = tour.name;
  document.getElementById('modalTourDest').value = tour.dest;
  document.getElementById('modalTourDuration').value = tour.duration;
  document.getElementById('modalTourPrice').value = tour.price;
  document.getElementById('modalTourOldPrice').value = tour.oldPrice || '';
  document.getElementById('modalTourBadge').value = tour.badge || '';
  document.getElementById('modalTourFeatured').value = tour.featured !== false ? 'true' : 'false';
  document.getElementById('modalTourImage').value = tour.image;
  document.getElementById('modalTourInclusions').value = tour.inclusions || '';
  document.getElementById('modalTourDesc').value = tour.desc;

  updateTourImgPreview(tour.image);
  document.getElementById('tourModal').style.display = 'flex';
}

function closeTourModal() {
  document.getElementById('tourModal').style.display = 'none';
}

function updateTourImgPreview(src) {
  const prev = document.getElementById('modalTourImgPreview');
  if (src && src.trim()) {
    const fixedSrc = src.startsWith('data:') ? src : (src.startsWith('http') ? src : `../${src}`);
    prev.src = fixedSrc;
    prev.style.display = 'block';
  } else {
    prev.style.display = 'none';
  }
}

function setTourPresetImg(path) {
  document.getElementById('modalTourImage').value = path;
  updateTourImgPreview(path);
}

function handleTourImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById('modalTourImage').value = base64;
    updateTourImgPreview(base64);
    showToast('تم تحميل الصورة من جهازك بنجاح!');
  };
  reader.readAsDataURL(file);
}

function handleSaveTour(e) {
  e.preventDefault();
  const idVal = document.getElementById('modalTourId').value;
  const destVal = document.getElementById('modalTourDest').value;
  
  // Find destination name
  const destObj = (appData.destinations || []).find(d => d.slug === destVal);
  const destName = destObj ? destObj.name : destVal;

  const tourData = {
    name: document.getElementById('modalTourName').value.trim(),
    dest: destVal,
    destName: destName,
    duration: document.getElementById('modalTourDuration').value.trim(),
    price: parseInt(document.getElementById('modalTourPrice').value) || 0,
    oldPrice: parseInt(document.getElementById('modalTourOldPrice').value) || null,
    badge: document.getElementById('modalTourBadge').value.trim() || 'عرض خاص',
    featured: document.getElementById('modalTourFeatured').value === 'true',
    image: document.getElementById('modalTourImage').value.trim() || 'images/maldives.jpg',
    inclusions: document.getElementById('modalTourInclusions').value.trim(),
    desc: document.getElementById('modalTourDesc').value.trim(),
    rating: 5,
    reviewsCount: 45
  };

  if (idVal) {
    // Edit existing
    const idx = appData.tours.findIndex(t => t.id === parseInt(idVal));
    if (idx !== -1) {
      appData.tours[idx] = { ...appData.tours[idx], ...tourData };
      showToast('تم تحديث الباقة السياحية بنجاح');
    }
  } else {
    // Add new
    const newId = appData.tours.length ? Math.max(...appData.tours.map(t => t.id || 0)) + 1 : 1;
    appData.tours.unshift({ id: newId, ...tourData });
    showToast('تمت إضافة الباقة السياحية الجديدة بنجاح!');
  }

  saveAppData();
  closeTourModal();
  renderToursTable(appData.tours);
  document.getElementById('statToursCount').textContent = appData.tours.length;
}

function deleteTour(id) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الباقة السياحية نهائياً؟')) return;
  appData.tours = appData.tours.filter(t => t.id !== id);
  saveAppData();
  renderToursTable(appData.tours);
  document.getElementById('statToursCount').textContent = appData.tours.length;
  showToast('تم حذف الباقة بنجاح');
}

// 7. DESTINATIONS MANAGER
function renderDestinationsTable(dests) {
  const tbody = document.getElementById('destinationsTableBody');
  if (!tbody) return;
  if (!dests.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:28px; color:#94a3b8;">لا توجد وجهات مسجلة. اضغط "إضافة قسم/وجهة جديدة" بالأعلى!</td></tr>';
    return;
  }

  tbody.innerHTML = dests.map(d => {
    const imgSrc = d.image.startsWith('data:') ? d.image : (d.image.startsWith('http') ? d.image : `../${d.image}`);
    return `
    <tr>
      <td><img src="${imgSrc}" alt="${d.name}" class="tour-thumb" onerror="this.src='../images/maldives.jpg'"></td>
      <td style="font-weight:800; font-size:14.5px;">${d.name}</td>
      <td><code style="background:#f1f5f9; padding:3px 8px; border-radius:6px; color:#0284c7; font-weight:700;">${d.slug}</code></td>
      <td><span class="badge badge-primary">${d.badge}</span></td>
      <td style="max-width:280px; font-size:12.5px; color:#475569; line-height:1.4;">${d.desc}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editDest('${d.slug}')" title="تعديل"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteDest('${d.slug}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
          <a href="../destination.html?dest=${d.slug}" target="_blank" class="btn btn-outline btn-sm" title="عرض في المتجر"><i class="fa-solid fa-eye"></i></a>
        </div>
      </td>
    </tr>
  `}).join('');
}

function openAddDestModal() {
  currentEditingDestSlug = null;
  document.getElementById('destModalTitle').textContent = 'إضافة قسم / وجهة جديدة';
  document.getElementById('destForm').reset();
  document.getElementById('modalDestOriginalSlug').value = '';
  document.getElementById('modalDestImgPreview').style.display = 'none';
  document.getElementById('destModal').style.display = 'flex';
}

function editDest(slug) {
  const dest = appData.destinations.find(d => d.slug === slug);
  if (!dest) return;
  currentEditingDestSlug = slug;

  document.getElementById('destModalTitle').textContent = 'تعديل وجهة: ' + dest.name;
  document.getElementById('modalDestOriginalSlug').value = dest.slug;
  document.getElementById('modalDestName').value = dest.name;
  document.getElementById('modalDestSlug').value = dest.slug;
  document.getElementById('modalDestBadge').value = dest.badge;
  document.getElementById('modalDestCount').value = dest.count || '3 باقات';
  document.getElementById('modalDestImage').value = dest.image;
  document.getElementById('modalDestDesc').value = dest.desc;

  updateDestImgPreview(dest.image);
  document.getElementById('destModal').style.display = 'flex';
}

function closeDestModal() {
  document.getElementById('destModal').style.display = 'none';
}

function updateDestImgPreview(src) {
  const prev = document.getElementById('modalDestImgPreview');
  if (src && src.trim()) {
    const fixedSrc = src.startsWith('data:') ? src : (src.startsWith('http') ? src : `../${src}`);
    prev.src = fixedSrc;
    prev.style.display = 'block';
  } else {
    prev.style.display = 'none';
  }
}

function handleDestImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById('modalDestImage').value = base64;
    updateDestImgPreview(base64);
    showToast('تم تحميل صورة الوجهة من جهازك!');
  };
  reader.readAsDataURL(file);
}

function handleSaveDest(e) {
  e.preventDefault();
  const origSlug = document.getElementById('modalDestOriginalSlug').value;
  const newSlug = document.getElementById('modalDestSlug').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

  const destData = {
    id: newSlug,
    slug: newSlug,
    name: document.getElementById('modalDestName').value.trim(),
    badge: document.getElementById('modalDestBadge').value.trim(),
    count: document.getElementById('modalDestCount').value.trim() || '3 باقات',
    image: document.getElementById('modalDestImage').value.trim() || 'images/maldives.jpg',
    desc: document.getElementById('modalDestDesc').value.trim()
  };

  if (origSlug) {
    // Edit existing
    const idx = appData.destinations.findIndex(d => d.slug === origSlug);
    if (idx !== -1) {
      appData.destinations[idx] = { ...appData.destinations[idx], ...destData };
      showToast('تم تحديث بيانات الوجهة بنجاح');
    }
  } else {
    // Add new
    if (appData.destinations.some(d => d.slug === newSlug)) {
      alert('المعرف (Slug) مستخدم بالفعل، يرجى كتابة معرف آخر مميز');
      return;
    }
    appData.destinations.push(destData);
    showToast('تمت إضافة الوجهة / القسم الجديد بنجاح!');
  }

  saveAppData();
  closeDestModal();
  renderDestinationsTable(appData.destinations);
  populateDestSelect();
  document.getElementById('statDestsCount').textContent = appData.destinations.length;
}

function deleteDest(slug) {
  if (!confirm(`هل أنت متأكد من حذف وجهة (${slug}) نهائياً؟`)) return;
  appData.destinations = appData.destinations.filter(d => d.slug !== slug);
  saveAppData();
  renderDestinationsTable(appData.destinations);
  populateDestSelect();
  document.getElementById('statDestsCount').textContent = appData.destinations.length;
  showToast('تم حذف الوجهة بنجاح');
}

// 8. INQUIRIES MANAGER
function renderInquiriesTable(inquiries) {
  const tbody = document.getElementById('inquiriesTableBody');
  if (!tbody) return;
  if (!inquiries.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:28px; color:#94a3b8;">لا توجد طلبات حجز مسجلة</td></tr>';
    return;
  }

  const wa = (appData.agency && appData.agency.phone) ? appData.agency.phone.replace(/[^0-9]/g, '') : '201027093535';

  tbody.innerHTML = inquiries.map((inq, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="font-weight:800;">${inq.name}</td>
      <td><a href="tel:${inq.phone}" style="color:var(--primary); font-weight:700; text-decoration:none;">${inq.phone}</a></td>
      <td>${inq.email || '-'}</td>
      <td><span class="badge badge-primary">${inq.tourName || 'استفسار عام'}</span></td>
      <td>${inq.date || 'مرن'}</td>
      <td>${inq.guests || 2} مسافرين</td>
      <td style="max-width:250px; font-size:12.5px; color:#475569;">${inq.notes || '-'}</td>
      <td>
        <a href="https://wa.me/${wa}?text=مرحباً%20${encodeURIComponent(inq.name)}،%20يسعدنا%20خدمتكم%20في%20وكالة%20هورايزون%20تورز%20بخصوص%20طلبكم" target="_blank" class="btn btn-outline btn-sm" style="color:#25d366;">
          <i class="fa-brands fa-whatsapp"></i> رد
        </a>
      </td>
    </tr>
  `).join('');
}

function clearAllInquiries() {
  if (!confirm('هل أنت متأكد من مسح جميع طلبات الحجز من السجل؟')) return;
  localStorage.setItem('horizon_bookings', JSON.stringify([]));
  renderInquiriesTable([]);
  renderOverviewInquiries([]);
  document.getElementById('statInquiriesCount').textContent = 0;
  showToast('تم إفراغ سجل الحجوزات بنجاح');
}

// 9. CMS & SETTINGS
function populateCMSForm() {
  if (!appData || !appData.agency) return;
  const a = appData.agency;
  if (document.getElementById('cmsTopbarAnnouncement')) document.getElementById('cmsTopbarAnnouncement').value = a.topbarAnnouncement || '';
  if (document.getElementById('cmsHeroTitle')) document.getElementById('cmsHeroTitle').value = a.heroTitle || '';
  if (document.getElementById('cmsHeroDesc')) document.getElementById('cmsHeroDesc').value = a.heroDesc || '';
  if (document.getElementById('cmsAgencyName')) document.getElementById('cmsAgencyName').value = a.name || '';
  if (document.getElementById('cmsAgencyEn')) document.getElementById('cmsAgencyEn').value = a.nameEn || '';
  if (document.getElementById('cmsWhatsApp')) document.getElementById('cmsWhatsApp').value = a.phone || '01027093535';
  if (document.getElementById('cmsHotline')) document.getElementById('cmsHotline').value = a.hotline || '9200 88 777';
  if (document.getElementById('cmsEmail')) document.getElementById('cmsEmail').value = a.email || '';
  if (document.getElementById('cmsAddress')) document.getElementById('cmsAddress').value = a.address || '';
  if (document.getElementById('cmsWorkingHours')) document.getElementById('cmsWorkingHours').value = a.workingHours || '';
  if (document.getElementById('cmsAdminPin')) document.getElementById('cmsAdminPin').value = a.adminPin || '1234';
  if (document.getElementById('cmsLicense')) document.getElementById('cmsLicense').value = a.license || '';
}

function saveCMSData() {
  if (!appData) return;
  if (!appData.agency) appData.agency = {};

  appData.agency.topbarAnnouncement = document.getElementById('cmsTopbarAnnouncement').value.trim();
  appData.agency.heroTitle = document.getElementById('cmsHeroTitle').value.trim();
  appData.agency.heroDesc = document.getElementById('cmsHeroDesc').value.trim();
  appData.agency.name = document.getElementById('cmsAgencyName').value.trim();
  appData.agency.nameEn = document.getElementById('cmsAgencyEn').value.trim();
  appData.agency.phone = document.getElementById('cmsWhatsApp').value.trim();
  appData.agency.hotline = document.getElementById('cmsHotline').value.trim();
  appData.agency.email = document.getElementById('cmsEmail').value.trim();
  appData.agency.address = document.getElementById('cmsAddress').value.trim();
  appData.agency.workingHours = document.getElementById('cmsWorkingHours').value.trim();
  appData.agency.adminPin = document.getElementById('cmsAdminPin').value.trim() || '1234';
  appData.agency.license = document.getElementById('cmsLicense').value.trim();

  saveAppData();
  showToast('تم حفظ كافة إعدادات الموقع والوكالة بنجاح!');
  document.getElementById('statWhatsApp').textContent = appData.agency.phone;
}

// 10. PERSISTENCE, BACKUP & EXPORT
function saveAppData() {
  try {
    localStorage.setItem('horizon_tours_data', JSON.stringify(appData));
  } catch(e) {
    console.error('Failed to save to localStorage:', e);
    showToast('تنبيه: حجم الصور المرفوعة كبير جداً، يرجى استخدام صور أصغر حجماً');
  }
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", "tours_backup.json");
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
  showToast('تم تنزيل النسخة الاحتياطية tours_backup.json بنجاح!');
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && (parsed.tours || parsed.destinations)) {
        appData = parsed;
        saveAppData();
        renderDashboard();
        showToast('تم استيراد البيانات وتطبيقها بنجاح!');
      } else {
        alert('الملف المحدد لا يحتوي على بنية بيانات هورايزون تورز الصحيحة.');
      }
    } catch(err) {
      alert('حدث خطأ أثناء قراءة ملف JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetDefaultData() {
  if (!confirm('تحذير: هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات إلى الإعدادات النموذجية الأصلية؟')) return;
  appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveAppData();
  renderDashboard();
  showToast('تمت استعادة البيانات النموذجية بنجاح!');
}

// Launch
document.addEventListener('DOMContentLoaded', () => {
  initData();
});
