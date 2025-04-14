document.addEventListener("DOMContentLoaded", function () {
     
    const shirtsContainer = document.getElementById("shirts-container");

    if (!shirts || !Array.isArray(shirts)) {
        console.error("Shirts data is not available or is not an array.");
        return;
    }

    shirts.forEach((shirt) => {
        const shirtCard = document.createElement("div");
        shirtCard.className = "shirt-card";

        const firstColor = Object.keys(shirt.colors)[0]; 
        const imageUrl = shirt.colors[firstColor].front || shirt.default.front;
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = shirt.name || "Shirt Image";
        image.onerror = function () {
            this.src = shirt.default.front; 
        };

        const name = document.createElement("h2");
        name.textContent = shirt.name || "No Name Available";

        const price = document.createElement("p");
        price.textContent = `Price: ${shirt.price || "N/A"}`;

        const description = document.createElement("p");
        description.textContent = shirt.description || "No description available.";
        description.style.fontSize = "14px";
        description.style.color = "#666";

        const seePageButton = document.createElement("button");
        seePageButton.textContent = "See Page";
        seePageButton.className = "see-page-button";
        seePageButton.disabled = true; 

        shirtCard.appendChild(image);
        shirtCard.appendChild(name);
        shirtCard.appendChild(price);
        shirtCard.appendChild(description);
        shirtCard.appendChild(seePageButton);

        shirtsContainer.appendChild(shirtCard);
    });
});