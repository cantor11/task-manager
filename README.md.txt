# 🧩 Task Manager - Microservices Architecture

Un sistema de gestión de tareas distribuido en microservicios. Este proyecto permite crear, asignar y dar seguimiento a tareas, con servicios independientes para usuarios, autenticación, tareas y notificaciones.

---

## 🧱 Arquitectura del Proyecto

Este proyecto se divide en los siguientes microservicios:

- **Auth Service**: Gestión de usuarios y autenticación (JWT).
- **User Service**: Perfil de usuario, roles, y permisos.
- **Task Service**: CRUD de tareas, asignación y estados.
- **Notification Service**: Envío de notificaciones por email o eventos.
- **Gateway API**: Entrada centralizada a los servicios (API Gateway).
- **Service Registry (opcional)**: Registro y descubrimiento de servicios (Eureka, Consul, etc.).
- **Message Broker**: Comunicación entre servicios (RabbitMQ / Kafka).

---

## 🧰 Tecnologías Utilizadas

- Lenguaje principal: `JavaScrit`
- Frameworks: React
- Base de datos: Firebase
- Contenedores: Docker + Docker Compose + Kubernetes

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/task-manager-microservices.git

