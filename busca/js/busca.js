import { criaCardProduto } from "/js/components/productCard.js";
import { useProducts } from "/js/services/useProducts.js";

const resultadosBusca = document.getElementById("resultadosBusca");
const gridProdutosBusca = document.getElementById("gridProdutosBusca");
const searchInput = document.querySelector('input[name="query"]');
const searchForm = document.querySelector(".inputForm");
const filterItems = document.querySelectorAll(".filtros li[data-filter]");
const orderSelect = document.getElementById("ordenarBusca");
const filterParamName = "filtro";
const orderParamName = "ordenar";

let produtosBusca = [];

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

function getSearchTerm() {
  return getUrlParams().get("query")?.trim() || "";
}

function getDefaultFilters() {
  return Array.from(filterItems)
    .filter((item) => item.classList.contains("btnPrimary"))
    .map((item) => item.dataset.filter);
}

function getActiveFilters() {
  const params = getUrlParams();
  return params.getAll(filterParamName);
}

function getOrderBy() {
  return getUrlParams().get(orderParamName) || "";
}

function updateUrlFilters(activeFilters, shouldReplace = false) {
  const url = new URL(window.location.href);

  url.searchParams.delete(filterParamName);
  activeFilters.forEach((filter) => {
    url.searchParams.append(filterParamName, filter);
  });

  const method = shouldReplace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
}

function syncFilterButtons(activeFilters) {
  filterItems.forEach((item) => {
    const isActive = activeFilters.includes(item.dataset.filter);

    item.classList.toggle("btnPrimary", isActive);
    item.classList.toggle("btnPrimaryOutline", !isActive);
  });
}

function normalizeProductText(product) {
  return [
    product.name,
    product.category,
    product.description,
    product.descricao,
    product.tags,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesText(product, terms) {
  const productText = normalizeProductText(product);

  return terms.some((term) => productText.includes(term));
}

function matchesFilter(product, filter) {
  const salesCount = Number(
    product.sales ?? product.sold ?? product.vendas ?? product.totalSold ?? 0,
  );

  const filterRules = {
    promocao: () => Number(product.discount) > 0,
    maisVendidos: () =>
      Boolean(product.bestSeller || product.maisVendido || product.maisVendidos) ||
      salesCount > 0,
    novidades: () =>
      Boolean(product.isNew || product.new || product.novidade || product.novidades) ||
      matchesText(product, ["novidade", "novo", "nova"]),
    sobremesa: () => matchesText(product, ["sobremesa", "doce", "bolo"]),
    bebidas: () => matchesText(product, ["bebida", "bebidas", "suco", "refrigerante"]),
    brasileira: () => matchesText(product, ["brasileira", "brasileiro", "brasil"]),
  };

  return filterRules[filter]?.() || false;
}

function filterProducts(products, activeFilters) {
  if (activeFilters.length === 0) {
    return products;
  }

  return products.filter((product) =>
    activeFilters.every((filter) => matchesFilter(product, filter)),
  );
}

function getFinalPrice(product) {
  return Number(product.initialPrice) - Number(product.discount || 0);
}

function sortProducts(products, orderBy) {
  const sortedProducts = [...products];

  const sortRules = {
    "maior-preco": (a, b) => getFinalPrice(b) - getFinalPrice(a),
    "menor-preco": (a, b) => getFinalPrice(a) - getFinalPrice(b),
    "maior-desconto": (a, b) => Number(b.discount || 0) - Number(a.discount || 0),
    alfabetica: (a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"),
  };

  return sortRules[orderBy] ? sortedProducts.sort(sortRules[orderBy]) : sortedProducts;
}

function renderProducts(products, searchTerm) {
  resultadosBusca.classList.remove("text-center");
  gridProdutosBusca.innerHTML = "";

  if (products.length === 0) {
      gridProdutosBusca.innerHTML = `<p class="col-12 text-center">Nenhum produto encontrado para sua busca. Tente utilizar outros termos ou limpar os filtros.</p>`;
      resultadosBusca.classList.add("justify-center");
    return;
  }

  products.forEach((produto) => {
    const cardProduto = criaCardProduto(produto);
    gridProdutosBusca.insertAdjacentHTML("beforeend", cardProduto);
  });
}

function renderFilteredProducts() {
  const activeFilters = getActiveFilters();
  const searchTerm = getSearchTerm();
  const orderBy = getOrderBy();
  const filteredProducts = filterProducts(produtosBusca, activeFilters);

  syncFilterButtons(activeFilters);
  if (orderSelect) {
    orderSelect.value = orderBy;
  }
  renderProducts(sortProducts(filteredProducts, orderBy), searchTerm);
}

function setupFilterClicks() {
  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      const activeFilters = getActiveFilters();
      const filter = item.dataset.filter;
      const nextFilters = activeFilters.includes(filter)
        ? activeFilters.filter((activeFilter) => activeFilter !== filter)
        : [...activeFilters, filter];

      updateUrlFilters(nextFilters);
      renderFilteredProducts();
    });
  });
}

function setupSearchForm() {
  if (!searchForm) return;

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = new URL(window.location.href);
    const activeFilters = getActiveFilters();
    const searchTerm = searchInput?.value.trim() || "";

    url.searchParams.set("query", searchTerm);
    url.searchParams.delete(filterParamName);
    activeFilters.forEach((filter) => url.searchParams.append(filterParamName, filter));

    if (orderSelect?.value) {
      url.searchParams.set(orderParamName, orderSelect.value);
    } else {
      url.searchParams.delete(orderParamName);
    }

    window.location.href = url;
  });
}

function setupOrderSelect() {
  if (!orderSelect) return;

  orderSelect.addEventListener("change", () => {
    const url = new URL(window.location.href);

    if (orderSelect.value) {
      url.searchParams.set(orderParamName, orderSelect.value);
    } else {
      url.searchParams.delete(orderParamName);
    }

    window.history.pushState({}, "", url);
    renderFilteredProducts();
  });
}

async function loadSearchProducts() {
  const searchTerm = getSearchTerm();
  const filtersFromUrl = getActiveFilters();
  const activeFilters = filtersFromUrl.length > 0 ? filtersFromUrl : getDefaultFilters();

  syncFilterButtons(activeFilters);
  updateUrlFilters(activeFilters, true);

  if (orderSelect) {
    orderSelect.value = getOrderBy();
  }

  if (!searchTerm) {
      gridProdutosBusca.innerHTML = `<p class="col-12 text-center">Nenhum termo de busca fornecido.</p>`;
      resultadosBusca.classList.add("justify-center");
    return;
  }

  try {
      produtosBusca = await useProducts.findProdutos(searchTerm);
      resultadosBusca.classList.remove("justify-center");
    renderFilteredProducts();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    gridProdutosBusca.innerHTML = `<p class="col-12 text-center">Ocorreu um erro ao buscar produtos. Por favor, tente novamente mais tarde.</p>`;
    resultadosBusca.classList.add("justify-center");
  }
}

setupFilterClicks();
setupSearchForm();
setupOrderSelect();
window.addEventListener("popstate", renderFilteredProducts);
loadSearchProducts();
