# OscarED - Tu Destino Cinematográfico 🎬

Una aplicación web moderna construida con Next.js que ofrece una experiencia inmersiva en el mundo del cine, incluyendo reseñas, estrenos y merchandising.

## 🚀 Características

- Catálogo de películas con información detallada
- Sección de próximos estrenos
- Sistema de calificación con estrellas
- Tienda de merchandising
- Diseño responsivo y moderno
- Integración con Firebase

## 🛠 Tecnologías Utilizadas

- Next.js 14
- React
- Firebase
- Tailwind CSS
- Framer Motion
- Lucide Icons

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase

## 🔧 Instalación

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
- `npm run seed` - Puebla la base de datos con datos de ejemplo

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee nuestras guías de contribución antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🎨 Diseño y UI

El proyecto utiliza un diseño moderno con:

- Tema oscuro
- Animaciones suaves
- Componentes interactivos
- Sistema de diseño consistente

## 📱 Responsive Design

La aplicación está optimizada para:

- Dispositivos móviles
- Tablets
- Escritorio

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Tailwind CSS](https://tailwindcss.com)
