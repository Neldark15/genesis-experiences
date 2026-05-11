/* ── i18n — Multi-language support (ES/EN) ── */
let currentLang='es';

const translations = {
    es: {
        // Navigation
        "nav.home":"Inicio","nav.property":"Propiedad","nav.book":"Reservar",
        "nav.location":"Ubicaci\u00f3n","nav.reviews":"Rese\u00f1as","nav.availability":"Disponibilidad",
        "nav.contact":"Contactar",

        // Hero
        "hero.title":"Tu Escape <em>Perfecto</em>",
        "hero.subtitle":"Ranchos exclusivos en El Salvador \u2014 Playa y Lago",

        // Property cards
        "prop.beach":"Frente al Mar","prop.lake":"Orillas del Lago",
        "prop.beach.short":"Playa","prop.lake.short":"Lago",
        "prop.rancho.name":"Rancho Genesis",
        "prop.rancho.tagline":"Frente al mar \u2022 16 personas \u2022 Piscina privada",
        "prop.lago.name":"Casa del Lago",
        "prop.lago.tagline":"Tu escape \u00edntimo \u2022 Lago de Coatepeque \u2022 10 personas",
        "prop.price.from":"/ noche desde",

        // Booking buttons
        "book.now":"Reservar Ahora","book.check":"Ver Disponibilidad","book.property":"Reservar esta Propiedad",

        // Photos
        "photos.title":"Fotos del lugar",

        // Calendar
        "cal.title":"Disponibilidad",
        "cal.today":"Hoy","cal.booked":"Reservado","cal.checkout":"Salida 1PM","cal.available":"Disponible",
        "cal.months":"Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre",
        "cal.days":"Dom,Lun,Mar,Mi\u00e9,Jue,Vie,S\u00e1b",
        "cal.tip.transition":"Salida 1PM / Entrada 3PM<br>Reserva continua",
        "cal.tip.checkin":"Entrada 3PM<br>Acepta salida hasta 1PM",
        "cal.tip.late":"Salida extendida 6PM<br>No disponible",
        "cal.tip.checkout":"Salida 1PM<br>Disponible desde 3PM",
        "cal.tip.daypass.no":"Salida 1PM<br>No disponible para ",
        "cal.tip.nextblocked":"Salida 1PM<br>D\u00eda siguiente no disponible",
        "cal.select.checkin":"Seleccione fecha de check-in",
        "cal.select.checkout":"Ahora seleccione check-out",

        // Booking form
        "form.property.label":"Propiedad","form.type":"Tipo",
        "form.fullnight":"Noche completa","form.couple":"Promo Pareja",
        "form.checkin":"Check-in","form.checkout":"Check-out",
        "form.guests":"Hu\u00e9spedes","form.pets":"Mascotas ($20 c/u)",
        "form.no.pets":"Sin mascotas",
        "form.select":"Seleccione...","form.select.property":"Seleccione propiedad...",
        "form.people":"personas",
        "form.fullname":"Nombre completo","form.phone":"Tel\u00e9fono",
        "form.dui":"DUI","form.email":"Email (opcional)",
        "form.notes":"Notas especiales","form.notes.label":"Notas",
        "form.schedule":"Horarios",
        "form.schedule.change":"Cambio de horario (+$50 c/u)",
        "form.ci.standard":"Check-in est\u00e1ndar (3PM)","form.ci.early":"Check-in temprano (8AM)",
        "form.co.standard":"Check-out est\u00e1ndar (1PM)","form.co.late":"Check-out extendido (6PM)",
        "form.extras":"Extras disponibles",
        "form.extra.guests":"Personas extra ($15 c/u)",
        "form.extra.room":"5ta habitaci\u00f3n (+$50)",
        "booking.details":"Detalles de Reserva","booking.personal":"Datos Personales",
        "booking.whatsapp":"Confirmar por WhatsApp",

        // Price
        "price.total":"Total","price.deposit":"Anticipo 40%","price.remaining":"Restante al llegar",
        "price.rate":"Tarifa","price.nights":"noche","price.nights.plural":"noches",
        "price.pets":"mascotas","price.pet":"mascota",
        "price.schedule":"Cambio de horario","price.extras":"Extras",
        "price.noche.ta":"Noche (temporada alta)","price.noche.we":"Noche (fin de semana)","price.noche.wd":"Noche (entre semana)",
        "price.dp.ta":"Day pass (temporada alta)","price.dp.we":"Day pass (fin de semana)","price.dp.wd":"Day pass (entre semana)",
        "price.couple":"Promo pareja",

        // Payment
        "payment.title":"Datos para transferencia",
        "payment.bank":"Banco de Am\u00e9rica Central (BAC)",
        "payment.type":"Cuenta de ahorro en d\u00f3lares",
        "payment.account":"No. Cuenta","payment.name":"A nombre de",
        "payment.note":"Realice el anticipo y env\u00ede la captura por WhatsApp para confirmar.",

        // Reviews
        "reviews.title":"Rese\u00f1as de Hu\u00e9spedes",
        "reviews.guests.say":"Lo que dicen nuestros hu\u00e9spedes",
        "review.share":"Comparte tu experiencia",
        "review.yourname":"Tu nombre","review.when":"\u00bfCu\u00e1ndo te quedaste?",
        "review.experience":"Cu\u00e9ntanos c\u00f3mo fue tu experiencia...",
        "review.post":"Publicar Rese\u00f1a",
        "review.fullname":"Nombre completo","review.prop":"Propiedad visitada",
        "review.date":"Fecha de tu estad\u00eda","review.rating":"Calificaci\u00f3n",
        "review.text":"Tu rese\u00f1a","review.google":"Dejar Rese\u00f1a en Google",
        "review.photo":"Adjunta tu fotograf\u00eda de tus momentos favoritos",
        "review.photo.remove":"Quitar foto",

        // Story
        "story.save":"Guardar imagen","story.close":"Cerrar",

        // Toast
        "toast.ok":"Entendido",
        "toast.unavailable":"Fecha no disponible",

        // Booking success
        "success.title":"\u00a1Reserva Recibida!",
        "success.msg":"Su solicitud ha sido registrada exitosamente.",
        "success.id":"ID de reserva",
        "success.send":"Env\u00ede su comprobante de pago por WhatsApp para confirmar la reserva.",
        "success.ok":"Entendido",

        // Footer
        "footer.design":"Dise\u00f1o por",

        // Availability errors
        "avail.booked":"Esta fecha ya tiene una reserva activa. Por favor seleccione otra fecha.",
        "avail.late":"Esta fecha tiene salida extendida a las 6PM. No es posible reservar este d\u00eda.",
        "avail.daypass.no":"Hay hu\u00e9spedes con salida a la 1PM este d\u00eda. No se puede reservar Day Pass ni Promo Pareja.",
        "avail.early.blocked":"Hay hu\u00e9spedes con salida a la 1:00 PM. Solo puede entrar a las 3:00 PM.",
        "avail.co.booked":"La fecha de checkout ya est\u00e1 reservada. No puede terminar su estancia ese d\u00eda.",
        "avail.co.late":"Hay hu\u00e9spedes entrando a las 3PM el d\u00eda de su salida. Su checkout debe ser a la 1:00 PM.",
        "avail.mid.booked":"Su rango incluye fechas ocupadas.",
        "avail.mid.partial":"Su rango incluye fechas con hu\u00e9spedes.",
        "avail.conflict":"No se puede completar la reserva. Hay un conflicto de disponibilidad con las fechas seleccionadas.",

        // Schedule
        "sched.both":"Entrada 8AM y salida 6PM (+${cost}). Sujeto a disponibilidad.",
        "sched.early":"Entrada anticipada 8AM (+$50). Sujeto a disponibilidad.",
        "sched.late":"Salida extendida hasta 6PM (+$50). Sujeto a disponibilidad.",

        // Property data
        "prop.playa.desc":"La fiesta perfecta frente al mar. Rancho exclusivo con piscina privada, amplias zonas al aire libre, parrilla y capacidad para 16 personas. Ideal para familias y grupos grandes que buscan diversi\u00f3n y adrenalina junto al oc\u00e9ano.",
        "prop.lago.desc":"Tu escape \u00edntimo en el lago. Acogedora casa a orillas del Lago de Coatepeque con acceso privado al agua, muelle y una vista espectacular. Perfecta para parejas, retiros y grupos peque\u00f1os que buscan paz y conexi\u00f3n con la naturaleza.",
        "prop.playa.hero":"La fiesta perfecta frente al mar \u2022 Hasta 16 hu\u00e9spedes",
        "prop.lago.hero":"Tu escape \u00edntimo en el lago \u2022 Hasta 10 hu\u00e9spedes",

        // Amenities
        "am.pool":"Piscina privada","am.bbq":"Parrilla / BBQ","am.wifi":"WiFi incluido",
        "am.parking":"Estacionamiento","am.beds.4":"4 habitaciones","am.beds.3":"3 habitaciones",
        "am.pets":"Pet-friendly","am.beach":"Acceso directo a playa","am.kitchen":"Cocina equipada",
        "am.lake":"Acceso al lago","am.view":"Vista panor\u00e1mica",

        // Map
        "map.location":"Ubicaci\u00f3n",

        // Policy
        "policy.title":"Pol\u00edtica de Reservas y Cancelaciones",
        "policy.item1":"Toda reserva se confirma \u00fanicamente con el pago anticipado del <strong>40% del monto total</strong>.",
        "policy.item2":"Una vez realizado el pago, la fecha queda bloqueada de forma exclusiva para el cliente, por lo que <strong>no se realizan devoluciones ni reembolsos</strong> bajo ninguna circunstancia.",
        "policy.item3":"En caso de que el cliente <strong>no se presente</strong> en la fecha y hora establecida, la reserva se considerar\u00e1 como utilizada y no habr\u00e1 reintegro.",
        "policy.item4":"El cliente es responsable de <strong>corroborar y confirmar los datos</strong> de la reserva (fechas, horarios, n\u00famero de personas y monto) al momento de recibir el comprobante.",
        "policy.accept.text":"He le\u00eddo y acepto las",
        "policy.accept.link":"Pol\u00edticas de Reserva",
        "policy.required.title":"Acepta las pol\u00edticas",
        "policy.required.msg":"Debes leer y aceptar las Pol\u00edticas de Reserva antes de continuar.",
        "footer.policy":"Pol\u00edtica de Reservas"
    },
    en: {
        // Navigation
        "nav.home":"Home","nav.property":"Property","nav.book":"Book",
        "nav.location":"Location","nav.reviews":"Reviews","nav.availability":"Availability",
        "nav.contact":"Contact",

        // Hero
        "hero.title":"Your Perfect <em>Escape</em>",
        "hero.subtitle":"Exclusive retreats in El Salvador \u2014 Beach & Lake",

        // Property cards
        "prop.beach":"Beachfront","prop.lake":"Lakeside",
        "prop.beach.short":"Beach","prop.lake.short":"Lake",
        "prop.rancho.name":"Rancho Genesis",
        "prop.rancho.tagline":"Beachfront \u2022 16 guests \u2022 Private pool",
        "prop.lago.name":"Casa del Lago",
        "prop.lago.tagline":"Your intimate escape \u2022 Lake Coatepeque \u2022 10 guests",
        "prop.price.from":"/ night from",

        // Booking buttons
        "book.now":"Book Now","book.check":"Check Availability","book.property":"Book this Property",

        // Photos
        "photos.title":"Property Photos",

        // Calendar
        "cal.title":"Availability",
        "cal.today":"Today","cal.booked":"Booked","cal.checkout":"Checkout 1PM","cal.available":"Available",
        "cal.months":"January,February,March,April,May,June,July,August,September,October,November,December",
        "cal.days":"Sun,Mon,Tue,Wed,Thu,Fri,Sat",
        "cal.tip.transition":"Checkout 1PM / Check-in 3PM<br>Continuous booking",
        "cal.tip.checkin":"Check-in 3PM<br>Accepts checkout until 1PM",
        "cal.tip.late":"Extended checkout 6PM<br>Not available",
        "cal.tip.checkout":"Checkout 1PM<br>Available from 3PM",
        "cal.tip.daypass.no":"Checkout 1PM<br>Not available for ",
        "cal.tip.nextblocked":"Checkout 1PM<br>Next day not available",
        "cal.select.checkin":"Select check-in date",
        "cal.select.checkout":"Now select check-out",

        // Booking form
        "form.property.label":"Property","form.type":"Type",
        "form.fullnight":"Full Night","form.couple":"Couple Promo",
        "form.checkin":"Check-in","form.checkout":"Check-out",
        "form.guests":"Guests","form.pets":"Pets ($20 each)",
        "form.no.pets":"No pets",
        "form.select":"Select...","form.select.property":"Select property...",
        "form.people":"people",
        "form.fullname":"Full name","form.phone":"Phone",
        "form.dui":"ID Number","form.email":"Email (optional)",
        "form.notes":"Special notes","form.notes.label":"Notes",
        "form.schedule":"Schedule",
        "form.schedule.change":"Schedule change (+$50 each)",
        "form.ci.standard":"Standard check-in (3PM)","form.ci.early":"Early check-in (8AM)",
        "form.co.standard":"Standard check-out (1PM)","form.co.late":"Late check-out (6PM)",
        "form.extras":"Available extras",
        "form.extra.guests":"Extra guests ($15 each)",
        "form.extra.room":"5th bedroom (+$50)",
        "booking.details":"Booking Details","booking.personal":"Personal Details",
        "booking.whatsapp":"Send booking via WhatsApp",

        // Price
        "price.total":"Total","price.deposit":"40% Deposit","price.remaining":"Balance on arrival",
        "price.rate":"Rate","price.nights":"night","price.nights.plural":"nights",
        "price.pets":"pets","price.pet":"pet",
        "price.schedule":"Schedule change","price.extras":"Extras",
        "price.noche.ta":"Night (high season)","price.noche.we":"Night (weekend)","price.noche.wd":"Night (weekday)",
        "price.dp.ta":"Day pass (high season)","price.dp.we":"Day pass (weekend)","price.dp.wd":"Day pass (weekday)",
        "price.couple":"Couple promo",

        // Payment
        "payment.title":"Bank transfer details",
        "payment.bank":"Banco de Am\u00e9rica Central (BAC)",
        "payment.type":"USD savings account",
        "payment.account":"Account No.","payment.name":"Account holder",
        "payment.note":"Make the deposit and send the receipt via WhatsApp to confirm.",

        // Reviews
        "reviews.title":"Guest Reviews",
        "reviews.guests.say":"What our guests say",
        "review.share":"Share your experience",
        "review.yourname":"Your name","review.when":"When did you stay?",
        "review.experience":"Tell us about your experience...",
        "review.post":"Post review",
        "review.fullname":"Full name","review.prop":"Property visited",
        "review.date":"Date of your stay","review.rating":"Rating",
        "review.text":"Your review","review.google":"Leave a Google Review",
        "review.photo":"Attach a photo of your favorite moments",
        "review.photo.remove":"Remove photo",

        // Story
        "story.save":"Save image","story.close":"Close",

        // Toast
        "toast.ok":"Got it",
        "toast.unavailable":"Date not available",

        // Booking success
        "success.title":"Booking Received!",
        "success.msg":"Your request has been registered successfully.",
        "success.id":"Booking ID",
        "success.send":"Send your payment receipt via WhatsApp to confirm the booking.",
        "success.ok":"Got it",

        // Footer
        "footer.design":"Design by",

        // Availability errors
        "avail.booked":"This date already has an active reservation. Please select another date.",
        "avail.late":"This date has an extended checkout at 6PM. Cannot book this day.",
        "avail.daypass.no":"Guests check out at 1PM this day. Cannot book Day Pass or Couple Promo.",
        "avail.early.blocked":"Guests check out at 1:00 PM. You can only check in at 3:00 PM.",
        "avail.co.booked":"The checkout date is already booked. You cannot end your stay on that day.",
        "avail.co.late":"Guests check in at 3PM on your checkout day. Your checkout must be at 1:00 PM.",
        "avail.mid.booked":"Your date range includes booked dates.",
        "avail.mid.partial":"Your date range includes dates with guests.",
        "avail.conflict":"Cannot complete the booking. There is an availability conflict with the selected dates.",

        // Schedule
        "sched.both":"Check-in 8AM and checkout 6PM (+${cost}). Subject to availability.",
        "sched.early":"Early check-in 8AM (+$50). Subject to availability.",
        "sched.late":"Late checkout until 6PM (+$50). Subject to availability.",

        // Property data
        "prop.playa.desc":"The perfect beachfront party. Exclusive ranch with private pool, spacious outdoor areas, BBQ grill, and capacity for 16 guests. Ideal for families and large groups seeking fun and adventure by the ocean.",
        "prop.lago.desc":"Your intimate lakeside escape. Cozy house on Lake Coatepeque with private water access, dock, and spectacular views. Perfect for couples, retreats, and small groups seeking peace and nature.",
        "prop.playa.hero":"The perfect beachfront party \u2022 Up to 16 guests",
        "prop.lago.hero":"Your intimate lakeside escape \u2022 Up to 10 guests",

        // Amenities
        "am.pool":"Private pool","am.bbq":"BBQ Grill","am.wifi":"WiFi included",
        "am.parking":"Parking","am.beds.4":"4 bedrooms","am.beds.3":"3 bedrooms",
        "am.pets":"Pet-friendly","am.beach":"Direct beach access","am.kitchen":"Equipped kitchen",
        "am.lake":"Lake access","am.view":"Panoramic view",

        // Map
        "map.location":"Location",

        // Policy
        "policy.title":"Reservation & Cancellation Policy",
        "policy.item1":"All reservations are confirmed only with a <strong>40% advance payment</strong> of the total amount.",
        "policy.item2":"Once payment is made, the date is exclusively blocked for the client, therefore <strong>no refunds will be issued</strong> under any circumstance.",
        "policy.item3":"If the client <strong>does not show up</strong> on the established date and time, the reservation will be considered used and no refund will be given.",
        "policy.item4":"The client is responsible for <strong>verifying and confirming the reservation details</strong> (dates, times, number of guests, and amount) upon receiving the confirmation.",
        "policy.accept.text":"I have read and accept the",
        "policy.accept.link":"Reservation Policy",
        "policy.required.title":"Accept the policy",
        "policy.required.msg":"You must read and accept the Reservation Policy before continuing.",
        "footer.policy":"Reservation Policy"
    }
};

