const catalog = document.getElementById("catalog");

// Проходимось по масиву з data.js і додаємо HTML
products.forEach((product) => {
  catalog.innerHTML += `
    <div class="card">
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="price">${product.price} грн</div>
      <button onclick="alert('Додано в кошик: ${product.name}')">Купити</button>
    </div>
  `;
});