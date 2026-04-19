const form = document.getElementById("product-form");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");

// Image Processing
const processImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
    };
});

// Handling Drop
dropArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        const base64 = await processImage(file);
        preview.src = base64;
        preview.style.display = "block";
    }
});
dropArea.addEventListener("dragover", (e) => e.preventDefault());

fileInput.addEventListener("change", async () => {
    if (fileInput.files[0]) {
        preview.src = await processImage(fileInput.files[0]);
        preview.style.display = "block";
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById("name").value,
        price: Number(document.getElementById("price").value),
        description: document.getElementById("description").value,
        status: document.getElementById("status").value,
        image: preview.src || "https://via.placeholder.com/150"
    };

    try {
        const res = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        if (res.ok) {
            alert("Success!");
            window.location.href = "products.html";
        }
    } catch (err) { alert("Server error"); }
});