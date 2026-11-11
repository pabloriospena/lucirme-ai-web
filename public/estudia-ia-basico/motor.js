(() => {
  const escenario = document.querySelector('.escenario');
  const slides = [...document.querySelectorAll('.slide')];
  const barra = document.querySelector('.progreso');
  const AUTO = [
    '.lista > li', '.filas > .fila-g', '.bandas > .banda', '.escalera > .peldano', '.grafico > .hbar',
    '.columnas > .columna', '.opciones > .opcion', '.ciclo > .paso-ciclo', '.ciclo > .union', '.pregunta-g',
    '.chips > .chip', '.capturas > .marco', '.flujo > *', '.nv', '.tres > *', '.dos > *',
  ].join(',');
  const LIGADOS = '.union, .flecha';

  let actual = 0;
  let paso = 0;
  let modoPasos = true;
  let relojes = [];
  const pasosDe = new Map();
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formato = (segundos) => `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;

  const pips = document.createElement('div');
  pips.className = 'pasos';
  escenario.append(pips);

  const ajustar = () => {
    const escala = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    escenario.style.transform = `translate(-50%, -50%) scale(${escala})`;
  };

  const construirPasos = (slide) => {
    const explicitos = [...slide.querySelectorAll('[data-paso]')];
    if (explicitos.length) {
      const grupos = new Map();
      explicitos.forEach((el) => {
        const numero = Number(el.dataset.paso);
        if (!grupos.has(numero)) grupos.set(numero, []);
        grupos.get(numero).push(el);
      });
      return [...grupos.entries()].sort((a, b) => a[0] - b[0]).map(([, elementos]) => elementos);
    }
    const candidatos = [...slide.querySelectorAll(AUTO)].filter((el) => !el.classList.contains('sin-paso'));
    const hojas = candidatos.filter((el) => !candidatos.some((otro) => otro !== el && el.contains(otro)));
    const grupos = [];
    let pendientes = [];
    hojas.forEach((el) => {
      if (el.matches(LIGADOS)) pendientes.push(el);
      else { grupos.push([...pendientes, el]); pendientes = []; }
    });
    return grupos;
  };

  slides.forEach((slide) => pasosDe.set(slide, construirPasos(slide)));

  const animarNumeros = (raiz) => {
    raiz.querySelectorAll('[data-contar]').forEach((el) => {
      if (el.closest('.paso-oculto')) return;
      const meta = Number(el.dataset.contar);
      const sufijo = el.dataset.sufijo || '';
      if (sinMovimiento) { el.textContent = meta + sufijo; return; }
      const inicio = performance.now();
      const siguiente = (ahora) => {
        const avance = Math.min((ahora - inicio) / 1400, 1);
        el.textContent = Math.round(meta * (1 - Math.pow(1 - avance, 3))) + sufijo;
        if (avance < 1) requestAnimationFrame(siguiente);
      };
      requestAnimationFrame(siguiente);
    });
  };

  const arrancarRelojes = (slide) => {
    relojes.forEach(clearInterval);
    relojes = [];
    slide.querySelectorAll('[data-segundos]').forEach((el) => {
      let restante = Number(el.dataset.segundos);
      el.textContent = formato(restante);
      if (sinMovimiento) return;
      const intervalo = setInterval(() => {
        restante = Math.max(0, restante - 1);
        el.textContent = formato(restante);
        if (restante === 0) clearInterval(intervalo);
      }, 1000);
      relojes.push(intervalo);
    });
  };

  const actualizarSolos = () => {
    slides[actual].querySelectorAll('[data-solo]').forEach((el) => {
      const activo = Number(el.dataset.solo) === paso;
      el.classList.toggle('paso-oculto', !activo);
      el.classList.toggle('paso-visible', activo);
    });
  };

  const pintarPips = () => {
    const total = pasosDe.get(slides[actual]).length;
    actualizarSolos();
    pips.innerHTML = modoPasos && total ? Array.from({ length: total }, (_, i) => `<i class="${i < paso ? 'on' : ''}"></i>`).join('') : '';
  };

  const prepararPasos = (slide, mostrarTodo) => {
    const grupos = pasosDe.get(slide);
    grupos.flat().forEach((el) => el.classList.remove('paso-oculto', 'paso-visible'));
    paso = modoPasos && !mostrarTodo ? 0 : grupos.length;
    if (modoPasos) grupos.forEach((grupo, i) => grupo.forEach((el) => el.classList.toggle('paso-oculto', i >= paso)));
  };

  const ir = (indice, atras = false) => {
    actual = Math.max(0, Math.min(slides.length - 1, indice));
    prepararPasos(slides[actual], atras);
    slides.forEach((slide, posicion) => slide.classList.toggle('activa', posicion === actual));
    barra.style.width = `${((actual + 1) / slides.length) * 100}%`;
    history.replaceState(null, '', location.pathname + location.search + `#${actual + 1}`);
    animarNumeros(slides[actual]);
    arrancarRelojes(slides[actual]);
    pintarPips();
  };

  const avanzar = () => {
    const grupos = pasosDe.get(slides[actual]);
    if (modoPasos && paso < grupos.length) {
      grupos[paso].forEach((el) => {
        el.classList.remove('paso-oculto');
        el.classList.add('paso-visible');
        animarNumeros(el);
      });
      paso += 1;
      pintarPips();
    } else if (actual < slides.length - 1) ir(actual + 1);
  };

  const retroceder = () => {
    const grupos = pasosDe.get(slides[actual]);
    if (modoPasos && paso > 0) {
      paso -= 1;
      grupos[paso].forEach((el) => { el.classList.add('paso-oculto'); el.classList.remove('paso-visible'); });
      pintarPips();
    } else if (actual > 0) ir(actual - 1, true);
  };

  slides.forEach((slide, posicion) => {
    const numero = document.createElement('span');
    numero.className = 'numero-slide';
    numero.textContent = `${posicion + 1} / ${slides.length}`;
    slide.append(numero);
  });

  window.addEventListener('resize', ajustar);
  window.addEventListener('beforeprint', () => document.querySelectorAll('.paso-oculto').forEach((el) => el.classList.remove('paso-oculto')));
  window.addEventListener('afterprint', () => ir(actual));
  window.addEventListener('keydown', (evento) => {
    const tecla = evento.key;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(tecla)) { evento.preventDefault(); evento.shiftKey ? ir(actual + 1) : avanzar(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(tecla)) { evento.preventDefault(); evento.shiftKey ? ir(actual - 1) : retroceder(); }
    else if (tecla === 'Home') ir(0);
    else if (tecla === 'End') ir(slides.length - 1);
    else if (tecla.toLowerCase() === 's') { modoPasos = !modoPasos; ir(actual, true); }
    else if (tecla.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  document.addEventListener('click', (evento) => (evento.clientX < window.innerWidth * 0.25 ? retroceder() : avanzar()));

  ajustar();
  ir((Number(location.hash.slice(1)) || 1) - 1);
})();
