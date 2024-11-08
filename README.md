# Bases de Datos 14A

Proyecto de aplicación web para gestionar y calcular la distancia entre la dirección de residencia de los estudiantes y sus lugares de trabajo. Utiliza Spring Boot en el backend y un frontend nativo.

## Descripción de Archivos

### Raíz del Proyecto
- `.git/` : Directorio de configuración del control de versiones con Git.
- `backend/` : Contiene la aplicación de backend construida con Spring Boot.
- `frontend/` : Contiene la aplicación de frontend, desarrollada con HTML, CSS y JavaScript.

### Estructura del Backend (Spring Boot)

Ruta: `backend/`
- `build.gradle` : Archivo de configuración de Gradle para la gestión de dependencias y compilación.
- `settings.gradle` : Configuración del proyecto para Gradle.

#### Directorio Principal del Backend

Ruta: `backend/src/main/java/com/admondb/estudiantesregistro/`
- `config/` : Configuración general, como CORS y otras configuraciones de Spring Boot.
- `controller/` : Controladores que manejan las solicitudes HTTP para la gestión de estudiantes y direcciones.
- `dao/` : Acceso a datos (Data Access Objects) para interactuar con la base de datos.
- `dto/` : Data Transfer Objects, usados para transferir datos entre capas de la aplicación.
- `mapper/` : Mappers para transformar entidades en DTOs y viceversa.
- `model/` : Clases de modelo que representan las entidades de la base de datos, como `Estudiante` y `Direccion`.
- `service/` : Servicios que implementan la lógica de negocio, como la creación, actualización y eliminación de estudiantes y direcciones.
- `EstudiantesRegistroApplication.java` : Clase principal para ejecutar la aplicación de Spring Boot.

### Estructura del Frontend (HTML, CSS, JavaScript)

Ruta: `frontend/`
- `index.html` : Archivo HTML principal que contiene el formulario de registro de estudiantes y direcciones.
- `css/` : Contiene los archivos de estilos CSS.
  - `style.css` : Archivo de estilos para dar formato a la aplicación frontend.
- `scripts/` : Contiene los archivos JavaScript.
  - `app.js` : Archivo JavaScript principal que maneja la lógica de envío de datos desde el formulario al backend, y el uso de la API de Google Maps para obtener coordenadas de las direcciones.
- `package.json` : Configuración de npm con las dependencias necesarias para el frontend.
- `package-lock.json` : Archivo de bloqueo de versiones para las dependencias npm.
