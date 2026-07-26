<div align="center">

# 🛒 Aub Dashboard

A responsive admin dashboard for sales & inventory built with vanilla JS, client-side routing, and ApexCharts.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![ApexCharts](https://img.shields.io/badge/ApexCharts-008FFB?style=for-the-badge&logo=apache-echarts&logoColor=white)

[**Live Demo**](https://aubergine-ux.github.io/responsive-sales-dashboard/)

<img src="https://github.com/user-attachments/assets/5a9533f7-978f-4edd-9ff2-02ed07f15089" width="100%" alt="Sales Dashboard screenshot"/>

</div>

## Features

- **Responsive layout** - CSS Grid dashboard that collapses to a mobile sidebar
- **Client-side routing** - sidebar links swap the main view without a page reload, with an active-link highlight
- **Live charts** - top-products bar chart and purchase/sales area chart powered by ApexCharts
- **Data-driven tables** - the Products view renders from a JS data array with colored status badges (in stock / low stock / out of stock)
- **Zero build step** - plain HTML, CSS, and JavaScript; no bundler, no dependencies to install

## Tech Stack

- HTML5 & CSS3 (Grid + custom properties)
- Vanilla JavaScript (ES6, no framework)
- [ApexCharts](https://apexcharts.com/) for data visualization
- Material Icons & Montserrat via Google Fonts

## Getting Started

No build tools required - just serve the files.

```bash
git clone https://github.com/aubergine-ux/responsive-sales-dashboard.git
cd responsive-sales-dashboard
```

Then open `index.html` directly, or run a local server:

```bash
python -m http.server 8000
# visit http://localhost:8000
```

## Project Structure

```
.
├── index.html        # Layout: header, sidebar, cards, chart containers
├── css/
│   └── styles.css    # Grid layout, responsive rules, table & badge styles
├── js/
│   └── scripts.js    # Routing, active-link state, chart rendering, product table
└── images/           # Screenshots
```

## How It Works

The sidebar links carry a `data-page` attribute. A click handler calls `showPage()`, which swaps `#main`'s content — restoring the saved dashboard markup (and re-rendering the charts) or building a view like the Products table from a data array via `.map().join("")`.

## Roadmap

- [ ] Sortable table columns
- [ ] Search bar to filter products
- [ ] Dark / light theme toggle
- [ ] Fill in Customers, Inventory & Reports views
- [ ] Connect to a live API

---

<div align="center">

If you found this useful, consider giving it a ⭐

</div>
