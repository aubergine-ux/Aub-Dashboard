const theme = {
  ink: '#e8d5ff',
  rule: '#3d2261',
  panel: '#1e0f33',
  ramp: ['#b57bff', '#9a5ce8', '#7f42d1', '#6b21a8', '#4c1580'],
  green: '#4ade80',
}

const main = document.getElementById('main')
const sidebar = document.getElementById('sidebar')
const dashboard = main.innerHTML

function openSidebar() {
  sidebar.classList.add('sidebar-responsive')
}

function closeSidebar() {
  sidebar.classList.remove('sidebar-responsive')
}

const settings = {
  accent: '#b57bff',
  lowStock: 10,
  density: 'comfortable',
  landing: 'dashboard',
}

Object.assign(settings, JSON.parse(localStorage.getItem('dash:settings') || '{}'))

function applySettings() {
  document.documentElement.style.setProperty('--accent', settings.accent)
  document.body.classList.toggle('compact', settings.density === 'compact')
  localStorage.setItem('dash:settings', JSON.stringify(settings))
}

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1200, stock: 27 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 599, stock: 5 },
  { id: 3, name: 'Monitor', category: 'Electronics', price: 199, stock: 0 },
  { id: 4, name: 'Headphones', category: 'Audio', price: 99, stock: 0 },
  { id: 5, name: 'Camera', category: 'Photography', price: 49, stock: 0 },
  { id: 6, name: 'Keyboard', category: 'Accessories', price: 120, stock: 67 },
  { id: 7, name: 'Mouse', category: 'Accessories', price: 35, stock: 6 },
]

const customers = [
  { id: 1, name: 'Ada Lovefella', email: 'adal@email.com', orders: 15, spent: 6700 },
  { id: 2, name: 'Alan Toronto', email: 'alant@email.com', orders: 8, spent: 3211 },
  { id: 3, name: 'Grace Herevan', email: 'graceh@email.com', orders: 32, spent: 11940 },
  { id: 4, name: 'Linus Sebis', email: 'linust@email.com', orders: 1, spent: 50 },
  { id: 5, name: 'Lewis Hamilton', email: 'lewish@email.com', orders: 11, spent: 600 },
]

const inventory = [
  { id: 1, item: 'Laptop', warehouse: 'North', quantity: 24, reorder: 10 },
  { id: 2, item: 'Phone', warehouse: 'North', quantity: 8, reorder: 15 },
  { id: 3, item: 'Monitor', warehouse: 'South', quantity: 15, reorder: 8 },
  { id: 4, item: 'Headphones', warehouse: 'East', quantity: 0, reorder: 12 },
  { id: 5, item: 'Camera', warehouse: 'South', quantity: 12, reorder: 6 },
]

const money = (n) => `$${n.toLocaleString()}`
const sum = (arr, fn) => arr.reduce((n, x) => n + fn(x), 0)
const badge = (text, tone) => `<span class="badge badge-${tone}">${text}</span>`

function stockBadge(n) {
  if (n === 0) return badge('Out of Stock', 'red')
  if (n < settings.lowStock) return badge('Low Stock', 'orange')
  return badge('In Stock', 'green')
}

function byCategory() {
  const groups = products.reduce((acc, p) => {
    acc[p.category] ??= { category: p.category, count: 0, stock: 0, value: 0 }
    acc[p.category].count += 1
    acc[p.category].stock += p.stock
    acc[p.category].value += p.price * p.stock
    return acc
  }, {})

  return Object.values(groups)
}

const views = {
  products: {
    rows: () => products,
    sortable: true,
    cols: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price', cell: (p) => money(p.price) },
      { key: 'stock', label: 'Stock' },
      { key: 'stock', label: 'Status', cell: (p) => stockBadge(p.stock) },
    ],
  },
  categories: {
    rows: byCategory,
    sortable: true,
    cols: [
      { key: 'category', label: 'Category' },
      { key: 'count', label: 'Products' },
      { key: 'stock', label: 'Units' },
      { key: 'value', label: 'Stock Value', cell: (c) => money(c.value) },
    ],
  },
  customers: {
    rows: () => customers,
    cols: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'orders', label: 'Orders' },
      { key: 'spent', label: 'Total Spent', cell: (c) => money(c.spent) },
    ],
  },
  inventory: {
    rows: () => inventory,
    cols: [
      { key: 'id', label: 'ID' },
      { key: 'item', label: 'Item' },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'quantity', label: 'Quantity' },
      {
        key: 'quantity',
        label: 'Status',
        cell: (i) => (i.quantity <= i.reorder ? badge('Reorder', 'red') : badge('OK', 'green')),
      },
    ],
  },
}

