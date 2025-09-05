# 📑 Documentación del Sistema de Evaluación y Orientación de la Autoestima

---

## 1. Portada

**Nombre del proyecto:** Sistema de Evaluación y Orientación de la Autoestima

**Logo:** 🧠💪 (Representación visual del bienestar mental y fortaleza personal)

**Autores:** Equipo de Desarrollo de Software

**Fecha:** Diciembre 2024

---

## 2. Resumen del proyecto

### ¿Qué trata la página web?

El Sistema de Evaluación y Orientación de la Autoestima es una aplicación web desarrollada en Next.js que permite a los usuarios realizar una evaluación psicológica completa de su autoestima en cuatro dimensiones principales: personal, social, académica y física. La aplicación no solo evalúa, sino que proporciona recomendaciones personalizadas y actividades específicas para mejorar las áreas identificadas como problemáticas.

### Objetivo principal

Desarrollar una herramienta digital accesible que permita a estudiantes universitarios evaluar su nivel de autoestima de manera autónoma y recibir orientación personalizada para su desarrollo personal y académico, contribuyendo al bienestar psicológico y al rendimiento estudiantil.

### A quién está dirigido

- **Población principal:** Estudiantes universitarios de diferentes carreras y ciclos académicos
- **Usuarios secundarios:** Administradores académicos y superadministradores del sistema
- **Contexto:** Instituciones educativas que buscan implementar programas de apoyo psicológico estudiantil

---

## 3. Requisitos del sistema

### Navegadores compatibles
- **Chrome** (versión 90+)
- **Edge** (versión 90+)
- **Firefox** (versión 88+)
- **Safari** (versión 14+)

### Dependencias y frameworks

#### Frontend
- **Next.js 15.5.0** - Framework de React para aplicaciones web
- **React 19.1.1** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript 5** - Superset tipado de JavaScript
- **Tailwind CSS 3.4.1** - Framework de CSS para diseño responsivo
- **Lucide React 0.479.0** - Librería de iconos
- **Heroicons 2.2.0** - Iconos de interfaz

#### Backend y Base de datos
- **Firebase 11.3.1** - Plataforma de desarrollo de aplicaciones móviles y web
- **Firebase Auth** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Admin 13.2.0** - SDK administrativo de Firebase

#### Utilidades
- **XLSX 0.18.5** - Librería para manejo de archivos Excel
- **ESLint 9** - Linter para JavaScript/TypeScript

### Servidor y hosting
- **Plataforma:** Vercel (despliegue automático)
- **Lenguaje backend:** JavaScript/TypeScript (Node.js)
- **Base de datos:** Firestore (NoSQL)
- **Autenticación:** Firebase Authentication

---

## 4. Instrucciones de instalación

### Ejecutar el proyecto en local

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Test_autoestima
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

### Desplegar en Vercel

1. **Conectar con GitHub:**
   - Subir el código a un repositorio de GitHub
   - Conectar el repositorio con Vercel

2. **Configurar variables de entorno en Vercel:**
   - Ir a Settings > Environment Variables
   - Agregar todas las variables de Firebase

3. **Desplegar:**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El despliegue se realizará automáticamente en cada push a la rama principal

### Archivos de configuración necesarios

- `package.json` - Dependencias y scripts del proyecto
- `next.config.ts` - Configuración de Next.js
- `tailwind.config.ts` - Configuración de Tailwind CSS
- `tsconfig.json` - Configuración de TypeScript
- `firebase.json` - Configuración de Firebase
- `.env.local` - Variables de entorno (no incluido en el repositorio)

---

## 5. Manual de usuario

### Cómo acceder a la página web

1. **Acceso inicial:**
   - Navegar a la URL de la aplicación
   - Aceptar los términos y condiciones
   - Seleccionar "Iniciar sesión" o "Registrarse"

2. **Registro de usuario:**
   - Ingresar código de invitación proporcionado por un administrador
   - Completar formulario con datos personales
   - Crear cuenta con email y contraseña

3. **Inicio de sesión:**
   - Ingresar email y contraseña
   - Acceder al dashboard personal

### Funciones principales

#### Para Usuarios Estudiante

**1. Realizar Test de Autoestima**
- Acceder a la sección "Test" desde el dashboard
- Responder 30 preguntas con opciones Sí/No
- El sistema calcula automáticamente el tiempo de respuesta
- Visualizar resultados inmediatamente

**2. Ver Resultados Detallados**
- Revisar puntuación por categorías (Personal, Social, Académica, Física)
- Nivel de autoestima: Alto, Medio o Bajo
- Puntuación de veracidad del test

**3. Actividades Personalizadas**
- Recibir recomendaciones específicas basadas en respuestas
- Actividades organizadas por días (3 días de duración)
- Sistema de progreso con desbloqueo temporal
- Preguntas de retroalimentación para evaluar efectividad

