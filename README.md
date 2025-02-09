# 🎬 OscarED - Plataforma de Cine y Merchandising

## 🌟 Características Principales

- **Autenticación de Usuarios**

  - Sistema de registro e inicio de sesión
  - Roles de usuario (Admin/Usuario)
  - Gestión de sesiones
  - Perfil de usuario personalizado

- **Panel de Administración**

  - Gestión de productos y películas
  - Control de usuarios
  - Estadísticas y métricas
  - Gestión de pedidos

- **Catálogo de Productos**

  - Películas y estrenos
  - Merchandising exclusivo
  - Carrito de compras
  - Sistema de pagos

- **Características Adicionales**
  - Diseño responsive
  - Animaciones fluidas
  - Modo oscuro por defecto
  - Carrito flotante
  - Notificaciones toast

## 🚀 Inicio Rápido

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/oscared.git
cd oscared
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

4. Ejecuta el seed para poblar la base de datos:

```bash
npm run seed
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run seed` - Crea el usuario administrador inicial

## 🎨 Diseño y UI

El proyecto utiliza un diseño moderno con:

- Tema oscuro por defecto
- Animaciones suaves
- Componentes interactivos
- Sistema de diseño consistente
- Interfaz adaptativa

## 📱 Responsive Design

La aplicación está optimizada para:

- Dispositivos móviles
- Tablets
- Escritorio
- Menú móvil adaptativo

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudinary Dashboard](https://cloudinary.com/console)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
