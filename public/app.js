const listEl = document.getElementById("customer-list");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refresh");
const deleteAllBtn = document.getElementById("delete-all");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("apply-search");

const setStatus = (message) => {
  statusEl.textContent = message;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("tr-TR");
};

const normalizeCustomers = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.customers)) return payload.customers;
  return [];
};

const buildQuery = () => {
  const params = new URLSearchParams();
  const search = searchInput.value.trim();
  if (search) {
    params.set("search", search);
  }
  return params.toString();
};

const fetchCustomers = async () => {
  setStatus("Yükleniyor...");
  const query = buildQuery();
  const response = await fetch(`/customers${query ? `?${query}` : ""}`);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.error || "Liste alınamadı";
    throw new Error(message);
  }
  return data;
};

const renderCustomers = (customers) => {
  listEl.innerHTML = "";
  if (!customers.length) {
    emptyEl.classList.remove("hidden");
    countEl.textContent = "0 customer";
    return;
  }
  emptyEl.classList.add("hidden");
  countEl.textContent = `${customers.length} customer`;

  customers.forEach((customer) => {
    const card = document.createElement("li");
    card.className = "card";

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = customer.id || "(no-id)";

    const detail = document.createElement("p");
    detail.textContent = `Son goruldu: ${formatDate(customer.last_seen_at)}`;

    const tags = document.createElement("div");
    tags.className = "tags";

    const projectTag = document.createElement("span");
    projectTag.className = "tag";
    projectTag.textContent = customer.project_id || "project";

    tags.appendChild(projectTag);

    info.appendChild(title);
    info.appendChild(detail);
    info.appendChild(tags);

    const actions = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "button danger";
    deleteBtn.textContent = "Sil";
    deleteBtn.addEventListener("click", async () => {
      const confirmed = window.confirm(`${customer.id} silinsin mi?`);
      if (!confirmed) return;
      deleteBtn.disabled = true;
      setStatus("Siliniyor...");
      try {
        const response = await fetch(`/customers/${encodeURIComponent(customer.id)}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
          const message = data?.message || data?.error || "Silme basarisiz";
          throw new Error(message);
        }
        card.remove();
        const remaining = listEl.querySelectorAll(".card").length;
        countEl.textContent = `${remaining} customer`;
        if (!remaining) {
          emptyEl.classList.remove("hidden");
        }
        setStatus("Silindi");
      } catch (error) {
        setStatus("Hata");
        alert(error.message);
        deleteBtn.disabled = false;
      }
    });

    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);

    listEl.appendChild(card);
  });
};

const loadCustomers = async () => {
  try {
    refreshBtn.disabled = true;
    deleteAllBtn.disabled = true;
    const data = await fetchCustomers();
    renderCustomers(normalizeCustomers(data));
    setStatus("Hazir");
  } catch (error) {
    setStatus("Hata");
    alert(error.message);
  } finally {
    refreshBtn.disabled = false;
    deleteAllBtn.disabled = false;
  }
};

const deleteAllCustomers = async () => {
  const cards = Array.from(listEl.querySelectorAll(".card"));
  if (!cards.length) return;

  const confirmed = window.confirm(
    `${cards.length} customer silinecek. Emin misin?`
  );
  if (!confirmed) return;

  deleteAllBtn.disabled = true;
  refreshBtn.disabled = true;
  setStatus("Toplu silme basladi...");

  for (const card of cards) {
    const id = card.querySelector("h3")?.textContent;
    if (!id) continue;
    try {
      const response = await fetch(`/customers/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data?.message || data?.error || "Silme basarisiz";
        throw new Error(message);
      }
      card.remove();
    } catch (error) {
      setStatus(`Hata: ${error.message}`);
      deleteAllBtn.disabled = false;
      refreshBtn.disabled = false;
      return;
    }
  }

  emptyEl.classList.remove("hidden");
  countEl.textContent = "0 customer";
  setStatus("Toplu silme tamamlandi");
  deleteAllBtn.disabled = false;
  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadCustomers);
searchBtn.addEventListener("click", loadCustomers);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadCustomers();
  }
});

deleteAllBtn.addEventListener("click", deleteAllCustomers);

loadCustomers();
