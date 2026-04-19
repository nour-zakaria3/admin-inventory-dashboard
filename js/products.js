// STATE
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 5;

const productsBody = document.getElementById("products-body");

// LOAD PRODUCTS
async function loadProducts() {
    showLoading();
    try {
        const res = await fetch(`${API_URL}/products`);
        allProducts = await res.json();
        filteredProducts = allProducts;
        updateUI();
    } catch (error) {
        showError("Error loading products");
    } finally {
        hideLoading();
    }
}

// SEARCH + FILTER
function applyFilters() {
    const search = document.getElementById("search").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const price = document.getElementById("priceFilter").value;

    let result = [...allProducts];

    if (search) result = result.filter(p => p.name.toLowerCase().includes(search));
    if (status) result = result.filter(p => p.status === status);

    if (price === "low") result = result.filter(p => p.price <= 50);
    if (price === "medium") result = result.filter(p => p.price > 50 && p.price <= 100);
    if (price === "high") result = result.filter(p => p.price > 100);

    filteredProducts = result;
    currentPage = 1;
    updateUI();
}

function updateUI() {
    const start = (currentPage - 1) * itemsPerPage;
    const pageData = filteredProducts.slice(start, start + itemsPerPage);
    renderProducts(pageData);
    document.getElementById("page-number").textContent = currentPage;
}

function renderProducts(products) {
    productsBody.innerHTML = "";
    if (products.length === 0) {
        showEmpty("No products found");
        return;
    }
    showEmpty(""); // Clear empty message if data exists

    products.forEach(p => {
        const row = `
        <tr id="row-${p.id}">
            <td><img src="${p.image}" width="45" style="border-radius: 5px;"></td>
            <td class="name">${p.name}</td>
            <td class="desc">${p.description}</td>
            <td class="price">$${p.price}</td>
            <td><span class="status ${p.status}">${p.status === "available" ? "Available" : "Not Available"}</span></td>
            <td>
                <button onclick="startEdit('${p.id}')" class="icon-btn edit"><span class="material-symbols-outlined">edit</span></button>
                <button onclick="deleteProduct('${p.id}')" class="icon-btn delete"><span class="material-symbols-outlined">delete</span></button>
            </td>
        </tr>`;
        productsBody.innerHTML += row;
    });
}

// EDIT & SAVE
function startEdit(id) {
    const row = document.getElementById(`row-${id}`);
    const currentImg = row.querySelector("img").src;
    const name = row.querySelector(".name").textContent;
    const desc = row.querySelector(".desc").textContent;
    const price = row.querySelector(".price").textContent.replace("$", "");
    const statusVal = row.querySelector(".status").classList.contains("available") ? "available" : "not-available";

    row.innerHTML = `
        <td><input type="text" id="img-${id}" value="${currentImg}" style="width: 80px;"></td>
        <td><input type="text" id="name-${id}" value="${name}"></td>
        <td><input type="text" id="desc-${id}" value="${desc}"></td>
        <td><input type="number" id="price-${id}" value="${price}"></td>
        <td>
            <select id="status-${id}">
                <option value="available" ${statusVal === "available" ? "selected" : ""}>Available</option>
                <option value="not-available" ${statusVal === "not-available" ? "selected" : ""}>Not Available</option>
            </select>
        </td>
        <td>
            <button onclick="saveEdit('${id}')" class="icon-btn save"><span class="material-symbols-outlined" style="color:green">save</span></button>
            <button onclick="updateUI()" class="icon-btn cancel"><span class="material-symbols-outlined" style="color:red">close</span></button>
        </td>`;
}

async function saveEdit(id) {
    const updatedProduct = {
        name: document.getElementById(`name-${id}`).value,
        description: document.getElementById(`desc-${id}`).value,
        price: Number(document.getElementById(`price-${id}`).value),
        status: document.getElementById(`status-${id}`).value,
        image: document.getElementById(`img-${id}`).value
    };

    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        });
        if (res.ok) loadProducts();
    } catch (error) { alert("Update failed"); }
}

async function deleteProduct(id) {
    if (confirm("Delete this product?")) {
        await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
        loadProducts();
    }
}

// Pagination Controls
function nextPage() { if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) { currentPage++; updateUI(); } }
function prevPage() { if (currentPage > 1) { currentPage--; updateUI(); } }

document.addEventListener("DOMContentLoaded", loadProducts);
document.getElementById("search")?.addEventListener("input", applyFilters);
document.getElementById("statusFilter")?.addEventListener("change", applyFilters);
document.getElementById("priceFilter")?.addEventListener("change", applyFilters);