# 📱 studio SØMLO 

[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-blue?style=popout-square&logo=react)](https://reactnative.dev) [![Expo](https://img.shields.io/badge/Expo-52.0.46-purple?style=popout-square&logo=expo)](https://expo.dev) [![Firebase](https://img.shields.io/badge/Firebase-11.6.1-yellow?style=popout-square&logo=firebase)](https://firebase.google.com)  [![Node.js](https://img.shields.io/badge/Node.js-14.x-green?style=popout-square&logo=node.js)](https://nodejs.org) [![Xcode](https://img.shields.io/badge/Xcode-14-blue.svg?longCache=true&style=popout-square)](https://developer.apple.com/xcode) 
[![Android](https://img.shields.io/badge/Android-12-green?style=popout-square&logo=android)](https://www.android.com)  

Es una app móvil cuya finalidad es ofrecer a un público selecto mobiliario de diseño y arte funcional.

---
## 💻 Tecnologías utilizadas

- **React Native** 0.76.9 ([reactnative.dev](https://reactnative.dev/))
- **Expo** SDK 52.0.46 ([expo.dev](https://expo.dev/))
- **Firebase** 11.6.1 ([firebase.google.com](https://firebase.google.com/?hl=es-419))
- **Node.js** 14.x ([nodejs.org](https://nodejs.org))
- **Xcode** 14.3 ([developer.apple.com/xcode](https://developer.apple.com/xcode))
- **Android** API 12 ([android.com](https://www.android.com))
---

## 🪛 Requisitos previos 
Antes de comenzar, asegúrate de tener instalados en tu sistema:
- **Node.js** (v14 o superior)  
- **npm** (≥6.x)  
- **Expo CLI**  
  ```bash
  npm install --global expo-cli
  # ó usar sin instalación global:
  npx expo
  ```
Además debes tener una cuenta en **Firebase** con un proyecto creado

---

## ⚙️ Instalación
### 1️⃣ Clonar el repositorio y entra en la carpeta:
   ```bash
   git clone git@github.com:Neiza3711/studio-somlo.git
   cd studio-somlo
```
### 2️⃣ Crea un fichero de entorno a partir del ejemplo y rellena tus credenciales de Firebase:

Copia la plantilla y crea tu .env **cp .env.example .env**
   

**Rellenar tus credenciales de Firebase
Abre .env y sustituye los placeholders con los valores de tu proyecto (los encontrarás en la consola de Firebase → Configuración del proyecto → Tus apps):**

FIREBASE_API_KEY=tu_api_key  (es la clave de API)

FIREBASE_AUTH_DOMAIN=tu_auth_domain (son dominios autorizados)

FIREBASE_PROJECT_ID=tu_project_id  (es el ID de proyecto)

FIREBASE_STORAGE_BUCKET=tu_storage_bucket (es el bucket)

FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id  (es el Sender ID)

FIREBASE_APP_ID=tu_app_id  (es el ID de la aplicación)

FIREBASE_MEASUREMENT_ID=tu_measurement_id  (es el  ID de medición)

### 3️⃣ Instala dependencias

```bash
npm install
```

### 4️⃣ Inicia la app con Expo

```bash
npx expo start
```

Escanea el código QR con la app de Expo Go 

O pulsa **i** para iOS Simulator / **a** para Android Emulator

---

## 🤝 Contribuye

¡Gracias por tu interés en colaborar con Studio SØMLO!  
Sigue estos pasos:

1. Haz un **fork** de este repositorio.  
2. Crea una rama para tu feature o bugfix:  
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

