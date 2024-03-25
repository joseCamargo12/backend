import express from 'express';
import { engine as handlebars } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';


// Importa el __dirname
import __dirname from './utils.js';

// Importa las rutas de productos y carritos
import productsRouter from './routes/Products.js';
import cartsRouter from './routes/carts.js';

// Inicialización de la aplicación Express
const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars({
  extname: 'handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Rutas y configuración del servidor
const PORT = 8080;
// Configurar middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para renderizar la vista 'home'
app.get('/', (req, res) => {
    res.render('home');
     // Renderiza la vista 'home.handlebars'
  });

// Ruta para renderizar la vista 'realTimeProducts'
app.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts'); // Renderiza la vista 'realTimeProducts.handlebars'
});

// Configuración de las rutas para la API de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Creación del servidor HTTP y WebSocket
export const server = http.createServer(app);
export const io = new Server(server);

// Manejo de eventos de conexión y desconexión de WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');

  // Manejar la actualización de productos
  socket.on('productUpdated', () => {
    io.emit('productUpdate'); // Emitir un evento de actualización de productos
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Iniciar el servidor en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
