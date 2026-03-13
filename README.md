# BluePrints Frontend (React + Redux + Axios + JWT)

Cliente web SPA para BluePrints desarrollado con React y Vite. Incluye manejo de estado global con Redux Toolkit, consumo de API con Axios e interceptores JWT, rutas con React Router, canvas interactivo para edición de puntos y pruebas con Vitest + Testing Library.

## Integrantes
- Anderson Fabian Garcia Nieto
- Juana Lozano Chaves

## Link de la bitacora
Link: https://docs.google.com/document/d/1_apI7ou5EtfK1jwqoqxLLkJk_ORJYWzrHaz5tRbNhTk/edit?usp=sharing 

## NOTA
Debido al docker compose, se decidió crear otro repositorio donde estuvieran los directorios de frontend y de backend para mayor facilidad de ejecución. Entonces esa es la razón del porque hay muy pocos commits de una sola persona. 
En caso de querer verlos estos son los links de cada uno:
Backend: https://github.com/juanalch/Backend_BluePrints_Java21_API_Security_JWT.git

Frontend: https://github.com/Anderfg13/Lab_P3_BluePrints_React_UI-FRONT.git

## Tabla de contenido
1. [Resumen del proyecto](#resumen-del-proyecto)
2. [Tecnologías](#tecnologías)
3. [Arquitectura frontend](#arquitectura-frontend)
4. [Árbol de directorios](#árbol-de-directorios)
5. [Configuración y variables de entorno](#configuración-y-variables-de-entorno)
6. [Ejecución local](#ejecución-local)
7. [Endpoints que consume el frontend](#endpoints-que-consume-el-frontend)
8. [Seguridad JWT en frontend](#seguridad-jwt-en-frontend)
9. [Respuestas de requerimientos del laboratorio](#respuestas-de-requerimientos-del-laboratorio)
10. [Estado de recomendaciones sugeridas](#estado-de-recomendaciones-sugeridas)
11. [Pruebas](#pruebas)
12. [Docker](#docker)
13. [Scripts](#scripts)
14. [Integrantes](#integrantes)

## Resumen del proyecto
- Búsqueda de blueprints por autor.
- Tabla de resultados con acciones `Open`, `Edit`, `Delete`.
- Visualización y edición de puntos en lienzo (`canvas`) interactivo.
- Creación de nuevos blueprints desde UI.
- Actualización y eliminación con flujo optimista en Redux.
- Login con JWT y uso de token en peticiones protegidas.
- Conmutación entre `apimock` y `apiclient` mediante `.env`.

## Repositorios por carpeta
Este workspace contiene dos carpetas principales y cada una puede manejarse como repositorio independiente:
- `backend/`: API Spring Boot (JWT + PostgreSQL).
- `frontend/`: cliente React + Redux.

Recomendación para laboratorio:
- Realiza cambios y commits por separado en cada carpeta para mantener historial claro entre backend y frontend.

## Tecnologías
- React 18
- Vite 7
- Redux Toolkit + React Redux
- React Router DOM 6
- Axios
- Bootstrap 5
- Vitest + Testing Library + jsdom
- ESLint + Prettier

## Arquitectura frontend

### Capas y responsabilidades
- `pages`: vistas principales (`BlueprintsPage`, `LoginPage`, detalle, 404).
- `components`: piezas reutilizables (canvas, form, lista, ruta privada).
- `features/blueprints`: slice Redux, thunks async y selectors memoizados.
- `services`: cliente HTTP base (`apiClient`) + implementación mock/real.
- `store`: configuración central de Redux.

### Estado global (Redux)
El estado principal vive en `blueprintsSlice`:
- `authors`, `byAuthor`, `current`, `planoActual`, `status`, `error`.
- thunks para `fetchAuthors`, `fetchByAuthor`, `fetchBlueprint`, `updateBlueprint`, `deleteBlueprint`.
- actualizaciones optimistas para `update` y `delete` con rollback en error.

## Árbol de directorios
```text
frontend/
├─ .env
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ vite.config.js
├─ vitest.config.js
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ styles.css
│  ├─ components/
│  │  ├─ BlueprintCanvas.jsx
│  │  ├─ BlueprintForm.jsx
│  │  ├─ BlueprintList.jsx
│  │  ├─ InteractiveCanvas.jsx
│  │  └─ PrivateRoute.jsx
│  ├─ features/blueprints/
│  │  ├─ blueprintsSlice.js
│  │  └─ blueprintsSelectors.js
│  ├─ pages/
│  │  ├─ BlueprintsPage.jsx
│  │  ├─ BlueprintDetailPage.jsx
│  │  ├─ LoginPage.jsx
│  │  └─ NotFound.jsx
│  ├─ services/
│  │  ├─ apiClient.js
│  │  ├─ blueprintsService.js
│  │  └─ blueprints/
│  │     ├─ apiclient.js
│  │     └─ apimock.js
│  └─ store/
│     └─ index.js
└─ tests/
   ├─ setup.js
   ├─ BlueprintCanvas.test.jsx
   ├─ BlueprintForm.test.jsx
   ├─ BlueprintsPage.test.jsx
   └─ blueprintsSlice.test.jsx
```

## Configuración y variables de entorno
Crear archivo `.env` en la raíz de `frontend`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=false
```

Notas:
- `VITE_USE_MOCK=true` usa datos en memoria (`apimock`).
- `VITE_USE_MOCK=false` usa backend real (`apiclient`).
- El login actualmente llama a `http://localhost:8080/auth/login` de forma directa.
- En este laboratorio está bien mantener `.env` en el proyecto si el docente/equipo lo permite.

## Ejecución local
Requisitos:
- Node.js 18+
- npm
- Backend de BluePrints corriendo (si `VITE_USE_MOCK=false`)

Pasos:
```bash
npm install
cp .env.example .env
# editar .env con la configuración del laboratorio
npm run dev
```

Aplicación:
- `http://localhost:5173`

### Archivo `.env` para laboratorio
Ejemplo recomendado para trabajar en clase:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=false
```

Si no quieres depender del backend temporalmente:

```env
VITE_USE_MOCK=true
```

## Endpoints que consume el frontend

Login:
- `POST /auth/login`

Blueprints (API v1):
- `GET /api/v1/blueprints`
- `GET /api/v1/blueprints/{author}`
- `GET /api/v1/blueprints/{author}/{name}`
- `POST /api/v1/blueprints`
- `PUT /api/v1/blueprints/{author}/{name}`
- `DELETE /api/v1/blueprints/{author}/{name}`
- `PUT /api/v1/blueprints/{author}/{name}/points`

## Seguridad JWT en frontend
- `apiClient.js` agrega `Authorization: Bearer <token>` con interceptor de request.
- Interceptor de response limpia token al recibir `401`.
- `LoginPage` guarda token en `localStorage`.
- `PrivateRoute` está conectado en rutas principales (`/` y `/blueprints/:author/:name`).

## Respuestas de requerimientos del laboratorio

### 1. Canvas (lienzo)
Respuesta: cumplido.
- Existe `BlueprintCanvas`.
- Se usa tamaño `520x360` por defecto.
- También existe `InteractiveCanvas` para agregar y borrar puntos con click.

### 2. Listar planos de un autor
Respuesta: cumplido.
- Entrada para autor + botón `Get blueprints`.
- Tabla con columnas: nombre, número de puntos y acciones.
- Incluye botón `Open`.

### 3. Seleccionar plano y graficarlo
Respuesta: cumplido.
- `Open` dispara consulta del blueprint (`fetchBlueprint`).
- Se muestra el blueprint actual en la sección derecha (`Current blueprint: ...`).
- El canvas dibuja segmentos y puntos.

### 4. Servicios `apimock` y `apiclient`
Respuesta: cumplido y extendido.
- Ambos implementan interfaz equivalente base (`getAll`, `getByAuthor`, `getByAuthorAndName`, `create`).
- Además incluyen `update` y `remove`.
- Conmutación resuelta en `blueprintsService.js` con `VITE_USE_MOCK`.

### 5. Interfaz con React + estado global
Respuesta: cumplido parcialmente.
- Se usa React con componentes/estado y Redux para información principal.
- `current` blueprint vive en Redux.
- Hay un estado global `planoActual` implementado, pero en la página principal se prioriza `current.name` para mostrar el plano actual.

### 6. Estilos
Respuesta: cumplido.
- Se usan estilos propios (`styles.css`) y Bootstrap.
- Tabla, botones, tarjetas y layout responsivo básico presentes.

### 7. Pruebas unitarias
Respuesta: cumplido.
- Hay pruebas para canvas, formulario, página principal y slice Redux.
- Resultado verificado: `4` archivos de prueba, `14` tests pasando.

## Estado de recomendaciones sugeridas

1. Redux avanzado: cumplido.
- `loading/error` ya existen y se muestran.
- Selector memoizado top-5 implementado en `blueprintsSelectors.js`.
- Top-5 mostrado en UI dentro de `BlueprintsPage`.

2. Rutas protegidas: cumplido.
- `PrivateRoute` implementado y aplicado en `App.jsx` para rutas de trabajo.
- Al hacer login exitoso, la app redirige al inicio protegido.

3. CRUD completo: cumplido.
- `PUT` y `DELETE` implementados en servicio, slice y UI.
- Optimistic updates implementados con rollback.

4. Dibujo interactivo: cumplido.
- Canvas interactivo con click para agregar puntos.
- Botón `Guardar` para crear y actualizar.

5. Errores y retry: cumplido.
- Banner de error + botón `Reintentar` en `BlueprintsPage`.

6. Testing: cumplido.
- Pruebas de slice y de componentes implementadas.

7. CI/Lint/Format: parcial.
- Scripts de lint/format existen.
- No se encontró workflow activo de GitHub Actions en este workspace.

8. Docker opcional: cumplido parcialmente.
- `Dockerfile` y `docker-compose.yml` existen.
- El servicio backend en compose usa imagen placeholder y puede requerir ajuste real.

## Pruebas
Comando recomendado:
```bash
npx vitest run
```

Resultado actual verificado:
- Test Files: `4 passed`
- Tests: `14 passed`

## Docker

Build y ejecución del frontend:
```bash
docker build -t blueprints-frontend .
docker run --name blueprints-frontend -p 5173:4173 blueprints-frontend
```

Compose:
```bash
docker compose up --build
```

Si deseas levantar desde la raíz del laboratorio (archivo `docker-compose.yml` del workspace):
```bash
docker compose -f ../docker-compose.yml up --build
```

Si estás en la raíz del workspace y quieres levantar el compose del frontend:
```bash
docker compose -f frontend/docker-compose.yml up --build
```

Nota:
El `docker-compose.yml` del frontend referencia una imagen de backend de ejemplo (`ghcr.io/your-org/blueprints-backend:latest`). Debes cambiarla por tu imagen real o integrar el backend local.

## Scripts
- `npm run dev` inicia Vite en desarrollo.
- `npm run build` genera build de producción.
- `npm run preview` sirve build local.
- `npm run lint` ejecuta ESLint.
- `npm run format` ejecuta Prettier.
- `npm test` ejecuta Vitest (modo interactivo).

## Referencia rápida de comandos

| Dónde estoy | Objetivo | Comando |
|---|---|---|
| Raíz del workspace (`LAB06 - P3 BLUEPRINTS/`) | Levantar stack definido en compose raíz | `docker compose -f docker-compose.yml up --build` |
| Raíz del workspace (`LAB06 - P3 BLUEPRINTS/`) | Levantar solo compose de frontend | `docker compose -f frontend/docker-compose.yml up --build` |
| Carpeta `frontend/` | Levantar compose del frontend | `docker compose up --build` |
| Carpeta `frontend/` | Correr app en modo desarrollo | `npm run dev` |
| Carpeta `frontend/` | Ejecutar pruebas | `npx vitest run` |
| Carpeta `backend/` | Ejecutar API con Maven | `mvn -q -DskipTests spring-boot:run` |

