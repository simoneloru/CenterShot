# CenterShot - Recurve Bow Tuning Tool

🏹 **[Open Live App on your Phone](https://simoneloru.github.io/CenterShot/)**

*[🌍 Scroll down for the English version](#english-version)*

---

### 🇮🇹 VERSIONE ITALIANA

**CenterShot** è una web app gratuita e open-source pensata per gli arcieri (arco olimpico / recurve bow). Aiuta a calibrare il centershot (allineamento della freccia rispetto alla corda e ai flettenti) in maniera millimetrica, abbandonando le misurazioni "ad occhio".

L'app utilizza la fotocamera posteriore dello smartphone per tracciare digitalmente le linee di ingombro della freccia in base al calibro reale, sovrapponendole al feed video in tempo reale.

## Funzionalità (Features)
- **Live Camera Overlay:** Utilizza la fotocamera del tuo dispositivo per tracciare una linea di asse centrale e un profilo della freccia.
- 📐 **Calcolo Esatto dell'Offset:** Inserisci il diametro esatto della tua freccia (es. 5.5mm o 0.216") e se sei destrorso (RH) o mancino (LH). L'app disegnerà esattamente dove dovrebbe trovarsi il bordo esterno della freccia per un setup ottimale.
- 📱 **Mobile First:** Creata come Web App, funziona direttamente dal browser del telefono (nessuna installazione richiesta) tramite *GitHub Pages*.
- **High-Contrast Interface:** UI scura e minimale studiata per essere visibile anche all'aperto sotto la luce del sole.

## Come si usa sul campo
1. Posiziona il tuo arco in verticale, fermo su un cavalletto o supporto.
2. Apri `CenterShot` sul tuo smartphone.
3. Clicca sull'icona delle impostazioni ⚙️ e inserisci sesso/mano e il diametro freccia.
4. Mettiti dietro l'arco e allinea la linea gialla dell'app con la corda in modo che tagli perfettamente a metà i due flettenti.
5. Regola il bottone (plunger) del tuo arco finché la freccia non rientra esattamente nella sagoma o bordo asse calcolati dalla linea colorata.

## Sviluppo 

Il progetto è costruito con **Vite**, **React** e **Tailwind CSS**.

### Installazione in locale
```bash
# Clona il repository
git clone https://github.com/simoneloru/CenterShot.git
cd CenterShot

# Installa le dipendenze
npm install

# Avvia il server di sviluppo (esponilo in host per testare su mobile)
npm run dev -- --host
```

---

<a name="english-version"></a>

### 🇬🇧 ENGLISH VERSION

**CenterShot** is a free, open-source web application designed for recurve bow archers. It assists in calibrating the centershot (the alignment of the arrow relative to the bowstring and limbs) with millimeter precision, eliminating "eyeball" estimation.

The app leverages your smartphone's rear camera to digitally overlay the exact arrow profile thickness, based on the actual arrow diameter, onto a real-time video feed.

## Features
- **Live Camera Overlay:** Uses your device's camera to draw a central axis line and an arrow profile.
- 📐 **Exact Offset Calculation:** Input the exact diameter of your arrow (e.g., 5.5mm or 0.216") and your handedness (Right/Left). The app will calculate and draw exactly where the outer edge of the arrow should rest for an optimal setup.
- 📱 **Mobile First:** Built as a Web App, it runs directly from your phone's browser (no installation needed) hosted on *GitHub Pages*.
- **High-Contrast Interface:** Dark and minimal UI designed to be readable outdoors under sunlight.

## How to use it on the field
1. Place your bow vertically and securely on a bow stand.
2. Open `CenterShot` on your smartphone.
3. Tap the Settings icon ⚙️ and enter your handedness and arrow diameter.
4. Stand precisely behind the bow and align the app's yellow line with the bowstring, ensuring it perfectly bisects both limbs.
5. Adjust your bow's plunger button until the arrow rests perfectly within the calculated gauge lines.

## Development

The project is built with **Vite**, **React**, and **Tailwind CSS**.

### Local Setup
```bash
# Clone the repo
git clone https://github.com/simoneloru/CenterShot.git
cd CenterShot

# Install dependencies
npm install

# Start the dev server (expose host to test on mobile)
npm run dev -- --host
```
