const storageKey = 'cadence-tasks-v2';
const legacyKey = 'cadence-tasks-v1';
const themeKey = 'cadence-theme-v1';
const state = { tasks: [], tab: 'focus', plannerView: 'week', theme: 'light', editingId: null, weekAnchor: new Date() };
const nowList = document.querySelector('#now-list');
const nowEmpty = document.querySelector('#now-empty');
const plannerList = document.querySelector('#planner-list');
const progressCopy = document.querySelector('#progress-copy');
const progressFill = document.querySelector('#progress-fill');
const progressBar = document.querySelector('[role="progressbar"]');
const form = document.querySelector('#add-task-form');
const input = document.querySelector('#task-input');
const dateInput = document.querySelector('#date-input');
const timeInput = document.querySelector('#time-input');
const taskSubmit = document.querySelector('#task-submit');
const taskSheetTitle = document.querySelector('#task-sheet-title');
const calendarView = document.querySelector('#calendar-view');
const calendarMonths = document.querySelector('#calendar-months');
const taskSheet = document.querySelector('#task-sheet');
const settingsSheet = document.querySelector('#settings-sheet');
const themeToggle = document.querySelector('#theme-toggle');
const settingsThemeToggle = document.querySelector('#settings-theme-toggle');
const fabMenu = document.querySelector('#fab-menu');
const fabToggle = document.querySelector('#fab-toggle');
const plannerCornerBtn = document.querySelector('#planner-corner-btn');
const menuToggle = document.querySelector('#menu-toggle');
const sidebarOverlay = document.querySelector('#sidebar-overlay');
const sidebarMenu = document.querySelector('#sidebar-menu');
const sidebarClose = document.querySelector('#sidebar-close');
const themeBtnLight = document.querySelector('#theme-btn-light');
const themeBtnDark = document.querySelector('#theme-btn-dark');
const sidebarFocusCount = document.querySelector('#sidebar-focus-count');

const icons = {
    check: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="m3.3 8.1 3 3 6.4-6.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M13.5 6.5 17.5 10.5M4 20l4.1-1 10.6-10.6a2.8 2.8 0 0 0-4-4L4.1 15 4 20Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 7h16M10 11v5M14 11v5M9 7l.8-2h4.4l.8 2M7 7l.7 13h8.6L17 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function id() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function toLocalInput(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 16);
}
function localDate(date) {
    return toLocalInput(date).slice(0, 10);
}
function localTime(date) {
    return toLocalInput(date).slice(11, 16);
}
function dueFromInputs() {
    return new Date(`${dateInput.value}T${timeInput.value}`);
}
function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function isSameDay(d1, d2) {
    const a = new Date(d1);
    const b = new Date(d2);
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function isToday(date) {
    return isSameDay(date, new Date());
}

function isOverdue(date) {
    return startOfDay(date) < startOfDay(new Date());
}

function formatDue(due) {
    const raw = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(new Date(due));
    return capitalize(raw.replace(/, ([0-9]{2}:[0-9]{2})$/, ' às $1'));
}

function formatTime(due) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(new Date(due));
}

function dayLabel(due) {
    const raw = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(new Date(due));
    return capitalize(raw);
}

function getWeekDays(anchorDate) {
    const start = new Date(anchorDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
    }
    return days;
}

function formatWeekRange(startDate, endDate) {
    const formatDayMonth = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });
    const formatYear = new Intl.DateTimeFormat('pt-BR', { year: 'numeric' });

    const startStr = capitalize(formatDayMonth.format(startDate).replace('.', ''));
    const endStr = capitalize(formatDayMonth.format(endDate).replace('.', ''));
    const yearStr = formatYear.format(endDate);

    return `${startStr} – ${endStr} de ${yearStr}`;
}

