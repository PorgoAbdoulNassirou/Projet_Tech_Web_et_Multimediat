# Soalma : contes et légendes du Burkina Faso

Plateforme web multimédia de préservation et de transmission du patrimoine oral burkinabè.
*Soalma* signifie « conte » en mooré.

**Site en ligne : https://porgoabdoulnassirou.github.io/Projet_Tech_Web_et_Multimediat/**

Projet réalisé pour le cours « Technologies Web et Multimédia », Master 1, IBAM.

## Fonctionnalités

- **Carte interactive 2D et 3D** : le contour réel du Burkina Faso, dix récits placés sur leur lieu d'origine, filtres par type, visite guidée. La 2D (SVG) s'utilise au clavier, la 3D (Three.js) offre relief, lumière et vol de caméra.
- **Récits en tableaux illustrés** : 10 récits, 43 tableaux, chacun avec une illustration vectorielle animée (style papier découpé, parallaxe).
- **Narration interactive** : un moment de choix au milieu de chaque récit, une morale, un quiz avec explications, un glossaire des mots en langues nationales.
- **Audio** : narration par la synthèse vocale du navigateur avec surlignage du paragraphe lu, emplacements prêts pour les enregistrements en mooré, dioula, fulfulde, gulmancema, kasem et lobiri, ambiance sonore de la nuit générée en Web Audio.
- **Confort de lecture** : mode jour ou nuit, trois tailles de texte, trois vitesses de lecture.
- **Accessibilité et référencement** : HTML sémantique, navigation au clavier, contrastes AA, respect de « réduire les animations », données structurées, sitemap.
- **Hors connexion** : service worker et manifeste web.

## Structure

```
index.html          Accueil
carte.html          Carte interactive 2D / 3D
contes.html         Bibliothèque (recherche et filtres)
conte.html?id=...   Lecteur de récit
a-propos.html       Démarche, technique, accessibilité, contribution
assets/
  css/main.css      Système de design et styles
  js/data.js        Contenu des récits (textes, scènes, quiz, glossaire)
  js/scenes.js      Moteur d'illustrations SVG
  js/map.js         Carte 2D, liste, aperçu
  js/map3d.js       Carte 3D (Three.js, chargée à la demande)
  js/reader.js      Lecteur de récit
  js/narrator.js    Synthèse vocale et lecture des enregistrements
  js/ambience.js    Ambiance sonore Web Audio
  js/geo.js         Contour du pays (généré)
  vendor/three/     Three.js r170 (licence MIT)
  audio/            Enregistrements en langues nationales
tools/              Outils de développement
```

## Lancer en local

Les modules JavaScript exigent un serveur HTTP :

```
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Ajouter un enregistrement

1. Déposer le fichier MP3 (mono, 44,1 kHz, 96 à 128 kb/s) dans `assets/audio/`, par exemple `yennenga-moore.mp3`.
2. Dans `assets/js/data.js`, renseigner le champ `audio` du récit :
   ```js
   audio: { moore: 'assets/audio/yennenga-moore.mp3' },
   ```
3. La langue devient sélectionnable dans le lecteur du récit.

## Outils

- `python tools/build_map.py adm0.geojson` régénère `assets/js/geo.js` à partir du contour geoBoundaries.
- `python tools/sync_layout.py` recopie l'en-tête et le pied de page communs (`tools/partials/`) dans toutes les pages.
- `tools/scenes.html` affiche la planche de toutes les illustrations.

## Sources et licences

- Textes : licence CC BY-NC-SA 4.0.
- Contour du pays : geoBoundaries, licence ODbL.
- Three.js : licence MIT. Polices Fraunces et Manrope : licence SIL Open Font.
