document.addEventListener("DOMContentLoaded", () => {
    let editingEntryId = null;

    console.log("JS cargado correctamente");

    const form = document.getElementById("entry-form");
    const list = document.getElementById("entries-list");

    console.log("form:", form);
    console.log("list:", list);

    // ==========================
    // Load entries from backend
    // ==========================
    async function loadEntries() {
        const response = await fetch("/api/entries");
        const entries = await response.json();

        const list = document.getElementById("entries-list");
        list.innerHTML = "";

        entries.forEach(entry => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
            <span>
                <strong>${entry.title}</strong> — ${entry.description || ""}
            </span>
            <button class="btn btn-sm btn-warning">Edit</button>
        `;

            li.querySelector("button").addEventListener("click", () => {
                document.getElementById("entry-title").value = entry.title;
                document.getElementById("entry-description").value = entry.description || "";
                editingEntryId = entry.id;
            });

            list.appendChild(li);
        });
    }


    // Cargar datos al arrancar
    loadEntries();

    // ==========================
    // Handle form submit
    // ==========================
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("entry-title").value.trim();
        const description = document.getElementById("entry-description").value.trim();

        if (!title) {
            alert("Title is required");
            return;
        }

        const method = editingEntryId ? "PUT" : "POST";
        const url = editingEntryId
            ? `/api/entries/${editingEntryId}`
            : "/api/entries";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description })
        });

        if (!response.ok) {
            alert("Error saving entry");
            return;
        }

        // Reset estado
        editingEntryId = null;
        form.reset();
        loadEntries();
    });

});
