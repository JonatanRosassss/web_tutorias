/* ==========================================================================
   HYW_JON TUTORÍAS - SCRIPT.JS v1.2
   Lógica interactiva de la Calculadora, Reloj XP, Menú Inicio y Partículas DS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. RELOJ DE LA BARRA DE TAREAS WINDOWS XP
    const xpClock = document.getElementById('xpClock');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (xpClock) {
            xpClock.textContent = `${hours}:${minutes}`;
        }
    }
    updateClock();
    setInterval(updateClock, 10000);

    // 2. TOGGLE MENÚ INICIO XP
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                startMenu.classList.remove('open');
            }
        });
    }

    // 3. CALCULADORA INTERACTIVA DE PRESUPUESTO
    const calcMode = document.getElementById('calcMode');
    const calcHours = document.getElementById('calcHours');
    const calcStudents = document.getElementById('calcStudents');
    const studentsGroup = document.getElementById('studentsGroup');
    const calcTopic = document.getElementById('calcTopic');
    const totalAmount = document.getElementById('totalAmount');
    const calcBreakdown = document.getElementById('calcBreakdown');
    const wsReserveBtn = document.getElementById('wsReserveBtn');

    const rates = {
        'virt_ind': { price: 10000, isGroup: false, name: 'Virtual Individual (1 a 1)' },
        'pres_ind': { price: 13000, isGroup: false, name: 'Presencial Individual (1 a 1)' },
        'virt_grp': { price: 7000, isGroup: true, name: 'Virtual Colectivo (Grupal)' },
        'pres_grp': { price: 8000, isGroup: true, name: 'Presencial Colectivo (Grupal)' }
    };

    function calculateBudget() {
        const selectedModeKey = calcMode.value;
        const modeData = rates[selectedModeKey];
        const hours = Math.max(1, parseInt(calcHours.value) || 1);
        const topicText = calcTopic.value.trim() || 'Consulta / Preparación de Examen';
        
        let total = 0;
        let breakdownText = '';
        let whatsappMsg = '';

        if (modeData.isGroup) {
            studentsGroup.style.display = 'flex';
            const students = Math.max(2, Math.min(5, parseInt(calcStudents.value) || 2));
            total = hours * modeData.price * students;
            const totalPerStudent = hours * modeData.price;
            
            breakdownText = `${hours} hs x ${students} alumnos = $${totalPerStudent.toLocaleString('es-AR')} por persona (Total: $${total.toLocaleString('es-AR')})`;
            whatsappMsg = `Hola Jon! Soy alumno de la Univ. de Pilar y te escribo desde la web. Queremos consultar por el Plan Colectivo (${modeData.name}) para ${students} alumnos por ${hours} hs. Tema: "${topicText}". Presupuesto estimado: $${total.toLocaleString('es-AR')}.`;
        } else {
            studentsGroup.style.display = 'none';
            total = hours * modeData.price;
            breakdownText = `${hours} hora(s) x $${modeData.price.toLocaleString('es-AR')} (${modeData.name})`;
            whatsappMsg = `Hola Jon! Soy alumno de la Univ. de Pilar y te escribo desde la web. Quiero reservar una clase ${modeData.name} por ${hours} hs. Tema: "${topicText}". Presupuesto estimado: $${total.toLocaleString('es-AR')}.`;
        }

        totalAmount.textContent = `$${total.toLocaleString('es-AR')} ARS`;
        calcBreakdown.textContent = breakdownText;

        // Actualizar URL del botón de WhatsApp
        const encodedMsg = encodeURIComponent(whatsappMsg);
        wsReserveBtn.href = `https://wa.me/541173690564?text=${encodedMsg}`;
    }

    if (calcMode && calcHours && calcStudents) {
        calcMode.addEventListener('change', calculateBudget);
        calcHours.addEventListener('input', calculateBudget);
        calcStudents.addEventListener('input', calculateBudget);
        if (calcTopic) calcTopic.addEventListener('input', calculateBudget);
        
        // Ejecutar primer cálculo inicial
        calculateBudget();
    }

    // 4. ACCORDION FAQ (NPC DIALOGUES)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });

    // 5. ANIMACIÓN DE PARTÍCULAS / EMBERS (DARK SOULS BONFIRE)
    const canvas = document.getElementById('emberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 45;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 0.5,
                speedY: Math.random() * 1.2 + 0.3,
                speedX: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                color: Math.random() > 0.3 ? '#ff5500' : '#d4af37'
            });
        }

        function animateEmbers() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += p.speedX;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animateEmbers);
        }

        animateEmbers();
    }

    // 6. CONTROLES SIMULADOS DE VENTANA XP
    const winClose = document.querySelector('.win-close');
    const mainWindow = document.getElementById('mainWindow');
    if (winClose && mainWindow) {
        winClose.addEventListener('click', () => {
            if (confirm("¿Estás seguro de cerrar la ventana de tutorías hyw_jon.exe? Te perderás de aprobar tu final.")) {
                mainWindow.style.display = 'none';
                setTimeout(() => {
                    alert("¡Hoguera reencendida! La ventana se ha restaurado.");
                    mainWindow.style.display = 'block';
                }, 1000);
            }
        });
    }

});