function seedTasks() {
    const now = new Date();
    const at = (hours, title) => { const d = new Date(now); d.setHours(d.getHours() + hours, 0, 0, 0); return { id: id(), title, due: d.toISOString(), done: false, status: 'planned' }; };
    return [
        { id: id(), title: 'Finalizar planejamento no Cadence', due: now.toISOString(), done: false, status: 'now' },
        at(4, 'Revisar metas do projeto'),
        at(28, 'Organizar arquivos e documentos'),
        at(52, 'Publicar atualização do portfólio')
    ];
}

const defaultSeedTranslations = {
    'Finalize Cadence layout': 'Finalizar planejamento no Cadence',
    'Write project case study': 'Revisar metas do projeto',
    'Organize project files': 'Organizar arquivos e documentos',
    'Publish portfolio update': 'Publicar atualização do portfólio'
};

function migrateLegacy() {
    try {
        const old = JSON.parse(localStorage.getItem(legacyKey));
        if (!Array.isArray(old)) return null;
        const now = new Date();
        return old.map((task, index) => {
            const planned = task.group !== 'Now';
            const due = new Date(now);
            due.setHours(now.getHours() + ((index + 1) * 4), 0, 0, 0);
            return {
                id: id(),
                title: String(task.title || 'Tarefa sem título').slice(0, 90),
                done: Boolean(task.done),
                due: planned ? due.toISOString() : now.toISOString(),
                status: planned ? 'planned' : 'now'
            };
        });
    } catch { return null; }
}

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (Array.isArray(saved)) {
            state.tasks = saved
                .filter(task => task && task.title && task.due)
                .map(task => ({
                    ...task,
                    id: task.id || id(),
                    title: defaultSeedTranslations[task.title] || task.title,
                    done: Boolean(task.done),
                    status: isToday(task.due) ? 'now' : 'planned'
                }));
            return;
        }
    } catch { }
    state.tasks = migrateLegacy() || seedTasks();
    saveTasks();
}

function saveTasks() { localStorage.setItem(storageKey, JSON.stringify(state.tasks)); }

function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'dark' ? '#121a17' : '#F7F6F2');
    const dark = state.theme === 'dark';
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(dark));
        themeToggle.setAttribute('aria-label', `Mudar para modo ${dark ? 'claro' : 'escuro'}`);
        const label = themeToggle.querySelector('.theme-toggle__label');
        if (label) label.textContent = dark ? 'Claro' : 'Escuro';
    }
    if (settingsThemeToggle) {
        settingsThemeToggle.textContent = dark ? 'Modo claro' : 'Modo escuro';
    }
    if (themeBtnLight && themeBtnDark) {
        themeBtnLight.classList.toggle('is-active', !dark);
        themeBtnLight.setAttribute('aria-pressed', String(!dark));
        themeBtnDark.classList.toggle('is-active', dark);
        themeBtnDark.setAttribute('aria-pressed', String(dark));
    }
    localStorage.setItem(themeKey, state.theme);
}

function loadTheme() {
    const saved = localStorage.getItem(themeKey);
    const preferred = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved === 'dark' || saved === 'light' ? saved : preferred);
}

function promoteDueTasks() {
    let changed = false;
    state.tasks.forEach(task => {
        if (isToday(task.due) && task.status !== 'now') {
            task.status = 'now';
            changed = true;
        }
    });
    if (changed) saveTasks();
    return changed;
}

