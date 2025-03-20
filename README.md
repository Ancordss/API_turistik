# API Turistik

Esta es una API que gestiona rutas turísticas, preferencias de usuario, calificaciones de lugares, y más.

## Requisitos

Antes de comenzar, asegúrate de tener los siguientes requisitos instalados en tu máquina:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (gestor de paquetes de Node.js)
- [Oracle Database](https://www.oracle.com/database/) o conexión a una base de datos compatible (según la configuración del proyecto)
- [Sequelize](https://sequelize.org/) (ORM utilizado para interactuar con la base de datos)
- [Git](https://git-scm.com/)

## Instalación

### 1. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu_usuario/API_turistik.git



### 2. Navegar a la carpeta del proyecto
Accede al directorio del proyecto:
cd API_turistik

### 3. Instalar las dependencias
Instala todas las dependencias necesarias con npm:
npm install


## 5. Crear el archivo .env

Crea un archivo .env en la raíz de tu proyecto. Puedes hacer esto con el siguiente contenido, o extraelo del zip 


# DB_HOST=localhost
# DB_PORT=1521
# DB_USER=usuario
# DB_PASSWORD=contraseña
# DB_NAME=nombre_base_de_datos


# 7. Iniciar el servidor
Inicia el servidor con el siguiente comando:
npm start






Endpoints Disponibles
Aquí están algunos de los endpoints disponibles para interactuar con la API:

GET /api/routes - Obtener todas las rutas.
POST /api/routes - Crear una nueva ruta.
GET /api/routes/:id - Obtener una ruta específica por ID.
PUT /api/routes/:id - Actualizar una ruta existente.
DELETE /api/routes/:id - Eliminar una ruta.
GET /api/places_in_routes - Obtener todos los lugares en las rutas.