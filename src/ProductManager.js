import fs from "fs";

export class ProductManager {
    constructor(filename) {
        this.filename = filename;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filename, 'utf8');
            this.products = JSON.parse(data);
            console.log("Productos cargados desde el archivo:", this.products);
        } catch (error) {
            this.products = [];
            console.error("Error al cargar productos desde el archivo:", error);
            console.log("No se encontraron productos en el archivo. Inicializando un nuevo array de productos.");
        }
    }

    getProducts() {
        return this.products;
    }

    getAllProducts() {
        return this.products;
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const id = this.generateUniqueId();
        const product = { id, title, description, price, thumbnail, code, stock };
        this.products.push(product);
        return product;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        return product ? product : null;
    }

    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}
