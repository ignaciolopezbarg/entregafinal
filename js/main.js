let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS

const mostrarProductos = (productos) => {
  // Capturo el contenedor donde voy a renderizar los productos
  const contenedorProductos = document.querySelector(".product-list");
  // Limpio el contenedor por si había algo anteriormente
  contenedorProductos.innerHTML = "";
  // Recorro el array y por cada uno creo una card para mostrar en pantalla
  productos.forEach((producto) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="product-description">${producto.descripcion}</p>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
    // Agrego la card al contenedor
    contenedorProductos.appendChild(li);
    const boton = document.getElementById(`agregar-${producto.id}`);
    boton.addEventListener("click", () => {
      agregarAlCarrito(productos, producto.id);
    });
  });
};

// FUNCIÓN PARA AGREGAR EL PRODUCTO AL CARRITO

const agregarAlCarrito = (productos, id) => {
  // Si el producto no está en el carrito, lo agregamos
  if (!carrito.some((producto) => producto.id === id)) {
    const producto = productos.find((producto) => producto.id === id);
    carrito.push({ ...producto, cantidad: 1 });
  } else {
    // Si el producto está en el carrito, lo buscamos y le incrementamos las unidades
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad++;
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const mostrarCarrito = () => {
  const contenedorCarrito = document.querySelector(".carrito");
  // Limpio el contenedor por si había algo anteriormente
  contenedorCarrito.innerHTML = "";
  if (carrito.length > 0) {
    // Creo el contenedor donde colocaré los productos y lo agrego al DOM
    const productsCart = document.createElement("ul");
    productsCart.classList.add("productsCart");
    contenedorCarrito.appendChild(productsCart);
    // Creo el contenedor donde colocaré el total, lo calculo y lo agrego al DOM
    const contenedorTotal = document.createElement("p");
    actualizarTotal(contenedorTotal);
    contenedorCarrito.appendChild(contenedorTotal);
    // Recorro el array y por cada uno creo una card para mostrar en pantalla
    carrito.forEach((producto) => {
      const li = document.createElement("li");
      li.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}" />
			<div class="productContent">
				<h3>${producto.nombre}</h3>
				<p class="product-description">${producto.descripcion}</p>
				<p class="product-price">$${producto.precio}</p>
				<div class="counter">
				<button id="decrementar-${producto.id}" class="button">-</button>
				<span class="product-price">${producto.cantidad}u.</span>
				<button id="incrementar-${producto.id}" class="button">+</button>
				</div>
			</div>
			<button id="eliminar-${producto.id}" class="remove">Eliminar</button>
		`;
      // Agrego la card al contenedor
      productsCart.appendChild(li);
      const boton = document.getElementById(`eliminar-${producto.id}`);
      // Agrego evento al botón capturado.
      boton.addEventListener("click", () => {
        eliminarProducto(producto.id);
      });

      // Agrego evento al botón decrementar.
      const decrementar = document.getElementById(`decrementar-${producto.id}`);
      decrementar.addEventListener("click", () => {
        decrementarProducto(producto.id);
      });

      // Agrego evento al botón incrementar.
      const incrementar = document.getElementById(`incrementar-${producto.id}`);
      incrementar.addEventListener("click", () => {
        incrementarProducto(producto.id);
      });
    });
  } else {
    contenedorCarrito.innerHTML = '<p class="empty">No hay productos</p>';
  }
};

const decrementarProducto = (id) => {
  const producto = carrito.find((prod) => prod.id === id);
  // Si es 1, hay que eliminarlo porque no podemos tener cantidad cero
  if (producto.cantidad === 1) {
    eliminarProducto(producto.id);
  } else {
    producto.cantidad--;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Actualizamos la vista del carrito porque hemos hecho cambios
    mostrarCarrito();
  }
};

const incrementarProducto = (id) => {
  const producto = carrito.find((prod) => prod.id === id);
  producto.cantidad++;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const eliminarProducto = (id) => {
  // Genero un nuevo carrito con todos los productos menos el que hemos seleccionado
  carrito = carrito.filter((producto) => producto.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
  const total = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio * producto.cantidad,
    0
  );
  contenedor.textContent = `Total: $${total}`;
};
fetch("./js/productos.json")
	.then((response) => response.json())
	.then((productos) => {  
		mostrarProductos(productos);
		mostrarCarrito();
	});