**4. Perfil Psicológico**
- Visualización gráfica de resultados
- Análisis detallado por dimensiones
- Recomendaciones generales por categoría

#### Para Administradores

**1. Gestión de Usuarios**
- Ver lista completa de usuarios registrados
- Filtrar por diferentes criterios
- Exportar datos a Excel
- Eliminar usuarios (con confirmación)

**2. Crear Administradores**
- Generar códigos de invitación para nuevos administradores
- Asignar permisos de administración

**3. Estadísticas Generales**
- Visualizar datos agregados de todos los usuarios
- Análisis de tendencias por categorías

#### Para Superadministradores

**1. Gestión de Administradores**
- Ver lista de administradores
- Eliminar administradores
- Supervisar actividad del sistema

### Ejemplo de flujo de uso

**Flujo completo para un estudiante:**

1. **Registro inicial:**
   - Usuario recibe código de invitación
   - Completa registro con datos personales
   - Crea cuenta de acceso

2. **Realización del test:**
   - Accede a la sección de test
   - Responde 30 preguntas (tiempo estimado: 10-15 minutos)
   - Recibe resultados inmediatos

3. **Revisión de resultados:**
   - Ve su perfil psicológico completo
   - Identifica áreas de mejora
   - Recibe recomendaciones personalizadas

4. **Seguimiento de actividades:**
   - Realiza actividades diarias recomendadas
   - Marca progreso en el sistema
   - Responde preguntas de retroalimentación

5. **Retoma del test (opcional):**
   - Puede repetir el test después de un período
   - Comparar resultados con evaluaciones anteriores

---

## 6. Manual técnico

### Estructura de carpetas del proyecto

```
Test_autoestima/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── admin/         # Endpoints para administradores
│   │   │   ├── auth/          # Endpoints de autenticación
│   │   │   └── createAdmin/   # Creación de administradores
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboards por rol
│   │   ├── home/              # Página principal
│   │   ├── results/           # Visualización de resultados
│   │   └── test/              # Página del test
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── dashboard/         # Componentes de dashboard
│   │   ├── ResultsDisplay/    # Visualización de resultados
│   │   └── TestForm/          # Formulario del test
│   ├── constants/             # Constantes y datos estáticos
│   │   ├── questions.ts       # Preguntas del test
│   │   └── recommendations.ts # Recomendaciones y actividades
│   ├── contexts/              # Contextos de React
│   │   └── AuthContext.tsx    # Contexto de autenticación
│   ├── lib/                   # Utilidades y configuraciones
│   │   ├── firebase/          # Configuración de Firebase
│   │   └── correctAnswers.ts  # Respuestas correctas del test
│   └── types/                 # Definiciones de tipos TypeScript
│       └── userInfo.d.ts      # Tipos de usuario
├── public/                    # Archivos estáticos
├── package.json               # Dependencias del proyecto
├── next.config.ts            # Configuración de Next.js
├── tailwind.config.ts        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```
Manual técnico
### Explicación del código

#### Frontend

**Arquitectura de Componentes:**
- **App Router:** Utiliza el nuevo sistema de enrutamiento de Next.js 13+
- **Componentes funcionales:** Desarrollados con React hooks
- **TypeScript:** Tipado estático para mayor robustez
- **Tailwind CSS:** Estilos utilitarios para diseño responsivo

**Gestión de Estado:**
- **AuthContext:** Contexto global para autenticación
- **Estado local:** useState para componentes específicos
- **Persistencia:** localStorage para datos temporales

**Autenticación:**
- **Firebase Auth:** Sistema de autenticación completo
- **Roles:** Usuario, Administrador, Superadministrador
- **Protección de rutas:** Middleware personalizado

#### Backend

**API Routes (Next.js):**
- **RESTful endpoints:** Para operaciones CRUD
- **Autenticación:** Verificación de tokens JWT
- **Validación:** Middleware de validación de datos

**Base de datos (Firestore):**
- **Colecciones:**
  - `users`: Datos de usuarios y resultados
  - `admins`: Información de administradores
  - `invitationCodes`: Códigos de invitación
- **Estructura de datos:** Documentos NoSQL con subcolecciones

**Algoritmo de Evaluación:**
```typescript
// Cálculo de puntuaciones por categoría
const calculateCategoryScore = (answers: boolean[], questionIds: number[]) => {
  let correctCount = 0;
  questionIds.forEach(id => {
    if (answers[id] === correctAnswers[id]) {
      correctCount++;
    }
  });
  return (correctCount / questionIds.length) * 100;
};
```

**Sistema de Recomendaciones:**
- **Basado en respuestas:** Recomendaciones específicas por pregunta
- **Niveles:** Alto, Medio, Bajo por categoría
- **Actividades progresivas:** 3 días de duración con desbloqueo temporal

### APIs y librerías externas utilizadas

**Firebase Services:**
- **Authentication:** Gestión de usuarios y sesiones
- **Firestore:** Base de datos en tiempo real
- **Security Rules:** Reglas de seguridad para datos

