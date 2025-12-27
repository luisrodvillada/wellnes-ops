async function loadEntries() {
    const response = await fetch("/api/entries");
    const entries = await response.json();

    const list = document.getElementById("entries-list");
    list.innerHTML = "";

    entries.forEach(entry => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${entry.title} — ${entry.description || ""}`;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadEntries);

const form = document.getElementById("entry-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("entry-title").value.trim();
    const description = document.getElementById("entry-description").value.trim();

    if (!title) {
        alert("Title is required");
        return;
    }

    try {
        const response = await fetch("/api/entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description })
        });

        if (!response.ok) {
            throw new Error("Failed to save entry");
        }

        // Limpiar formulario
        form.reset();

        // Recargar lista de entries
        loadEntries();

    } catch (error) {
        console.error(error);
        alert("Error saving entry");
    }
});
