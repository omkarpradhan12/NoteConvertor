function updateFretboard(data) {
    // clear old content

    const tuningKeys = Object.keys(data.tuning);
   const table = document.getElementById("fretboard");
    table.innerHTML = ""; // Clear table

    const maxLength = Math.max(...Object.values(data.tuning).map(arr => arr.length));

    const headerRow = document.createElement("tr");
    for (let tuningKey of tuningKeys) {
        const th = document.createElement("th");
        th.textContent = tuningKey; // Name of tuning/string
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let fret = 0; fret < maxLength; fret++) {
        const row = document.createElement("tr");

        for (let tuningKey in data.tuning) {
            const noteObj = data.tuning[tuningKey][fret];
            const cell = document.createElement("td");

            if (noteObj) {
                const btn = document.createElement("button");
                btn.classList.add("fret-button");
                btn.style.backgroundColor = noteObj.note_color;
                btn.textContent = fret; // row number = fret number
                btn.value = noteObj.note;
                btn.onclick = () => {
                    const textarea = document.getElementById("selectedNotes");
                    textarea.value += btn.value + " ";
                };
                cell.appendChild(btn);
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

}

document.getElementById("fetchButton").addEventListener("click", () => {
    const tuning = document.getElementById("tuningInput").value.trim();

    if (!tuning) {
        console.log("No tuning provided");
        return;
    }

    fetch(`/api/get_tuning?tuning=${encodeURIComponent(tuning)}`)
        .then(response => response.json())
        .then(data => {
            updateFretboard(data);
            console.log("Fetched data:", data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});



document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, JS working ✅");
  fetch(`/api/get_tuning?tuning=E%20A%20D%20G%20B%20E`)
        .then(response => response.json())
        .then(data => {
            updateFretboard(data);
            console.log("Fetched data:", data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.getElementById("clearButton").addEventListener("click", () => {
    document.getElementById("selectedNotes").value = "";
});