function taskElement(task, context) {
    const item = document.createElement('li');
    item.className = `task ${context === 'planner' ? 'planner-task' : ''} ${task.done ? 'task--done' : ''}`;
    item.dataset.id = task.id;
    const check = document.createElement('button');
    check.className = 'task__check';
    check.type = 'button';
    check.dataset.action = 'toggle';
    check.setAttribute('aria-pressed', String(task.done));
    check.setAttribute('aria-label', `Marcar "${task.title}" como ${task.done ? 'pendente' : 'concluída'}`);
    check.innerHTML = icons.check;
    const body = document.createElement('div');
    body.className = 'task__body';
    const title = document.createElement('span');
    title.className = 'task__title';
    title.textContent = task.title;
    const meta = document.createElement('div');
    meta.className = 'task__meta';

    if (context === 'now') {
        const timeEl = document.createElement('time');
        timeEl.dateTime = task.due;

        if (isOverdue(task.due)) {
            const badge = document.createElement('span');
            badge.className = 'task-badge task-badge--overdue';
            badge.textContent = 'Atrasada';
            timeEl.textContent = formatDue(task.due);
            meta.append(badge, timeEl);
        } else {
            const now = new Date();
            const due = new Date(task.due);
            if (!task.done && due <= now) {
                const badge = document.createElement('span');
                badge.className = 'task-badge task-badge--now';
                badge.textContent = 'Urgente';
                timeEl.textContent = formatTime(task.due);
                meta.append(badge, timeEl);
            } else {
                timeEl.textContent = formatTime(task.due);
                meta.append(timeEl);
            }
        }
    } else {
        const timeEl = document.createElement('time');
        timeEl.dateTime = task.due;
        timeEl.textContent = formatDue(task.due);
        meta.append(timeEl);
    }

    body.append(title, meta);
    const actions = document.createElement('div');
    actions.className = 'task__actions';
    actions.innerHTML = `<button class="task__action" type="button" data-action="edit" aria-label="Editar ${task.title}">${icons.edit}</button><button class="task__action task__action--delete" type="button" data-action="delete" aria-label="Excluir ${task.title}">${icons.delete}</button>`;
    item.append(check, body, actions);
    return item;
}

function renderProgress() {
    const todayTasks = state.tasks.filter(task => isToday(task.due));
    const completed = todayTasks.filter(task => task.done).length;
    const total = todayTasks.length;
    const pending = total - completed;
    const percentage = total ? (completed / total) * 100 : 0;
    progressCopy.textContent = total === 0
        ? 'Nenhuma tarefa agendada para hoje'
        : `${completed} de ${total} ${completed === 1 ? 'tarefa concluída' : 'tarefas concluídas'} hoje`;
    progressFill.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(percentage));
    if (sidebarFocusCount) {
        sidebarFocusCount.textContent = String(pending);
    }
}

function renderFocus() {
    const focusTasks = state.tasks
        .filter(task => isToday(task.due) || (isOverdue(task.due) && !task.done))
        .sort((a, b) => new Date(a.due) - new Date(b.due));
    nowList.replaceChildren(...focusTasks.map(task => taskElement(task, 'now')));
    nowEmpty.hidden = focusTasks.length !== 0;
}

function layoutDayEvents(events, hourRowHeight = 52) {
    if (!events.length) return [];

    const sorted = [...events].sort((a, b) => new Date(a.due) - new Date(b.due));
    const items = sorted.map(event => {
        const d = new Date(event.due);
        const top = (d.getHours() + d.getMinutes() / 60) * hourRowHeight;
        const height = Math.max(44, hourRowHeight * 0.9);
        return {
            event,
            top,
            height,
            bottom: top + height,
            colIndex: 0,
            totalCols: 1
        };
    });

    for (let i = 0; i < items.length; i++) {
        const current = items[i];
        const overlapping = [current];

        for (let j = 0; j < items.length; j++) {
            if (i === j) continue;
            const other = items[j];
            if (current.top < other.bottom && current.bottom > other.top) {
                overlapping.push(other);
            }
        }

        if (overlapping.length > 1) {
            overlapping.sort((a, b) => a.top - b.top || a.event.id.localeCompare(b.event.id));
            overlapping.forEach((item, idx) => {
                item.colIndex = Math.max(item.colIndex, idx);
                item.totalCols = Math.max(item.totalCols, overlapping.length);
            });
        }
    }

    return items;
}

