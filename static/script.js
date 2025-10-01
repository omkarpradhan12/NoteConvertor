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
                    playNote(notes[noteObj.note], 0.3);
                };
                cell.appendChild(btn);
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

}

 const notes = {
  "A": 440.00,
  "Bb": 466.16,
  "B": 493.88,
  "C": 523.25,
  "C#": 554.37,
  "D": 587.33,
  "Eb": 622.25,
  "E": 659.25,
  "F": 698.46,
  "F#": 739.99,
  "G": 783.99,
  "Ab": 830.61
};

function playNote(frequency, duration = 1) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine"; // sine, square, triangle, sawtooth
  oscillator.frequency.value = frequency;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  // Start at 0 volume
  gainNode.gain.setValueAtTime(0, now);

  // Smooth fade-in (attack 0.05s)
  gainNode.gain.linearRampToValueAtTime(0.8, now + 0.05);

  // Hold volume
  gainNode.gain.setValueAtTime(0.8, now + duration - 0.1);

  // Smooth fade-out (release 0.1s)
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);
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