let sortKey = 'id'
let sortDir = 'asc'

function compare(a, b) {
  let x = a[sortKey]
  let y = b[sortKey]

  if (typeof x === 'string') {
    x = x.toLowerCase()
    y = y.toLowerCase()
  }

  if (x === y) return 0
  return (x < y ? -1 : 1) * (sortDir === 'asc' ? 1 : -1)
}

function table(view) {
  const rows = view.sortable ? [...view.rows()].sort(compare) : view.rows()

  const head = view.cols
    .map((c) => {
      if (!view.sortable) return `<th>${c.label}</th>`
      const arrow = c.key === sortKey ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''
      return `<th data-key="${c.key}">${c.label}${arrow}</th>`
    })
    .join('')

  const body = rows
    .map((row) => {
      const cells = view.cols.map((c) => `<td>${c.cell ? c.cell(row) : row[c.key]}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return `<table class="data-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

const fields = [
  { key: 'accent', label: 'Accent color', type: 'color' },
  { key: 'lowStock', label: 'Low stock threshold', type: 'number', min: 0, max: 99 },
  { key: 'density', label: 'Table density', options: ['comfortable', 'compact'] },
  { key: 'landing', label: 'Start page', options: ['dashboard', 'products', 'customers', 'inventory'] },
]

function field(f) {
  const input = f.options
    ? `<select data-setting="${f.key}">${f.options
        .map((o) => `<option ${o === settings[f.key] ? 'selected' : ''}>${o}</option>`)
        .join('')}</select>`
    : `<input type="${f.type}" data-setting="${f.key}" value="${settings[f.key]}"${
        f.min === undefined ? '' : ` min="${f.min}" max="${f.max}"`
      }>`

  return `<label class="field"><span>${f.label}</span>${input}</label>`
}

function settingsForm() {
  return `
    <div class="settings">
      ${fields.map(field).join('')}
      <p class="hint">Changes save as you make them.</p>
      <button class="btn" data-reset>Reset to defaults</button>
    </div>
  `
}

function stat(label, value) {
  return `
    <div class="card">
      <div class="card-inner"><h3>${label}</h3></div>
      <h1>${value}</h1>
    </div>
  `
}

function reportsPage() {
  const cats = byCategory()
  const dead = products.filter((p) => p.stock === 0).length

  return `
    <div class="main-cards">
      ${stat('Stock value', money(sum(cats, (c) => c.value)))}
      ${stat('Units on hand', sum(cats, (c) => c.stock))}
      ${stat('Out of stock', dead)}
      ${stat('Customer revenue', money(sum(customers, (c) => c.spent)))}
    </div>
    <div class="charts">
      <div class="charts-card">
        <div class="chart-title">Units by category</div>
        <div id="category-chart"></div>
      </div>
      <div class="charts-card">
        <div class="chart-title">Top customers by spend</div>
        <div id="spend-chart"></div>
      </div>
    </div>
  `
}

function title(text) {
  return `<div class="main-title"><h2>${text}</h2></div>`
}

function showPage(page) {
  if (page === 'dashboard') {
    main.innerHTML = dashboard
    return renderCharts()
  }
  if (page === 'settings') {
    main.innerHTML = title('settings') + settingsForm()
    return
  }
  if (page === 'reports') {
    main.innerHTML = title('reports') + reportsPage()
    return renderReports()
  }

  main.innerHTML = title(page) + table(views[page])
}

function go(page) {
  showPage(page)
  links.forEach((l) => l.parentElement.classList.toggle('active', l.dataset.page === page))
}

// Controls are rebuilt on every render, so listen on the container instead.
main.addEventListener('click', (e) => {
  if (e.target.closest('[data-reset]')) {
    localStorage.removeItem('dash:settings')
    Object.assign(settings, { accent: '#b57bff', lowStock: 10, density: 'comfortable', landing: 'dashboard' })
    applySettings()
    return go('settings')
  }

  const header = e.target.closest('th[data-key]')
  if (!header) return

  const key = header.dataset.key
  sortDir = key === sortKey && sortDir === 'asc' ? 'desc' : 'asc'
  sortKey = key
  showPage(document.querySelector('.sidebar-list-item.active a').dataset.page)
})

main.addEventListener('change', (e) => {
  const key = e.target.dataset.setting
  if (!key) return

  settings[key] = e.target.type === 'number' ? Number(e.target.value) : e.target.value
  applySettings()
})

const links = [...document.querySelectorAll('.sidebar-list-item a')]

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    go(link.dataset.page)
    closeSidebar()
  })
})

