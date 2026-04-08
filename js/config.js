let currentProp='playa',currentSection='home';

const PROPS={
    playa:{
        name:'Rancho Genesis',subtitle:'Playa',tagClass:'beach',tagIcon:'fas fa-umbrella-beach',
        get tagText(){return t('prop.beach');},
        get desc(){return t('prop.playa.desc');},
        maxGuests:16,
        get amenities(){return [
            {icon:'fas fa-swimming-pool',t:t('am.pool')},{icon:'fas fa-fire',t:t('am.bbq')},
            {icon:'fas fa-wifi',t:t('am.wifi')},{icon:'fas fa-parking',t:t('am.parking')},
            {icon:'fas fa-bed',t:t('am.beds.4')},{icon:'fas fa-dog',t:t('am.pets')},
            {icon:'fas fa-umbrella-beach',t:t('am.beach')},{icon:'fas fa-utensils',t:t('am.kitchen')}
        ];},
        priceFrom:150,
        images:[
            'img/rancho-playa/rancho-playa-01.jpg','img/rancho-playa/rancho-playa-05.jpg',
            'img/rancho-playa/rancho-playa-10.jpg','img/rancho-playa/rancho-playa-15.jpg',
            'img/rancho-playa/rancho-playa-20.jpg','img/rancho-playa/rancho-playa-25.jpg',
            'img/rancho-playa/rancho-playa-30.jpg','img/rancho-playa/rancho-playa-35.jpg',
            'img/rancho-playa/rancho-playa-40.jpg','img/rancho-playa/rancho-playa-43.jpg',
            'img/rancho-playa/rancho-playa-44.jpg','img/rancho-playa/rancho-playa-45.jpg',
            'img/rancho-playa/rancho-playa-68.jpg','img/rancho-playa/rancho-playa-69.jpg',
            'img/rancho-playa/rancho-playa-71.jpg','img/rancho-playa/rancho-playa-67.jpg'
        ],
        heroImg:'img/rancho-playa/rancho-playa-01.jpg',
        get heroText(){return t('prop.playa.hero');},
        calProp:'rancho-playa',formValue:'rancho-playa'
    },
    lago:{
        name:'Casa del Lago',subtitle:'Lago',tagClass:'lake',tagIcon:'fas fa-water',
        get tagText(){return t('prop.lake');},
        get desc(){return t('prop.lago.desc');},
        maxGuests:10,
        get amenities(){return [
            {icon:'fas fa-water',t:t('am.lake')},
            {icon:'fas fa-wifi',t:t('am.wifi')},{icon:'fas fa-parking',t:t('am.parking')},
            {icon:'fas fa-bed',t:t('am.beds.3')},{icon:'fas fa-dog',t:t('am.pets')},
            {icon:'fas fa-mountain',t:t('am.view')},{icon:'fas fa-utensils',t:t('am.kitchen')}
        ];},
        priceFrom:140,
        images:[
            'img/casa-lago/casa-lago-01.jpg','img/casa-lago/casa-lago-04.jpg',
            'img/casa-lago/casa-lago-07.jpg','img/casa-lago/casa-lago-10.jpg',
            'img/casa-lago/casa-lago-13.jpg','img/casa-lago/casa-lago-16.jpg',
            'img/casa-lago/casa-lago-19.jpg','img/casa-lago/casa-lago-22.jpg',
            'img/casa-lago/casa-lago-34.jpg','img/casa-lago/casa-lago-33.jpg',
            'img/casa-lago/casa-lago-35.jpg','img/casa-lago/casa-lago-32.jpg',
            'img/casa-lago/casa-lago-30.jpg','img/casa-lago/casa-lago-28.jpg'
        ],
        heroImg:'img/casa-lago/casa-lago-01.jpg',
        get heroText(){return t('prop.lago.hero');},
        calProp:'casa-lago',formValue:'casa-lago'
    }
};

const REVIEWS=[
    {name:'J. García',ini:'JG',stars:4,date:'Noviembre 2025',text:'Excelente lugar bastante aseado, cuartos con aire acondicionado, acceso directo al mar. Cuenta con 2 piscinas, una para adultos y una para niños. Hay hamacas, cocina y una glorieta.',src:'google'},
    {name:'Majo',ini:'MA',stars:5,date:'Marzo 2025',text:'Genesis Ranch un lugar muy bonito para disfrutar con la familia, 100% recomendado. La ubicación está a la orilla de la playa, es bien tranquilo el ambiente y la comunicación es muy buena.',src:'google'},
    {name:'Elizabeth Rodríguez',ini:'ER',stars:5,date:'Marzo 2023',text:'Muy bonito lugar, aseado y muy buena atención. Perfecto para disfrutar en familia.',src:'google'},
    {name:'Marleni Santos',ini:'MS',stars:5,date:'Marzo 2025',text:'Excelente lugar para pasar un fin de semana increíble. Totalmente recomendado.',src:'google'},
    {name:'Raul Paul',ini:'RP',stars:5,date:'Marzo 2025',text:'Un lugar espectacular para descansar frente al mar. Las instalaciones están muy bien cuidadas.',src:'google'},
    {name:'María López',ini:'ML',stars:5,date:'Febrero 2026',text:'Increíble experiencia. El rancho es hermoso y está frente al mar. Mis hijos disfrutaron mucho la piscina. Definitivamente volveremos.'},
    {name:'Carlos Martínez',ini:'CM',stars:5,date:'Enero 2026',text:'La casa del lago es un paraíso. La vista al amanecer es impresionante. El acceso al lago y el muelle fueron un plus increíble.'},
    {name:'Ana García',ini:'AG',stars:5,date:'Diciembre 2025',text:'Celebramos año nuevo aquí y fue espectacular. La parrilla, la piscina, todo perfecto. Atención de primera.'},
    {name:'Roberto Flores',ini:'RF',stars:4,date:'Noviembre 2025',text:'Muy buen lugar para desconectarse. La playa está a pasos. Solo sugiero más toallas. Fuera de eso, excelente.'},
    {name:'Daniela Ramos',ini:'DR',stars:5,date:'Octubre 2025',text:'La mejor experiencia de vacaciones en El Salvador. Todo estaba impecable y el equipo fue muy amable.'},
    {name:'Fernando Cruz',ini:'FC',stars:5,date:'Septiembre 2025',text:'Llevamos a nuestros perros y los recibieron con los brazos abiertos. Un lugar que piensa en toda la familia.'},
    {name:'Lucia Portillo',ini:'LP',stars:5,date:'Agosto 2025',text:'Las fiestas agostinas fueron inolvidables en el rancho de playa. Excelente relación calidad-precio.'},
    {name:'Jesús Morales',ini:'JM',stars:4,date:'Julio 2025',text:'La casa del lago tiene una paz que no se encuentra en ningún otro lugar. Perfecto para parejas.'}
];
