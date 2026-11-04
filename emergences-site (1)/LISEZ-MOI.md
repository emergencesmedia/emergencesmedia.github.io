# Site Émergences — mode d'emploi

## Mettre le site en ligne (100 % gratuit)

Tout le site est gratuit : hébergement Cloudflare Pages (bande passante illimitée), audio servi par Spotify, vidéo par YouTube, polices Google Fonts.

1. Créez un compte gratuit sur https://dash.cloudflare.com
2. **Workers & Pages → Créer → Pages → Charger des fichiers** : glissez le dossier décompressé (celui qui contient `index.html`). Le site est en ligne sur une adresse en `.pages.dev`.
3. **Ajouter un domaine** → `emergencesmedia.com`, offre **Free**. Cloudflare affiche deux serveurs de noms.
4. Chez le vendeur du domaine, remplacez les serveurs de noms actuels par ceux de Cloudflare.
5. Dans le projet Pages : **Domaines personnalisés** → ajoutez `emergencesmedia.com` puis `www.emergencesmedia.com`.
6. Attendez de quelques minutes à 24 h. Pour mettre à jour le site : **Créer un déploiement** et redéposez le dossier.

## Ajouter un article

Tout se passe dans **`js/content.js`**. Ouvrez-le avec un éditeur de texte (VS Code, TextEdit en mode texte brut, Notepad++).

1. Trouvez la liste `articles: [`.
2. Collez ce modèle juste après `articles: [` (l'article le plus récent en premier) :

```js
    {
      slug: "titre-court-sans-accents",
      themes: ["monde", "societe"],
      format: "Article",
      featured: true,
      title: "Le titre de l'article",
      chapo: "Deux phrases qui donnent envie de lire.",
      author: "Prénom Nom",
      date: "3 novembre 2026",
      read: 5,
      cover: { big: "Chiffre ou mot fort", small: "Une phrase qui l'explique" },
      photo: "",
      body: [
        { p: "Premier paragraphe." },
        { h: "Un intertitre" },
        { p: "Un autre paragraphe." },
        { quote: "Une citation forte.", by: "Nom de la personne" },
        { fact: "Un chiffre ou un repère à mettre en avant.", label: "Repère" }
      ]
    },
```

3. Enregistrez, puis redéposez le dossier dans Cloudflare Pages (Créer un déploiement).

> Important pour Google : chaque page du site existe en vrai fichier HTML (`blog/mon-article/index.html`, etc.), avec son titre, sa description et ses données structurées. Quand vous ajoutez un article dans `content.js`, il s'affiche tout de suite sur le site, mais sa page dédiée et le `sitemap.xml` ne sont créés qu'en relançant la génération (`python3 build.py`). Si vous ne savez pas le faire, envoyez-moi l'article : je régénère le dossier.

**Règles à respecter**
- `slug` : unique, en minuscules, sans accent ni espace (il devient l'adresse de l'article).
- `themes` : un ou plusieurs parmi `"monde"`, `"societe"`, `"climat"`, `"culture"`. Le premier donne la couleur.
- `featured: true` met l'article sur l'écran de télé de la page d'accueil.
- Les guillemets droits `"` encadrent chaque texte. Si votre texte contient un `"`, remplacez-le par des guillemets français « ».
- Chaque bloc se termine par une virgule, sauf le dernier d'une liste.
- `cover` : la couverture typographique de l'article, par exemple `cover: { big: "40 %", small: "des Français choisissent « la peur »" }`.
- `photo` : pour remplacer la couverture par une vraie photo, mettez son nom (voir ci-dessous).

**Ajouter une image à vous** : déposez-la dans `assets/` (en `.webp` ou `.jpg`), puis déclarez-la dans `index.html`, dans la ligne `window.EM_IMG={...}`, par exemple `"maphoto": "assets/maphoto.jpg"`. Vous pouvez ensuite écrire `img: "maphoto"` ou, dans le corps, `{ img: "maphoto", caption: "Légende" }`.

## Ajouter un épisode de podcast

Dans `js/content.js`, section `podcast`, ajoutez dans `episodes: []` du bon format :

```js
{ num: 1, title: "Titre de l'épisode", guest: "Nom de l'invité·e", date: "12 novembre 2026", duration: "34 min",
  desc: "Deux phrases sur l'épisode.",
  youtube: "dQw4w9WgXcQ",
  spotify: "https://open.spotify.com/episode/...", apple: "", deezer: "" },
```

- **Podcast vidéo** : `youtube` est l'identifiant de la vidéo, le code après `watch?v=` dans l'adresse YouTube. La vidéo se lance en grand sur la page, dans le lecteur YouTube.
- **Podcast audio** : collez le lien Spotify de l'épisode dans `spotify` (sur Spotify : ⋯ → Partager → Copier le lien de l'épisode). Le lecteur Spotify s'affiche directement dans la page : l'écoute se fait sur le site, mais c'est Spotify qui diffuse le son, donc c'est gratuit et vos écoutes sont comptées dans Spotify.
- Le lien de l'émission entière va dans `spotify` en haut du fichier (section `site`).
- Le plus récent en premier : il s'affiche en grand, les suivants passent dans la liste « Tous les épisodes ».

Renseignez aussi les liens `spotify`, `youtube` et `tiktok` en haut du fichier : ils remplacent automatiquement les mentions « bientôt ».

## À faire avant l'ouverture au public

1. **Mentions légales** : obligatoires pour un média en ligne (directeur·rice de publication, hébergeur, contact).
2. **Google Search Console** : créez la propriété `emergencesmedia.com`, collez la balise de vérification dans chaque page (repère « Google Search Console » dans le `<head>`) puis envoyez `https://emergencesmedia.com/sitemap.xml`.
   Si le domaine final n'est pas `emergencesmedia.com`, changez la ligne `SITE = ...` dans `build.py` et régénérez.
3. **Formulaire d'appel à projets** : il prépare un e-mail adressé à info.emergencesmedia@gmail.com dans la messagerie du visiteur. C'est gratuit et sans service tiers.
4. **Police de texte** : la charte prévoit Aileron, absente de Google Fonts. Le site utilise Archivo, très proche.

## Pour la suite

Quand vous publierez plusieurs articles par semaine, modifier un fichier de code deviendra pénible et risqué. Passez alors sur un outil avec interface d'écriture (Ghost, WordPress) en reprenant ce design.
