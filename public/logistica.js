const API = "http://127.0.0.1:7777";
document.getElementById("apiBase").textContent = API;

const el = (id) => document.getElementById(id);

function setStatus(id, msg, type = "") {
  const node = el(id);
  node.className = "status" + (type ? " " + type : "");
  node.textContent = msg;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) {
    const msg = typeof data === "string" ? data : JSON.stringify(data);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return data;
}

function renderTabla(choferes) {
  const tbody = el("tbodyChoferes");
  tbody.innerHTML = "";
  choferes.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id_chofer ?? ""}</td>
      <td>${c.nombre ?? ""}</td>
      <td>${c.apellido ?? ""}</td>
      <td>${c.dni ?? ""}</td>
      <td>${c.licencia ?? ""}</td>
      <td>${c.edad ?? ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function cargarChoferes() {
  try {
    setStatus("statusTabla", "Cargando choferes...", "");
    const data = await apiFetch("/choferes");
    renderTabla(Array.isArray(data) ? data : []);
    setStatus("statusTabla", `OK: ${data.length} chofer(es) cargados`, "ok");
  } catch (e) {
    setStatus("statusTabla", `Error: ${e.message}`, "err");
  }
}

// IMPORTANTE: si tu backend usa /choferes/dni/:dni, esto funciona.
// Si todavía tenés /choferes/:dni, cambiá el path acá.
async function buscarPorDni(dniRaw) {
  const dni = dniRaw.trim();
  if (!dni) throw new Error("Falta DNI");

  // codifica puntos/espacios, etc.
  const dniEnc = encodeURIComponent(dni);
  return apiFetch(`/choferes/dni/${dniEnc}`);
}

// Buscar
el("btnBuscar").addEventListener("click", async () => {
  try {
    setStatus("statusBuscar", "Buscando...", "");
    const dni = el("dniBuscar").value;
    const chofer = await buscarPorDni(dni);
    setStatus("statusBuscar", JSON.stringify(chofer, null, 2), "ok");
  } catch (e) {
    setStatus("statusBuscar", `Error: ${e.message}`, "err");
  }
});

el("btnLimpiarBuscar").addEventListener("click", () => {
  el("dniBuscar").value = "";
  setStatus("statusBuscar", "Listo para buscar.", "");
});

// Crear
el("btnCrear").addEventListener("click", async () => {
  try {
    setStatus("statusCrear", "Creando...", "");
    const payload = {
      id: Number(el("id").value),
      nombre: el("nombre").value.trim(),
      apellido: el("apellido").value.trim(),
      dni: el("dni").value.trim(),
      licencia: el("licencia").value.trim(),
      edad: Number(el("edad").value),
    };

    if (!payload.id || !payload.dni || !payload.nombre || !payload.apellido) {
      throw new Error("Faltan campos: id, dni, nombre, apellido");
    }

    await apiFetch("/choferes", { method: "POST", body: JSON.stringify(payload) });
    setStatus("statusCrear", "Creado OK", "ok");
    await cargarChoferes();
  } catch (e) {
    setStatus("statusCrear", `Error: ${e.message}`, "err");
  }
});

el("btnLimpiarCrear").addEventListener("click", () => {
  ["id","dni","nombre","apellido","licencia","edad"].forEach(k => el(k).value = "");
  setStatus("statusCrear", "Listo para crear.", "");
});

// Actualizar por DNI
el("btnActualizar").addEventListener("click", async () => {
  try {
    setStatus("statusUpd", "Actualizando...", "");
    const dni = el("dniUpd").value.trim();
    if (!dni) throw new Error("Falta DNI");

    const payload = {};
    const nombre = el("nombreUpd").value.trim();
    const apellido = el("apellidoUpd").value.trim();
    const edad = el("edadUpd").value.trim();
    const licencia = el("licenciaUpd").value.trim();

    if (nombre) payload.nombre = nombre;
    if (apellido) payload.apellido = apellido;
    if (edad) payload.edad = Number(edad);
    if (licencia) payload.licencia = licencia;

    if (Object.keys(payload).length === 0) throw new Error("No hay cambios para enviar");

    await apiFetch(`/choferes/dni/${encodeURIComponent(dni)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    setStatus("statusUpd", "Actualizado OK", "ok");
    await cargarChoferes();
  } catch (e) {
    setStatus("statusUpd", `Error: ${e.message}`, "err");
  }
});

// Borrar por DNI
el("btnBorrar").addEventListener("click", async () => {
  try {
    setStatus("statusDel", "Borrando...", "warn");
    const dni = el("dniDel").value.trim();
    if (!dni) throw new Error("Falta DNI");

    await apiFetch(`/choferes/dni/${encodeURIComponent(dni)}`, { method: "DELETE" });

    setStatus("statusDel", "Borrado OK", "ok");
    await cargarChoferes();
  } catch (e) {
    setStatus("statusDel", `Error: ${e.message}`, "err");
  }
});

el("btnRefrescar").addEventListener("click", cargarChoferes);
cargarChoferes();