// Global translate helper
function t(key){ return translations[currentLang][key] || translations['es'][key] || key; }

function setLang(lang) {
    if (!translations[lang]) lang = 'es';
    currentLang = lang;
    localStorage.setItem('ge_lang', lang);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        var val = translations[lang][key];
        if (val !== undefined) el.innerHTML = val;
    });

    // Update all elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        var val = translations[lang][key];
        if (val !== undefined) el.placeholder = val;
    });

    // Toggle active class on language buttons
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.documentElement.lang = lang;

    // Re-render dynamic content if functions exist
    if(typeof renderCalendar==='function')renderCalendar();
    if(typeof renderPropDetail==='function')renderPropDetail();
    if(typeof renderHomePhotos==='function')renderHomePhotos();
    if(typeof renderHomeRevs==='function')renderHomeRevs();
    if(typeof renderRevs==='function')renderRevs();
    if(typeof calcPrice==='function')calcPrice();
}

// Initialize on load — auto-detect /en/ path for SEO pre-rendered pages
(function() {
    var pathLang = window.location.pathname.startsWith('/en') ? 'en' : null;
    var saved = pathLang || localStorage.getItem('ge_lang') || 'es';
    currentLang = saved;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setLang(saved); });
    } else {
        setLang(saved);
    }
})();
