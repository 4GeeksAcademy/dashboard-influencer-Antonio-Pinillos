const dashboardData = {
	kpis: {
		volumen: { ventas: 1248, usuarios: 82400, impresiones: 1900000 },
		ingresos: { revenue: 32640, mrr: 14280, ticketPromedio: 51.2 },
		engagementRetencion: { engagementRate: 6.3, conversiones: 3482, churn: 2.1 },
		eficienciaSatisfaccion: { costePorResultado: 1.42, nps: 52, margen: 38 }
	},
	drivers: {
		funnelVentas: {
			etapas: ["Descubrimiento", "Consideracion", "Intencion", "Compra"],
			valores: [92000, 31200, 11800, 3482]
		},
		comparativaPlataformaProducto: {
			labels: ["Instagram", "TikTok", "YouTube", "Pinterest"],
			ingresosProductoTop: [9800, 7200, 6400, 3900]
		},
		calidadContenido: {
			labels: ["CTR", "Guardados", "Watch Time", "Compartidos", "Comentarios"],
			valores: [4.9, 6.8, 5.7, 4.2, 5.1]
		}
	},
	detalles: {
		productos: [
			{ producto: "Curso Reels", ingresos: 8450, conversion: 4.8 },
			{ producto: "Plantillas", ingresos: 6320, conversion: 5.4 },
			{ producto: "Masterclass", ingresos: 5790, conversion: 3.9 }
		],
		plataformas: [
			{ canal: "Instagram", roi: 3.4, engagement: 5.8 },
			{ canal: "TikTok", roi: 2.9, engagement: 7.1 },
			{ canal: "YouTube", roi: 2.6, engagement: 4.4 }
		],
		campanas: [
			{ campana: "Launch Q3", presupuesto: 2000, conversion: 5.2, estado: "Activa" },
			{ campana: "Always On", presupuesto: 1100, conversion: 3.8, estado: "Optimizar" },
			{ campana: "Remarketing", presupuesto: 850, conversion: 6.4, estado: "Escalar" }
		],
		alertas: [
			{ tipo: "critica", texto: "Caida de conversion del 18% en campana Always On (48h)." },
			{ tipo: "media", texto: "CPC en TikTok aumento 22% respecto al promedio semanal." },
			{ tipo: "positiva", texto: "Pico de rendimiento en Remarketing: +34% de ROAS." }
		],
		oportunidades: [
			"Redirigir 15% de presupuesto de YouTube a Remarketing para maximizar ROAS.",
			"Incrementar frecuencia de piezas UGC en TikTok en horarios de mayor conversion.",
			"Lanzar bundle de productos digitales para elevar ticket promedio por sesion."
		]
	}
};

const formatCurrency = value =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(value);

const formatCompact = value =>
	new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(value);

const setText = (id, value) => {
	const element = document.getElementById(id);
	if (element) {
		element.textContent = value;
	}
};

const loadKpis = () => {
	const { volumen, ingresos, engagementRetencion, eficienciaSatisfaccion } = dashboardData.kpis;

	setText("kpi-ventas", volumen.ventas.toLocaleString("en-US"));
	setText("kpi-usuarios", volumen.usuarios.toLocaleString("en-US"));
	setText("kpi-impresiones", formatCompact(volumen.impresiones));

	setText("kpi-revenue", formatCurrency(ingresos.revenue));
	setText("kpi-mrr", formatCurrency(ingresos.mrr));
	setText("kpi-ticket", `$${ingresos.ticketPromedio.toFixed(2)}`);

	setText("kpi-engagement", `${engagementRetencion.engagementRate}%`);
	setText("kpi-conversiones", engagementRetencion.conversiones.toLocaleString("en-US"));
	setText("kpi-churn", `${engagementRetencion.churn}%`);

	setText("kpi-cpr", `$${eficienciaSatisfaccion.costePorResultado.toFixed(2)}`);
	setText("kpi-nps", eficienciaSatisfaccion.nps.toString());
	setText("kpi-margen", `${eficienciaSatisfaccion.margen}%`);
};

const buildRow = cells => `<tr>${cells.map(cell => `<td class="py-2">${cell}</td>`).join("")}</tr>`;