**Librerías de Utilidad:**
- **XLSX:** Exportación de datos a Excel
- **Lucide React:** Iconografía consistente
- **Heroicons:** Iconos adicionales

**Herramientas de Desarrollo:**
- **ESLint:** Análisis de código
- **TypeScript:** Tipado estático
- **Tailwind CSS:** Framework de estilos

---

## 7. Pruebas y validación

### Verificación de funcionamiento

**Pruebas de Navegadores:**
- ✅ Chrome 90+ - Funcionalidad completa
- ✅ Edge 90+ - Funcionalidad completa  
- ✅ Firefox 88+ - Funcionalidad completa
- ✅ Safari 14+ - Funcionalidad completa

**Pruebas de Responsividad:**
- ✅ Desktop (1920x1080) - Layout optimizado
- ✅ Tablet (768x1024) - Adaptación correcta
- ✅ Mobile (375x667) - Diseño responsivo funcional

**Pruebas de Funcionalidad:**
- ✅ Registro de usuarios con códigos de invitación
- ✅ Autenticación y gestión de sesiones
- ✅ Realización del test de autoestima
- ✅ Cálculo correcto de puntuaciones
- ✅ Generación de recomendaciones personalizadas
- ✅ Sistema de actividades progresivas
- ✅ Exportación de datos a Excel
- ✅ Gestión de administradores

**Pruebas de Seguridad:**
- ✅ Validación de roles y permisos
- ✅ Protección de rutas sensibles
- ✅ Sanitización de datos de entrada
- ✅ Reglas de seguridad de Firestore

**Pruebas de Rendimiento:**
- ✅ Tiempo de carga < 3 segundos
- ✅ Optimización de imágenes y recursos
- ✅ Lazy loading de componentes
- ✅ Caching eficiente

### Ejemplos de pruebas realizadas

**Test de Usuario Completo:**
1. Registro con código de invitación válido
2. Completar test de 30 preguntas
3. Verificar cálculo correcto de puntuaciones
4. Revisar recomendaciones generadas
5. Realizar actividades del primer día
6. Verificar desbloqueo temporal (12 horas)
7. Exportar datos como administrador

**Test de Casos Edge:**
- Registro con código inválido
- Test interrumpido y reanudado
- Múltiples sesiones simultáneas
- Datos corruptos en base de datos

---

## 8. Conclusiones

### Qué aporta tu página web

**Para los Estudiantes:**
- **Acceso gratuito y confidencial** a evaluación psicológica profesional
- **Autoconocimiento** a través de análisis detallado de autoestima
- **Orientación personalizada** con actividades específicas y progresivas
- **Seguimiento del progreso** con sistema de retroalimentación
- **Flexibilidad temporal** para realizar actividades a su ritmo

**Para las Instituciones Educativas:**
- **Herramienta de apoyo estudiantil** integrada y escalable
- **Datos agregados** para identificar tendencias y necesidades
- **Reducción de costos** en programas de bienestar estudiantil
- **Accesibilidad 24/7** para todos los estudiantes
- **Interfaz administrativa** para supervisión y gestión

**Para la Comunidad Académica:**
- **Investigación aplicada** en psicología educativa
- **Datos anónimos** para estudios longitudinales
- **Validación de instrumentos** de evaluación psicológica
- **Contribución al bienestar estudiantil** universitario

### Posibles mejoras futuras

**Mejoras Técnicas:**
- **Aplicación móvil nativa** para iOS y Android
- **Notificaciones push** para recordatorios de actividades
- **Integración con LMS** (Moodle, Canvas, etc.)
- **API pública** para integración con otros sistemas
- **Análisis predictivo** con machine learning
- **Chatbot de apoyo** para dudas frecuentes

**Mejoras Funcionales:**
- **Más instrumentos de evaluación** (ansiedad, depresión, etc.)
- **Sistema de citas** con psicólogos presenciales
- **Comunidad de apoyo** entre estudiantes
- **Gamificación** del proceso de mejora
- **Reportes automáticos** para tutores académicos
- **Integración con servicios de salud mental**

**Mejoras de Accesibilidad:**
- **Soporte para lectores de pantalla** mejorado
- **Múltiples idiomas** (inglés, portugués, etc.)
- **Modo de alto contraste** para usuarios con discapacidad visual
- **Tamaños de fuente** ajustables
- **Navegación por teclado** completa

**Mejoras de Seguridad:**
- **Encriptación end-to-end** para datos sensibles
- **Auditoría de accesos** detallada
- **Backup automático** de datos
- **Cumplimiento GDPR** para datos europeos
- **Autenticación de dos factores** obligatoria

---

**Desarrollado con ❤️ para el bienestar estudiantil universitario**

*Esta documentación fue generada en Diciembre 2024 y refleja el estado actual del sistema.*
