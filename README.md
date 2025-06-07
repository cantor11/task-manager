# 🧩 Task Manager - Monorepo

Un sistema de gestión de tareas construido con una arquitectura monorepo que integra el frontend y backend en un solo repositorio. Este proyecto permite crear, asignar y dar seguimiento a tareas, con una estructura modular y escalable.

## 🧱 Arquitectura del Proyecto

El proyecto está organizado en los siguientes módulos principales:

### 📱 Frontend (client/)
- **Componentes UI**: Interfaz de usuario modular y reutilizable
- **Páginas**: Vistas principales de la aplicación
- **Hooks**: Lógica de negocio reutilizable
- **Stores**: Gestión del estado global
- **Utilidades**: Funciones auxiliares

### 🔧 Backend (server/)
- **API Routes**: Endpoints para la gestión de tareas
- **Storage**: Capa de persistencia de datos
- **Middleware**: Autenticación y validación

### 🔄 Shared (shared/)
- **Schema**: Tipos y validaciones compartidas
- **Utils**: Utilidades comunes

## 🧰 Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca principal de UI
- **TanStack Query**: Gestión de estado del servidor
- **Tailwind CSS**: Estilos y diseño
- **TypeScript**: Tipado estático

### Backend
- **Node.js**: Runtime de JavaScript
- **Vite**: Servidor de desarrollo y bundler
- **Firebase**: Base de datos y autenticación

### Herramientas de Desarrollo
- **TypeScript**: Tipado estático
- **ESLint**: Linting de código
- **Prettier**: Formateo de código

## 🚀 Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/task-manager.git
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_dominio
FIREBASE_PROJECT_ID=tu_proyecto_id
```

### 4. Iniciar el proyecto
```bash
npm run dev
```

## 📦 Estructura del Proyecto

```
task-manager/
├── client/                # Frontend de la aplicación
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── stores/       # Estado global
│   │   └── utils/        # Utilidades
├── server/               # Backend de la aplicación
│   ├── routes.ts         # Definición de rutas
│   ├── storage.ts        # Capa de datos
│   └── index.ts         # Punto de entrada
└── shared/              # Código compartido
    └── schema.ts        # Tipos y validaciones
```

## 🎯 Funcionalidades Principales

### Gestión de Tareas
- Crear y editar tareas
- Asignar responsables
- Establecer fechas límite
- Marcar como completadas
- Filtrar y ordenar

### Autenticación
- Login con email/contraseña
- Protección de rutas
- Gestión de sesiones

### Dashboard
- Vista general de tareas
- Estadísticas y métricas
- Actividad reciente

## 🆘 Soporte

Si encuentras algún problema:
1. Verifica las variables de entorno
2. Asegúrate de tener Node.js v18 o superior
3. Limpia la caché de npm: `npm clean-cache`
4. Revisa los logs del servidor

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