/* PLANNER SEMANAL */
function renderWeek() {
    plannerList.replaceChildren();

    const days = getWeekDays(state.weekAnchor);
    const weekStart = startOfDay(days[0]);
    const weekEnd = new Date(days[6]);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTasks = state.tasks
        .filter(task => {
            const d = new Date(task.due);
            return d >= weekStart && d <= weekEnd;
        })
        .sort((a, b) => new Date(a.due) - new Date(b.due));

    const toolbar = document.createElement('div');
    toolbar.className = 'week-toolbar';
    toolbar.innerHTML = `
        <div class="week-toolbar__nav">
            <button class="week-nav-btn" type="button" data-week-nav="prev" aria-label="Semana anterior">‹</button>
            <button class="week-nav-btn week-nav-btn--today" type="button" data-week-nav="today">Hoje</button>
            <button class="week-nav-btn" type="button" data-week-nav="next" aria-label="Próxima semana">›</button>
        </div>
        <span class="week-toolbar__label">${formatWeekRange(days[0], days[6])}</span>
    `;

    const gridView = document.createElement('div');
    gridView.className = 'week-grid-view';

    const gridHeader = document.createElement('div');
    gridHeader.className = 'week-grid-header';

    const tzGutter = document.createElement('div');
    tzGutter.className = 'week-grid-tz-gutter';
    tzGutter.textContent = 'GMT-3';
    gridHeader.append(tzGutter);

    const dayHeaders = document.createElement('div');
    dayHeaders.className = 'week-grid-day-headers';

    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    days.forEach(day => {
        const head = document.createElement('div');
        const isTodayCol = isToday(day);
        head.className = `week-grid-day-head ${isTodayCol ? 'is-today' : ''}`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'day-head__name';
        nameSpan.textContent = dayNames[day.getDay()];

        const numSpan = document.createElement('span');
        numSpan.className = 'day-head__num';
        numSpan.textContent = day.getDate();

        head.append(nameSpan, numSpan);
        dayHeaders.append(head);
    });
    gridHeader.append(dayHeaders);

    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'week-grid-scroll';
    scrollContainer.id = 'week-grid-scroll';

    const gridBody = document.createElement('div');
    gridBody.className = 'week-grid-body';

    const timeCol = document.createElement('div');
    timeCol.className = 'week-grid-time-col';

    const hourRowHeight = 52;

    for (let h = 0; h < 24; h++) {
        const slot = document.createElement('div');
        slot.className = 'time-slot-label';
        slot.textContent = `${String(h).padStart(2, '0')}:00`;
        timeCol.append(slot);
    }
    gridBody.append(timeCol);

    const dayCols = document.createElement('div');
    dayCols.className = 'week-grid-day-cols';

    days.forEach(day => {
        const col = document.createElement('div');
        const isTodayCol = isToday(day);
        col.className = `week-grid-col ${isTodayCol ? 'is-today' : ''}`;
        col.dataset.calendarDate = localDate(day);

        for (let h = 0; h < 24; h++) {
            const line = document.createElement('div');
            line.className = 'hour-line';
            line.dataset.hour = String(h).padStart(2, '0');
            line.title = `Clique para agendar às ${String(h).padStart(2, '0')}:00 em ${dayNames[day.getDay()]}, ${day.getDate()}`;
            col.append(line);
        }

        if (isTodayCol) {
            const now = new Date();
            const topMinutes = now.getHours() * 60 + now.getMinutes();
            const lineTop = (topMinutes / 60) * hourRowHeight;

            const timeLine = document.createElement('div');
            timeLine.className = 'current-time-line';
            timeLine.style.top = `${lineTop}px`;
            timeLine.innerHTML = `<span class="current-time-dot"></span>`;
            col.append(timeLine);
        }

        const dayTasks = weekTasks.filter(task => isSameDay(task.due, day));
        const positioned = layoutDayEvents(dayTasks, hourRowHeight);

        positioned.forEach(({ event: task, top, height, colIndex, totalCols }) => {
            const card = document.createElement('div');
            card.className = `week-task-card ${task.done ? 'task--done' : ''}`;
            card.dataset.id = task.id;

            const widthPct = totalCols > 1 ? (100 / totalCols) : 100;
            const leftPct = colIndex * widthPct;
            card.style.top = `${top}px`;
            card.style.height = `${height}px`;
            card.style.width = totalCols > 1 ? `calc(${widthPct}% - 4px)` : `calc(100% - 6px)`;
            card.style.left = totalCols > 1 ? `calc(${leftPct}% + 2px)` : `3px`;
            card.title = `${task.title} (${formatTime(task.due)})`;

            card.innerHTML = `
                <button class="week-task-card__check" type="button" data-action="toggle" aria-label="Marcar como ${task.done ? 'pendente' : 'concluída'}">
                    ${icons.check}
                </button>
                <div class="week-task-card__content">
                    <span class="week-task-card__time">${formatTime(task.due)}</span>
                    <span class="week-task-card__title">${task.title}</span>
                </div>
                <div class="week-task-card__actions">
                    <button class="week-task-card__action" type="button" data-action="edit" aria-label="Editar">${icons.edit}</button>
                    <button class="week-task-card__action week-task-card__action--delete" type="button" data-action="delete" aria-label="Excluir">${icons.delete}</button>
                </div>
            `;
            col.append(card);
        });

        dayCols.append(col);
    });

    gridBody.append(dayCols);
    scrollContainer.append(gridBody);
    gridView.append(gridHeader, scrollContainer);

    const listView = document.createElement('div');
    listView.className = 'week-list-view';

    if (!weekTasks.length) {
        const empty = document.createElement('p');
        empty.className = 'planner-empty';
        empty.textContent = 'Nenhuma tarefa agendada para esta semana.';
        listView.append(empty);
    } else {
        let previousDay = '';
        const list = document.createElement('ul');
        list.className = 'planner-list';

        weekTasks.forEach(task => {
            const label = dayLabel(task.due);
            if (label !== previousDay) {
                const day = document.createElement('li');
                day.className = 'planner-day';
                day.textContent = label;
                list.append(day);
                previousDay = label;
            }
            list.append(taskElement(task, 'planner'));
        });
        listView.append(list);
    }

    plannerList.replaceChildren(toolbar, gridView, listView);

    requestAnimationFrame(() => {
        const scrollEl = document.getElementById('week-grid-scroll');
        if (scrollEl) {
            const currentHour = new Date().getHours();
            scrollEl.scrollTop = Math.max(0, (currentHour - 1) * hourRowHeight);
        }
    });
}

