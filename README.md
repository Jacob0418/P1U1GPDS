# 🌱 Proyecto Dashboard Agrícola

Este proyecto es un **ecosistema agrícola digital** compuesto por un **frontend en React + Vite** y un **backend basado en microservicios asincrónicos y concurrentes**.  

El objetivo es proveer a los usuarios de un **dashboard en vivo** con datos de sensores emulados (temperatura, humedad, lluvia y radiación solar), gestión de parcelas y reportes históricos.

---

## 🚀 Microservicios del Backend

1. **Servicio A – Autenticación**
   - Registro/login de usuarios con JWT.
   - Roles: `admin`, `usuario`.

2. **Servicio B – Sensores emulados**
   - Genera datos dinámicos de:
     - Temperatura
     - Humedad
     - Lluvia
     - Radiación solar
   - Capaz de producir >10,000 registros/minuto.
   - Publica datos en un broker de mensajería (RabbitMQ/NATS/Kafka).

3. **Servicio C – Ingesta de datos**
   - Consume datos de sensores en streaming.
   - Deduplica y guarda en base de datos solo si hay cambios.
   - Concurrente, preparado para múltiples flujos simultáneos.

4. **Servicio D – Gestión de parcelas**
   - CRUD de parcelas (ubicación, cultivo, responsable).
   - Al eliminar, se registra en `deleted_parcels`.

---

## 🎨 Frontend: React + Vite

### Módulos principales
- **Dashboard en vivo** con datos actuales de sensores (WebSocket/HTTP).
- **Histórico con gráficas**:
  - Línea → temperatura
  - Barras → humedad
  - Pastel → distribución de cultivos
- **Mapa de parcelas vigentes** (Leaflet.js o Google Maps API).
- **Listado de parcelas eliminadas**.

---

## ▶️ Cómo iniciar el proyecto

### 1. Clonar repositorio
[git clone https://github.com/<usuario>/<repo>.git](https://github.com/RicardojCh10/P1U1GPDS.git)

### 2. Instalar dependencias

``` bash
- cd SGMP
- npm install
```

3. Levantar en modo desarrollo
```bash
npm run dev
```
La app estará disponible en:
👉 http://localhost:5173

5. Build para producción
````bash
npm run build
npm run preview
````

### 🤝 Colaboración en equipo

- **Convención de ramas**
- main → estable
- dev → integración
- feature/<nombre> → nuevas funcionalidades

---

## 📂 Arquitectura de carpetas (frontend)

```bash
/src
│── /app/                   # Configuración global
│   ├── providers/           # Providers (Auth, QueryClient, Theme)
│   ├── router/              # Configuración de rutas + guards
│   ├── store/               # Estado global (Zustand/Redux)
│   └── App.tsx
│
│── /shared/                 # Código genérico, agnóstico al dominio
│   ├── ui/                  # Componentes atómicos (Button, Card, Input)
│   ├── lib/                 # Axios, WebSocket client, etc.
│   ├── hooks/               # Custom hooks reutilizables
│   ├── utils/               # Funciones helpers (formatDate, etc.)
│   ├── types/               # Tipos globales TS
│   └── constants/           # Constantes globales
│
│── /entities/               # Entidades del dominio
│   ├── user/                # User (tipos, mappers, validadores)
│   ├── parcel/              # Parcel (interfaces, lógica mínima)
│   └── sensor/              # Sensor (modelos, validadores)
│
│── /features/               # Casos de uso específicos
│   ├── auth/                # Login, registro, refresh de sesión
│   │   ├── api/             # Servicios API
│   │   ├── model/           # Estado local / store
│   │   ├── ui/              # Componentes de UI (LoginForm, etc.)
│   │   └── index.ts
│   ├── manage-parcels/      # CRUD de parcelas
│   ├── live-sensors/        # Dashboard en vivo
│   └── historical-data/     # Gráficas históricas
│
│── /widgets/                # Composición de features en bloques de UI
│   ├── parcels-map/         # Mapa de parcelas vigentes
│   ├── deleted-parcels/     # Listado de parcelas eliminadas
│   ├── sensors-dashboard/   # Panel en vivo con sensores
│   └── charts/              # Gráficas (línea, barras, pastel)
│
│── /pages/                  # Páginas principales (ensamblan widgets/features)
│   ├── LoginPage/           # Login
│   ├── DashboardPage/       # Dashboard principal
│   └── ParcelsPage/         # CRUD de parcelas
│
│── main.tsx                 # Punto de entrada
│── vite-env.d.ts

