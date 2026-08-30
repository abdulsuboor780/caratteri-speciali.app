# Guida alla Compilazione Cloud per Caratteri Speciali (APK / AAB)
**ID Pacchetto**: `it.caratterspeciali.app`  
**Nome Applicazione**: Caratteri Speciali  
**Sito Web di Riferimento**: [caratterspeciali.it](https://caratterspeciali.it/)

Questa guida ti permette di compilare l'app in formato **APK** (per test diretti su smartphone, Samsung Galaxy Store, Huawei AppGallery) e **AAB** (per Google Play Store) **senza dover installare Android Studio sul tuo computer**. Tutto viene eseguito nei server cloud gratuiti.

---

## Metodo 1: Compilazione Automatica Gratuita con GitHub Actions (Consigliato)

Con questo metodo, ogni volta che salvi il progetto su GitHub, i server di GitHub compilano l'APK per te e te lo fanno scaricare con un click.

### Passaggi:
1. Crea un repository su GitHub (ad es. `caratteri-speciali-app`).
2. Crea la cartella `.github/workflows/` nel progetto e aggiungi il file `build-android.yml`:

```yaml
name: Build Android APK & AAB

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout del codice
        uses: actions/checkout@v5

      - name: Configura Node.js
        uses: actions/setup-node@v5
        with:
          node-version: 22

      - name: Installa dipendenze e compila Web
        run: |
          npm ci
          npm run build

      - name: Configura Java JDK
        uses: actions/setup-java@v5
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Inizializza Capacitor Android
        run: |
          npx cap add android || true
          npx cap sync android

      - name: Compila APK di Release / Debug
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Salva l'APK per il download
        uses: actions/upload-artifact@v4
        with:
          name: CaratteriSpeciali-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

3. Vai nella scheda **Actions** del tuo repository GitHub e scarica il file `app-debug.apk` pronto da installare su qualsiasi telefono Android.

---

## Metodo 2: Compilazione Cloud con EAS Build (Expo Cloud)

Se preferisci usare un terminale online (come GitHub Codespaces o Replit):

1. Esegui:
```bash
npx eas-cli build --platform android --profile preview
```
2. Il cloud di EAS compilerà l'APK e ti restituirà un link e un QR Code per scaricare l'applicazione direttamente sul tuo smartphone.

---

## Pubblicazione sugli Store Android

### 1. Google Play Store
- **Formato richiesto**: Android App Bundle (`.aab`)
- **Comando di build**: `./gradlew bundleRelease`
- **Requisiti**: Account Google Play Console ($25 una tantum), Informativa sulla Privacy (inclusa nell'app), Icone e Screenshot promozionali.

### 2. Samsung Galaxy Store
- **Formato richiesto**: APK o AAB
- **Registrazione**: Gratuita su Samsung Developer Portal.

### 3. Huawei AppGallery
- **Formato richiesto**: APK standard
- **Registrazione**: Gratuita su Huawei Developer Console. L'app non usa Google Play Services proprietari ed è quindi compatibile al 100% con tutti i dispositivi Huawei e Honor.

---

## Caratteristiche Tecniche dell'Applicazione
- **100% Offline**: Funziona senza connessione a internet.
- **Nessun Tracciamento**: Nessun dato personale o testo digitato viene salvato esternamente.
- **35+ Stili di Font Unicode**: Grassetto, corsivo, gotico, cerchiati, sottosopra, barrati, decorativi.
- **800+ Simboli & Caratteri Speciali**: Cuori, stelle, frecce, fiori, simboli giapponesi, kaomoji.
- **Supporto Modalità Scura (Dark Mode)** e personalizzazione tema.
- **Vibrazione Aptica** su dispositivi compatibili.