const axis = {
  axisBorder: { show: true, color: theme.rule },
  axisTicks: { show: true, color: theme.rule },
  labels: { style: { colors: theme.ink } },
}

const chartBase = {
  chart: { background: 'transparent', height: 350, toolbar: { show: false } },
  dataLabels: { enabled: false },
  grid: { borderColor: theme.rule },
  legend: { show: true, position: 'top', labels: { colors: theme.ink } },
  tooltip: { shared: true, intersect: false, theme: 'dark' },
}

function renderCharts() {
  new ApexCharts(document.querySelector('#bar-chart'), {
    ...chartBase,
    chart: { ...chartBase.chart, type: 'bar' },
    series: [{ name: 'Products', data: [10, 8, 6, 4, 2] }],
    colors: theme.ramp,
    plotOptions: { bar: { distributed: true, columnWidth: '40%' } },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { ...axis, categories: ['Laptop', 'Phone', 'Monitor', 'Headphones', 'Camera'] },
    yaxis: { ...axis, title: { text: 'Count', style: { color: theme.ink } } },
  }).render()

  new ApexCharts(document.querySelector('#area-chart'), {
    ...chartBase,
    chart: { ...chartBase.chart, type: 'area', stacked: false },
    series: [
      { name: 'Purchase Orders', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Sales Orders', data: [11, 32, 45, 32, 34, 52, 41] },
    ],
    colors: [theme.ramp[0], theme.green],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.35, opacityTo: 0.05, shadeIntensity: 1, stops: [0, 100] },
    },
    markers: { size: 5, strokeColors: theme.panel, strokeWidth: 3 },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { ...axis, labels: { ...axis.labels, offsetY: 5 } },
    yaxis: [
      { ...axis, title: { text: 'Purchase Orders', style: { color: theme.ink } } },
      { ...axis, opposite: true, title: { text: 'Sales Orders', style: { color: theme.ink } } },
    ],
  }).render()
}

function renderReports() {
  const cats = byCategory()
  const top = [...customers].sort((a, b) => b.spent - a.spent)

  new ApexCharts(document.querySelector('#category-chart'), {
    ...chartBase,
    chart: { ...chartBase.chart, type: 'donut', height: 320 },
    series: cats.map((c) => c.stock),
    labels: cats.map((c) => c.category),
    colors: theme.ramp,
    legend: { ...chartBase.legend, position: 'bottom' },
    plotOptions: { pie: { donut: { size: '72%' } } },
    stroke: { width: 1, colors: [theme.panel] },
    tooltip: { theme: 'dark' },
  }).render()

  new ApexCharts(document.querySelector('#spend-chart'), {
    ...chartBase,
    chart: { ...chartBase.chart, type: 'bar', height: 320 },
    series: [{ name: 'Spent', data: top.map((c) => c.spent) }],
    colors: theme.ramp,
    legend: { ...chartBase.legend, show: false },
    plotOptions: { bar: { distributed: true, horizontal: true, barHeight: '55%' } },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { ...axis, categories: top.map((c) => c.name) },
    yaxis: { ...axis },
  }).render()
}

applySettings()
go(settings.landing)