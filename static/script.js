document.getElementById("fetchButton").addEventListener("click", () => {
    const tuning = document.getElementById("tuningInput").value.trim();

    if (!tuning) {
        document.getElementById("responseText").innerText = "Please enter a name.";
        return;
    }

    fetch(`/api/get_tuning?tuning=${encodeURIComponent(tuning)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("responseText").innerText = data;
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("responseText").innerText = "Error fetching data";
        });
});