function renderCalendar() {
    calendarMonths.replaceChildren();
    const base = new Date();
    const today = startOfDay(base).getTime();
    for (let offset = 0; offset < 12; offset++) {
        const month = new Date(base.getFullYear(), base.getMonth() + offset, 1);
        const card = document.createElement('section');
        card.className = 'month';
        const title = document.createElement('h3');
        title.className = 'month__title';
        title.textContent = capitalize(new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(month));
        const weekdays = document.createElement('div');
        weekdays.className = 'weekdays';
        ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach(letter => {
            const label = document.createElement('span');
            label.textContent = letter;
            weekdays.append(label);
        });
        const grid = document.createElement('div');
        grid.className = 'month__grid';
        const first = new Date(month.getFullYear(), month.getMonth(), 1);
        const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        for (let blank = 0; blank < first.getDay(); blank++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day calendar-day--blank';
            grid.append(cell);
        }
        for (let date = 1; date <= count; date++) {
            const day = new Date(month.getFullYear(), month.getMonth(), date);
            const tasks = state.tasks.filter(task => {
                const due = new Date(task.due);
                return due.getFullYear() === day.getFullYear() && due.getMonth() === day.getMonth() && due.getDate() === day.getDate();
            });
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = `calendar-day ${startOfDay(day).getTime() === today ? 'calendar-day--today' : ''}`;
            cell.dataset.calendarDate = toLocalInput(day).slice(0, 10);
            cell.setAttribute('aria-label', `${date}, ${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`);
            cell.innerHTML = `<span class="calendar-day__number">${date}</span>${tasks.slice(0, 3).map(() => '<span class="calendar-day__dot"></span>').join('')}${tasks.length > 3 ? `<span class="calendar-day__more">+${tasks.length - 3}</span>` : ''}`;
            grid.append(cell);
        }
        card.append(title, weekdays, grid);
        calendarMonths.append(card);
    }
}

