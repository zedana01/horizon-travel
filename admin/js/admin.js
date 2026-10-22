/**
 * Horizon Tours & Travel Executive Admin Engine
 * PIN protected (default: 1234)
 */

let appData = null;
let currentEditingTourId = null;

// 1. DATA INITIALIZATION
async function initData() {
  const local = localStorage.getItem('horizon_tours_data');
  if (local) {
    try {
      appData = JSON.parse(local);
    } catch(e) {
      console.error('Error parsing local storage:', e);
    }
  }

  if (!appData) {
    try {
      const res = await fetch('../data/tours.json?v=' + Date.now());
      appData = await res.json();
    } catch(e) {
      console.error('Error fetching tours.json:', e);
      appData = {
        agency: {
          name: "وكالة هورايزون تورز للسياحة والسفر",
          nameEn: "HORIZON LUXURY TOURS",
          phone: "01027093535",
          hotline: "9200 88 777",
          email: "concierge@horizon-tours.com",
          address: "برج المملكة، طريق الملك فهد، الرياض، المملكة العربية السعودية",
          adminPin: "1234"
        },
        tours: [],
        destinations: []
      };
    }
  }

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
    'tabDestinations': 'الوجهات والمدن السياحية',
    'tabInquiries': 'طلبات الحجز والاستفسارات الواردة',
    'tabCMS': 'إعدادات الوكالة والتواصل المباشر'
  };
  document.getElementById('headerTitle').textContent = titles[tabId] || 'لوحة التحكم الشاملة';

  // Close sidebar on mobile
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

  // Render Sub-tables
  renderOverviewInquiries(inquiries);
  renderToursTable(tours);
  renderDestinationsTable(dests);
  renderInquiriesTable(inquiries);
  populateCMSForm();
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
        <a href="https://wa.me/201027093535?text=مرحباً%20${encodeURIComponent(inq.name)}،%20بخصوص%20حجزك%20في%20هورايزون%20تورز" target="_blank" class="btn btn-outline btn-sm" style="color:#25d366;">
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
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:24px; color:#94a3b8;">لا توجد باقات سياحية مسجلة</td></tr>';
    return;
  }

  tbody.innerHTML = tours.map(t => `
    <tr>
      <td><img src="../${t.image}" alt="${t.name}" class="tour-thumb" onerror="this.src='../images/maldives.jpg'"></td>
      <td style="font-weight:800; max-width:200px;">${t.name}</td>
      <td><span class="badge badge-primary">${t.destName}</span></td>
      <td><i class="fa-regular fa-clock" style="color:var(--text-muted); margin-left:4px;"></i> ${t.duration}</td>
      <td style="font-weight:900; color:var(--primary); font-size:15px;">
        ${t.price.toLocaleString('en-US')}
        ${t.oldPrice ? `<span style="font-size:12px; color:#94a3b8; text-decoration:line-through; margin-right:4px;">${t.oldPrice.toLocaleString('en-US')}</span>` : ''}
      </td>
      <td><span class="badge badge-warning">${t.badge || 'مميز'}</span></td>
      <td>
        <input type="checkbox" ${t.featured ? 'checked' : ''} onchange="toggleTourFeatured(${t.id}, this.checked)">
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editTour(${t.id})" title="تعديل"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteTour(${t.id})" title="حذف"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAdminTours() {
  const q = document.getElementById('tourSearchInput').value.toLowerCase().trim();
  const tours = appData.tours || [];
  const filtered = tours.filter(t => t.name.toLowerCase().includes(q) || t.destName.toLowerCase().includes(q));
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
  document.getElementById('tourModal').style.display = 'flex';
}

function editTour(id) {
  const tour = appData.tours.find(t => t.id === id);
  if (!tour) return;
  currentEditingTourId = id;
  document.getElementById('tourModalTitle').textContent = 'تعديل الباقة: ' + tour.name;
  document.getElementById('modalTourId').value = tour.id;
  document.getElementById('modalTourName').value = tour.name;
  document.getElementById('modalTourDest').value = tour.dest;
  document.getElementById('modalTourDuration').value = tour.duration;
  document.getElementById('modalTourPrice').value = tour.price;
  document.getElementById('modalTourOldPrice').value = tour.oldPrice || '';
  document.getElementById('modalTourBadge').value = tour.badge || '';
  document.getElementById('modalTourImage').value = tour.image;
  document.getElementById('modalTourDesc').value = tour.desc;
  document.getElementById('tourModal').style.display = 'flex';
}

function closeTourModal() {
  document.getElementById('tourModal').style.display = 'none';
}

function handleSaveTour(e) {
  e.preventDefault();
  const idVal = document.getElementById('modalTourId').value;
  const destVal = document.getElementById('modalTourDest').value;
  const destNames = {
    'maldives': 'جزر المالديف',
    'switzerland': 'سويسرا والألب',
    'turkey': 'تركيا وكابادوكيا',
    'egypt': 'مصر والأهرامات',
    'alula': 'العلا التاريخية'
  };

  const tourData = {
    name: document.getElementById('modalTourName').value.trim(),
    dest: destVal,
    destName: destNames[destVal] || destVal,
    duration: document.getElementById('modalTourDuration').value.trim(),
    price: parseInt(document.getElementById('modalTourPrice').value) || 0,
    oldPrice: parseInt(document.getElementById('modalTourOldPrice').value) || null,
    badge: document.getElementById('modalTourBadge').value.trim() || 'عرض خاص',
    image: document.getElementById('modalTourImage').value.trim(),
    desc: document.getElementById('modalTourDesc').value.trim(),
    rating: 5,
    reviewsCount: 38,
    featured: true
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
    const newId = appData.tours.length ? Math.max(...appData.tours.map(t => t.id)) + 1 : 1;
    appData.tours.unshift({ id: newId, ...tourData });
    showToast('تم إضافة الباقة السياحية الجديدة بنجاح');
  }

  saveAppData();
  closeTourModal();
  renderToursTable(appData.tours);
  document.getElementById('statToursCount').textContent = appData.tours.length;
}

function deleteTour(id) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الباقة السياحية؟')) return;
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
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px; color:#94a3b8;">لا توجد وجهات مسجلة</td></tr>';
    return;
  }

  tbody.innerHTML = dests.map(d => `
    <tr>
      <td><img src="../${d.image}" alt="${d.name}" class="tour-thumb" onerror="this.src='../images/maldives.jpg'"></td>
      <td style="font-weight:800;">${d.name}</td>
      <td><code>${d.slug}</code></td>
      <td><span class="badge badge-primary">${d.badge}</span></td>
      <td style="max-width:300px; font-size:13px; color:#475569;">${d.desc}</td>
      <td>
        <a href="../destination.html?dest=${d.slug}" target="_blank" class="btn btn-outline btn-sm" title="عرض في المتجر">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </td>
    </tr>
  `).join('');
}

function openAddDestModal() {
  alert('ميزة إضافة وجهة جديدة متاحة: يمكنك تعديلها وحفظها مباشرة وسيتم ربطها تلقائياً بالباقات!');
}

// 8. INQUIRIES MANAGER
function renderInquiriesTable(inquiries) {
  const tbody = document.getElementById('inquiriesTableBody');
  if (!tbody) return;
  if (!inquiries.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:24px; color:#94a3b8;">لا توجد طلبات حجز مسجلة</td></tr>';
    return;
  }

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
        <a href="https://wa.me/201027093535?text=مرحباً%20${encodeURIComponent(inq.name)}،%20يسعدنا%20خدمتكم%20في%20وكالة%20هورايزون%20تورز%20بخصوص%20طلبكم" target="_blank" class="btn btn-outline btn-sm" style="color:#25d366;">
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

// 9. CMS SETTINGS
function populateCMSForm() {
  if (!appData || !appData.agency) return;
  const a = appData.agency;
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
  showToast('تم حفظ إعدادات الوكالة والتواصل بنجاح!');
  document.getElementById('statWhatsApp').textContent = appData.agency.phone;
}

// 10. PERSISTENCE & EXPORT
function saveAppData() {
  localStorage.setItem('horizon_tours_data', JSON.stringify(appData));
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "tours.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast('تم تنزيل ملف tours.json المحدث بنجاح');
}

// Launch
document.addEventListener('DOMContentLoaded', () => {
  initData();
});
