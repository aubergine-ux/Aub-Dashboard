// SIDEBAR TOGGLE

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}

// PAGE CONTENT

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1200, stock: 27, status: "In Stock" },
  { id: 2, name: "Phone", category: "Electronics", price: 599, stock: 5, status: "Low Stock" },
  { id: 3, name: "Monitor", category: "Electronics", price: 199, stock: 0, status: "Out of Stock" },
  { id: 4, name: "Headphones", category: "Audio", price: 99, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Camera", category: "Photography", price: 49, stock: 0, status: "Out of Stock" },
  { id: 6, name: "Keyboard", category: "Accessories", price: 120, stock: 67, status: "In Stock" },
  { id: 7, name: "Mouse", category: "Accessories", price: 35, stock: 6, status: "Low Stock" },
]

let sortKey = "id"
let sortDir = "asc"

const pages = {
  categories: `
    <div class="main-title"><h2>CATEGORIES</h2></div>
    <p style="color:#9e9ea4">Your categories go here.</p>
  `,
  customers: `
    <div class="main-title"><h2>CUSTOMERS</h2></div>
    <p style="color:#9e9ea4">Your customer list goes here.</p>
  `,
  inventory: `
    <div class="main-title"><h2>INVENTORY</h2></div>
    <p style="color:#9e9ea4">Inventory view goes here.</p>
  `,
  reports: `
    <div class="main-title"><h2>REPORTS</h2></div>
    <p style="color:#9e9ea4">Reports go here.</p>
  `,
  settings: `
    <div class="main-title"><h2>SETTINGS</h2></div>
    <p style="color:#9e9ea4">Settings go here.</p>
  `,
}

const main = document.getElementById("main")
const dashboardHTML = main.innerHTML

function showPage(page) {
  if (page === "dashboard") {
    main.innerHTML = dashboardHTML
    renderCharts()
  } else if (page === "products") {
    main.innerHTML = `
      <div class="main-title"><h2>PRODUCTS</h2></div>
      <table class="data-table">
        <thead>
          <tr>
            <th data-key="id">ID</th>
            <th data-key="name">Name</th>
            <th data-key="category">Category</th>
            <th data-key="price">Price</th>
            <th data-key="stock">Stock</th>
            <th data-key="status">Status</th>
          </tr>
        </thead>
        <tbody>${productRows()}</tbody>
      </table>
    `
  } else {
    main.innerHTML = pages[page]
  }
}

main.addEventListener("click", (e) => {
  const header = e.target.closest("th[data-key]")
  if (!header) return

  const key = header.dataset.key

  if (key === sortKey) {
    sortDir = sortDir === "asc" ? "desc" : "asc"
  } else {
    sortKey = key
    sortDir = "asc"
  }

  showPage("products")
})

function productRows() {
  const sorted = [...products].sort((a, b) => {
    let valA = a[sortKey]
    let valB = b[sortKey]

    if (typeof valA === "string") {
      valA = valA.toLowerCase()
      valB = valB.toLowerCase()
    }

    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

  return sorted.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>$${p.price}</td>
      <td>${p.stock}</td>
      <td><span class="badge ${statusClass(p.status)}">${p.status}</span></td>
    </tr>
  `).join("")
}

function statusClass(status) {
  if (status === "In Stock") return "badge-green"
  if (status === "Low Stock") return "badge-orange"
  return "badge-red"
}

function setActive(activeLink) {
  links.forEach((link) => {
    link.parentElement.classList.remove("active")
  })
  activeLink.parentElement.classList.add("active")
}

// CHARTS

function renderCharts() {

  // BAR CHART
  const barChartOptions = {
    series: [
      {
        data: [10, 8, 6, 4, 2],
        name: 'Products',
      },
    ],
    chart: {
      type: 'bar',
      background: 'transparent',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ['#892dfa', '#ff2672', '#1dbf79', '#d71b1b', '#583cb3'],
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: '#55596e',
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      labels: {
        colors: '#f5f7ff',
      },
      show: true,
      position: 'top',
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    },
    xaxis: {
      categories: ['Laptop', 'Phone', 'Monitor', 'Headphones', 'Camera'],
      title: {
        style: {
          color: '#f5f7ff',
        },
      },
      axisBorder: {
        show: true,
        color: '#55596e',
      },
      axisTicks: {
        show: true,
        color: '#55596e',
      },
      labels: {
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: '#f5f7ff',
        },
      },
      axisBorder: {
        color: '#55596e',
        show: true,
      },
      axisTicks: {
        color: '#55596e',
        show: true,
      },
      labels: {
        style: {
          colors: '#f5f7ff',
        },
      },
    },
  }

  const barChart = new ApexCharts(
    document.querySelector('#bar-chart'),
    barChartOptions
  )
  barChart.render()

  // AREA CHART
  const areaChartOptions = {
    series: [
      {
        name: 'Purchase Orders',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'Sales Orders',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      type: 'area',
      background: 'transparent',
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#2e7d32', '#d50000'],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical',
      },
      type: 'gradient',
    },
    grid: {
      borderColor: '#55596e',
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      labels: {
        colors: '#f5f7ff',
      },
      show: true,
      position: 'top',
    },
    markers: {
      size: 6,
      strokeColors: '#1b2635',
      strokeWidth: 3,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      axisBorder: {
        color: '#55596e',
        show: true,
      },
      axisTicks: {
        color: '#55596e',
        show: true,
      },
      labels: {
        offsetY: 5,
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Purchase Orders',
          style: {
            color: '#f5f7ff',
          },
        },
        labels: {
          style: {
            colors: ['#f5f7ff'],
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Sales Orders',
          style: {
            color: '#f5f7ff',
          },
        },
        labels: {
          style: {
            colors: ['#f5f7ff'],
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    },
  }

  const areaChart = new ApexCharts(
    document.querySelector('#area-chart'),
    areaChartOptions
  )
  areaChart.render()
}

// INIT

renderCharts()

const links = document.querySelectorAll(".sidebar-list-item a")

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    showPage(link.dataset.page)
    setActive(link)
    closeSidebar()
  })
})

const dashboardLink = document.querySelector('[data-page="dashboard"]')
if (dashboardLink) setActive(dashboardLink)