function renderPlanner() {
    const calendar = state.plannerView === 'month';
    plannerList.hidden = calendar;
    calendarView.hidden = !calendar;
    if (calendar) renderCalendar(); else renderWeek();
}

function render() {
    promoteDueTasks();
    renderProgress();
    renderFocus();
    renderPlanner();
}

function switchTab(tab) {
    state.tab = tab;
    const focus = tab === 'focus';
    document.querySelector('#focus-panel').hidden = !focus;
    document.querySelector('#planner-panel').hidden = focus;

    if (plannerCornerBtn) {
        if (focus) {
            plannerCornerBtn.innerHTML = '<span class="nav-switch-btn__icon" aria-hidden="true">▦</span><span class="nav-switch-btn__label">Planejador</span>';
            plannerCornerBtn.setAttribute('aria-label', 'Mudar para Planejador');
        } else {
            plannerCornerBtn.innerHTML = '<span class="nav-switch-btn__icon" aria-hidden="true">◉</span><span class="nav-switch-btn__label">Foco</span>';
            plannerCornerBtn.setAttribute('aria-label', 'Voltar para o painel Foco');
        }
    }

    if (!focus && state.plannerView === 'week') {
        requestAnimationFrame(() => {
            const scrollEl = document.getElementById('week-grid-scroll');
            if (scrollEl) {
                const currentHour = new Date().getHours();
                scrollEl.scrollTop = Math.max(0, (currentHour - 1) * 52);
            }
        });
    }
}

function defaultDue() { return new Date(Date.now() + 3600000); }

function fillTaskForm(task, preset) {
    const due = task ? new Date(task.due) : (preset?.due || defaultDue());
    input.value = task?.title || '';
    dateInput.value = localDate(due);
    timeInput.value = preset?.time || localTime(due);
    const minDate = task ? new Date(Math.min(Date.now(), due.getTime())) : new Date();
    dateInput.min = localDate(minDate);
}

function resetTaskForm() {
    state.editingId = null;
    form.classList.remove('is-editing');
    taskSheetTitle.textContent = 'Agendar tarefa';
    taskSubmit.textContent = 'Adicionar';
    taskSubmit.setAttribute('aria-label', 'Agendar tarefa');
    fillTaskForm(null);
}

function openSheet(sheet) {
    fabMenu.classList.remove('is-open');
    fabToggle.setAttribute('aria-expanded', 'false');
    fabToggle.setAttribute('aria-label', 'Abrir ações rápidas');
    sheet.hidden = false;
    sheet.querySelector('input, button')?.focus();
}

function closeSheet(sheet) {
    sheet.hidden = true;
    if (sheet === taskSheet) resetTaskForm();
}

function openSidebar() {
    if (!sidebarMenu || !sidebarOverlay) return;
    fabMenu?.classList.remove('is-open');
    fabToggle?.setAttribute('aria-expanded', 'false');
    fabToggle?.setAttribute('aria-label', 'Abrir ações rápidas');
    sidebarOverlay.hidden = false;
    requestAnimationFrame(() => {
        sidebarOverlay.classList.add('is-open');
        sidebarMenu.classList.add('is-open');
        sidebarMenu.setAttribute('aria-hidden', 'false');
        menuToggle?.setAttribute('aria-expanded', 'true');
    });
}

