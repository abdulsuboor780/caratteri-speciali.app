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

      - name: Configura Java JDK 21
        uses: actions/setup-java@v5
        with:
          distribution: 'zulu'
          java-version: '21'

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
- **Keystore Configurato**: `android/app/release.jks` (Firma automatica abilitata)
- **Requisiti**: Account Google Play Console ($25 una tantum), Informativa sulla Privacy (inclusa nell'app), Icone e Screenshot promozionali.

### 2. Samsung Galaxy Store
- **Formato richiesto**: APK o AAB
- **Registrazione**: Gratuita su Samsung Developer Portal.

### 3. Huawei AppGallery
- **Formati supportati**: Android App Bundle (`.aab`) oppure APK (`.apk`)
- **Firma dell'App**: AppGallery Connect supporta la gestione delle chiavi di firma. Con il **Metodo 2 (PEPK tool)** puoi caricare il pacchetto `sign.zip` generato dal tuo keystore `.jks`, garantendo la stessa identica firma crittografica del Google Play Store.
- **Compatibilità**: L'applicazione non dipende da Google Play Services ed è compatibile al 100% con tutti i dispositivi Huawei (HMS).

---

## Chiave di Firma Release (Keystore .jks) e Sicurezza

Il progetto è configurato per l'uso di una chiave di firma crittografica sicura (Keystore RSA 2048-bit, validità fino al 2054):

- **File Keystore**: `android/app/release.jks` (e copia di backup in `keystore-backup/caratteri-release-backup.jks`)
- **File Configurazione Locale**: `android/keystore.properties` (ignorato da Git via `.gitignore`)
- **Template di Esempio**: `android/keystore.properties.example`
- **Alias Chiave**: `caratteri_release`
- **Impronta Digitale SHA-1**: `75:A6:E9:1A:E5:D7:73:7D:6F:FC:2A:39:97:92:3D:DF:26:C4:4B:15`
- **Impronta Digitale SHA-256**: `69:EC:35:F8:FF:84:63:22:B9:4C:89:1B:98:42:A4:5B:33:A8:7D:E9:D3:A3:A8:D6:78:F6:62:05:DE:BE:AB:D2`

### Configurazione delle Credenziali su GitHub Secrets

Per evitare di esporre chiavi private o password nel repository GitHub, il file `.github/workflows/build-android.yml` utilizza i seguenti **GitHub Secrets** (**Settings > Secrets and variables > Actions > New repository secret**):

| Nome Secret | Descrizione |
| :--- | :--- |
| `ANDROID_KEYSTORE_BASE64` | Contenuto del keystore codificato in Base64 |
| `ANDROID_KEYSTORE_PASSWORD` | Password di accesso al file keystore |
| `ANDROID_KEY_ALIAS` | `caratteri_release` |
| `ANDROID_KEY_PASSWORD` | Password specifica della chiave release |

---

## Generazione del file `sign.zip` per Huawei AppGallery (Metodo PEPK)

Quando carichi un pacchetto `.aab` su **Huawei AppGallery Connect**:
1. Vai su **AppGallery Connect** > La tua App > **Distribuzione** > **Firma dell'app**.
2. Seleziona **Metodo 2: Esporta e carica chiave e certificato** (*Export and upload key and certificate*).
3. Scarica lo strumento `pepk.jar` fornito direttamente nella pagina di Huawei e scarica la chiave pubblica di cifratura (es. `encryption_public_key.pem`).
4. Posiziona `pepk.jar` e `encryption_public_key.pem` nella stessa cartella del file `release.jks` ed esegui il seguente comando nel terminale:

```bash
java -jar pepk.jar \
  --keystore=release.jks \
  --alias=caratteri_release \
  --keystore-pass=<TUA_KEYSTORE_PASSWORD> \
  --key-pass=<TUA_KEY_PASSWORD> \
  --output=sign.zip \
  --encryption-key-path=encryption_public_key.pem \
  --include-cert
```

5. Carica il file `sign.zip` generato nella schermata del Metodo 2 di AppGallery Connect e conferma.
6. Da questo momento in poi, puoi caricare sia l'App Bundle `.aab` sia l'APK Release firmato!

---

## Caratteristiche Tecniche dell'Applicazione
- **100% Offline**: Funziona senza connessione a internet.
- **Nessun Tracciamento**: Nessun dato personale o testo digitato viene salvato esternamente.
- **35+ Stili di Font Unicode**: Grassetto, corsivo, gotico, cerchiati, sottosopra, barrati, decorativi.
- **800+ Simboli & Caratteri Speciali**: Cuori, stelle, frecce, fiori, simboli giapponesi, kaomoji.
- **Supporto Modalità Scura (Dark Mode)** e personalizzazione tema.
- **Vibrazione Aptica** su dispositivi compatibili.