const loadTablesAndAlerts = () => {
	const productosBody = document.getElementById("table-productos");
	if (productosBody) {
		productosBody.innerHTML = dashboardData.detalles.productos
			.map(item => buildRow([item.producto, formatCurrency(item.ingresos), `${item.conversion}%`]))
			.join("");
	}

	const plataformasBody = document.getElementById("table-plataformas");
	if (plataformasBody) {
		plataformasBody.innerHTML = dashboardData.detalles.plataformas
			.map(item => buildRow([item.canal, `${item.roi}x`, `${item.engagement}%`]))
			.join("");
	}

	const campanasBody = document.getElementById("table-campanas");
	if (campanasBody) {
		campanasBody.innerHTML = dashboardData.detalles.campanas
			.map(item => buildRow([item.campana, formatCurrency(item.presupuesto), `${item.conversion}%`, item.estado]))
			.join("");
	}

	const alertsList = document.getElementById("alerts-list");
	if (alertsList) {
		const alertClassByType = {
			critica: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700",
			media: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700",
			positiva: "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700"
		};
		alertsList.innerHTML = dashboardData.detalles.alertas
			.map(alert => `<li class="${alertClassByType[alert.tipo]}">${alert.texto}</li>`)
			.join("");
	}

	const opportunitiesList = document.getElementById("opportunities-list");
	if (opportunitiesList) {
		opportunitiesList.innerHTML = dashboardData.detalles.oportunidades.map(item => `<li>${item}</li>`).join("");
	}
};

const getCtx = id => {
	const element = document.getElementById(id);
	return element ? element.getContext("2d") : null;
};

const renderFunnelChart = () => {
	const ctx = getCtx("chart-funnel");
	if (!ctx || typeof Chart === "undefined") return;

	new Chart(ctx, {
		type: "bar",
		data: {
			labels: dashboardData.drivers.funnelVentas.etapas,
			datasets: [
				{
					label: "Usuarios por etapa",
					data: dashboardData.drivers.funnelVentas.valores,
					backgroundColor: ["#0EA5E9", "#0284C7", "#0369A1", "#075985"],
					borderRadius: 8
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } }
		}
	});
};

const renderComparativeChart = () => {
	const ctx = getCtx("chart-plataforma-producto");
	if (!ctx || typeof Chart === "undefined") return;

	new Chart(ctx, {
		type: "line",
		data: {
			labels: dashboardData.drivers.comparativaPlataformaProducto.labels,
			datasets: [
				{
					label: "Ingresos producto top",
					data: dashboardData.drivers.comparativaPlataformaProducto.ingresosProductoTop,
					borderColor: "#0F766E",
					backgroundColor: "rgba(15, 118, 110, 0.2)",
					fill: true,
					tension: 0.35,
					pointRadius: 4
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } }
		}
	});
};

const renderQualityChart = () => {
	const ctx = getCtx("chart-calidad");
	if (!ctx || typeof Chart === "undefined") return;

	new Chart(ctx, {
		type: "radar",
		data: {
			labels: dashboardData.drivers.calidadContenido.labels,
			datasets: [
				{
					label: "Indice de calidad",
					data: dashboardData.drivers.calidadContenido.valores,
					borderColor: "#7C3AED",
					backgroundColor: "rgba(124, 58, 237, 0.2)",
					pointBackgroundColor: "#6D28D9"
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				r: {
					beginAtZero: true,
					suggestedMax: 8
				}
			}
		}
	});
};

const initCharts = () => {
	renderFunnelChart();
	renderComparativeChart();
	renderQualityChart();
};

const initSidebar = () => {
	const sidebar = document.getElementById("sidebar");
	const backdrop = document.getElementById("sidebar-backdrop");
	const toggleButton = document.getElementById("sidebar-toggle");
	const closeButton = document.getElementById("sidebar-close");

	if (!sidebar || !backdrop || !toggleButton || !closeButton) return;

	const openSidebar = () => {
		sidebar.classList.remove("-translate-x-full");
		backdrop.classList.remove("hidden");
	};

	const closeSidebar = () => {
		sidebar.classList.add("-translate-x-full");
		backdrop.classList.add("hidden");
	};

	toggleButton.addEventListener("click", openSidebar);
	closeButton.addEventListener("click", closeSidebar);
	backdrop.addEventListener("click", closeSidebar);

	window.addEventListener("resize", () => {
		if (window.innerWidth >= 1024) {
			backdrop.classList.add("hidden");
			sidebar.classList.remove("-translate-x-full");
		} else {
			sidebar.classList.add("-translate-x-full");
		}
	});
};

document.addEventListener("DOMContentLoaded", () => {
	initSidebar();
	loadKpis();
	loadTablesAndAlerts();
	initCharts();
});