function closeSidebar() {
    if (!sidebarMenu || !sidebarOverlay) return;
    sidebarOverlay.classList.remove('is-open');
    sidebarMenu.classList.remove('is-open');
    sidebarMenu.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
        if (!sidebarMenu.classList.contains('is-open')) {
            sidebarOverlay.hidden = true;
        }
    }, 240);
}

function openTaskSheet(task, preset) {
    state.editingId = task?.id || null;
    const editing = Boolean(task);
    form.classList.toggle('is-editing', editing);
    taskSheetTitle.textContent = editing ? 'Editar tarefa' : 'Agendar tarefa';
    taskSubmit.textContent = editing ? 'Salvar' : '+';
    taskSubmit.setAttribute('aria-label', editing ? 'Salvar tarefa' : 'Agendar tarefa');
    fillTaskForm(task, preset);
    openSheet(taskSheet);
    input.focus();
    if (editing) input.select();
}

document.addEventListener('click', event => {
    if (event.target.closest('#planner-corner-btn')) {
        switchTab(state.tab === 'focus' ? 'planner' : 'focus');
        return;
    }
    if (event.target.closest('#menu-toggle')) {
        openSidebar();
        return;
    }
    if (event.target.closest('#sidebar-close') || event.target === sidebarOverlay) {
        closeSidebar();
        return;
    }
    const sidebarAction = event.target.closest('[data-sidebar-action]');
    if (sidebarAction) {
        const action = sidebarAction.dataset.sidebarAction;
        if (action === 'focus') {
            switchTab('focus');
            closeSidebar();
        } else if (action === 'planner') {
            switchTab('planner');
            closeSidebar();
        } else if (action === 'new-task') {
            closeSidebar();
            openTaskSheet(null, { due: new Date() });
        }
        return;
    }
    const themeSet = event.target.closest('[data-theme-set]');
    if (themeSet) {
        applyTheme(themeSet.dataset.themeSet);
        return;
    }
    if (event.target.closest('#sidebar-export-tasks')) {
        const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cadence-tasks.json';
        link.click();
        URL.revokeObjectURL(url);
        return;
    }
    if (event.target.closest('#sidebar-reset-tasks')) {
        if (window.confirm('Tem certeza de que deseja apagar todas as tarefas do Cadence deste dispositivo?')) {
            state.tasks = [];
            saveTasks();
            render();
            closeSidebar();
        }
        return;
    }
    if (event.target.closest('#focus-quick-add') || event.target.closest('#now-empty-add')) {
        openTaskSheet(null, { due: new Date() });
        return;
    }
    if (event.target.closest('#fab-toggle')) {
        const isOpen = fabMenu.classList.toggle('is-open');
        fabToggle.setAttribute('aria-expanded', String(isOpen));
        fabToggle.setAttribute('aria-label', isOpen ? 'Fechar ações rápidas' : 'Abrir ações rápidas');
        return;
    }
    const fabAction = event.target.closest('[data-fab]');
    if (fabAction) {
        if (fabAction.dataset.fab === 'task') openTaskSheet();
        if (fabAction.dataset.fab === 'planner') {
            switchTab('planner');
            fabMenu.classList.remove('is-open');
            fabToggle.setAttribute('aria-expanded', 'false');
            fabToggle.setAttribute('aria-label', 'Abrir ações rápidas');
        }
        if (fabAction.dataset.fab === 'settings') openSidebar();
        return;
    }
    if (event.target === taskSheet || event.target === settingsSheet) {
        closeSheet(event.target);
        return;
    }
    const close = event.target.closest('[data-close]');
    if (close) {
        closeSheet(document.querySelector(`#${close.dataset.close}`));
        return;
    }
    const weekNav = event.target.closest('[data-week-nav]');
    if (weekNav) {
        const nav = weekNav.dataset.weekNav;
        if (nav === 'prev') {
            state.weekAnchor.setDate(state.weekAnchor.getDate() - 7);
        } else if (nav === 'next') {
            state.weekAnchor.setDate(state.weekAnchor.getDate() + 7);
        } else if (nav === 'today') {
            state.weekAnchor = new Date();
        }
        renderPlanner();
        return;
    }
    const hourLine = event.target.closest('.hour-line');
    if (hourLine) {
        const col = hourLine.closest('[data-calendar-date]');
        if (col) {
            const dateStr = col.dataset.calendarDate;
            const hourStr = hourLine.dataset.hour;
            openTaskSheet(null, { due: new Date(`${dateStr}T${hourStr}:00`), time: `${hourStr}:00` });
            return;
        }
    }
    const weekCard = event.target.closest('.week-task-card');
    if (weekCard && !event.target.closest('[data-action]')) {
        const task = state.tasks.find(entry => entry.id === weekCard.dataset.id);
        if (task) {
            openTaskSheet(task);
            return;
        }
    }
    if (event.target.closest('#calendar-reset')) {
        renderCalendar();
        return;
    }
    const calendarDay = event.target.closest('.calendar-day[data-calendar-date]');
    if (calendarDay) {
        openTaskSheet(null, { due: new Date(`${calendarDay.dataset.calendarDate}T09:00`) });
        return;
    }
    if (event.target.closest('#theme-toggle') || event.target.closest('#settings-theme-toggle')) {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        return;
    }
    if (event.target.closest('#export-tasks')) {
        const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cadence-tasks.json';
        link.click();
        URL.revokeObjectURL(url);
        return;
    }
    if (event.target.closest('#reset-tasks')) {
        if (window.confirm('Tem certeza de que deseja apagar todas as tarefas do Cadence deste dispositivo?')) {
            state.tasks = [];
            saveTasks();
            render();
            closeSheet(settingsSheet);
        }
        return;
    }
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) {
        state.plannerView = viewButton.dataset.view;
        document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button === viewButton)));
        renderPlanner();
        return;
    }
    const action = event.target.closest('[data-action]');
    if (!action) return;
    const item = action.closest('.task') || action.closest('.week-task-card');
    const task = state.tasks.find(entry => entry.id === item?.dataset.id);
    if (!task) return;
    if (action.dataset.action === 'toggle') {
        task.done = !task.done;
        saveTasks();
        render();
    }
    if (action.dataset.action === 'delete' && window.confirm(`Excluir “${task.title}”?`)) {
        state.tasks = state.tasks.filter(entry => entry.id !== task.id);
        saveTasks();
        render();
    }
    if (action.dataset.action === 'edit') openTaskSheet(task);
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (sidebarMenu && sidebarMenu.classList.contains('is-open')) {
        event.preventDefault();
        closeSidebar();
        return;
    }
    if (!taskSheet.hidden) {
        event.preventDefault();
        closeSheet(taskSheet);
    } else if (!settingsSheet.hidden) {
        event.preventDefault();
        closeSheet(settingsSheet);
    }
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const title = input.value.trim().slice(0, 90);
    const due = dueFromInputs();
    if (!title || Number.isNaN(due.getTime())) return;
    const status = isToday(due) ? 'now' : 'planned';
    const editing = state.tasks.find(task => task.id === state.editingId);
    if (editing) {
        editing.title = title;
        editing.due = due.toISOString();
        editing.status = status;
    } else {
        state.tasks.push({ id: id(), title, due: due.toISOString(), done: false, status });
    }
    saveTasks();
    render();
    closeSheet(taskSheet);
});

document.querySelector('#today').textContent = capitalize(
    new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(new Date())
);
resetTaskForm();
loadTheme();
loadTasks();
render();
setInterval(() => { if (promoteDueTasks()) render(); }, 30000);
