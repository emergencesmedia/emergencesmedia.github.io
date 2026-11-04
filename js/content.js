/* =====================================================================
   ÉMERGENCES — CONTENUS DU SITE
   ---------------------------------------------------------------------
   Tout le texte du site vit ici. Voir LISEZ-MOI.md, rubrique
   « Ajouter un article », pour un modèle à copier-coller.

   Un article peut avoir plusieurs thèmes :  themes: ["monde", "climat"]
   (le premier donne sa couleur à l'article).

   Types de blocs du corps :
     { p: "paragraphe" }
     { h: "intertitre" }
     { quote: "citation", by: "auteur" }
     { fact: "texte", label: "Repère" }
     { list: ["élément", "élément"] }
   ===================================================================== */

window.EMERGENCES = {
  site: {
    name: "Émergences",
    tagline: "Là où les idées deviennent actions.",
    baseline: "Comprendre le monde sans perdre espoir",
    pitch: "Le média numérique pensé par et pour les jeunes.",
    founded: "2026",
    rhythm: "le 15 de chaque mois",
    podcastName: "Avoir 20 ans aujourd'hui",   // nom de l'émission sur Spotify   // rythme de publication du podcast
    email: "info.emergencesmedia@gmail.com",
    instagram: "https://www.instagram.com/emergencesmedia/",
    spotify: "",   // ajoutez l'URL du podcast quand il est en ligne
    youtube: "",   // idem pour le podcast vidéo
    tiktok: ""
  },

  /* Les thèmes servent d'étiquettes sur le blog (un article peut en avoir plusieurs). */
  themes: [
    { slug: "monde", ch: "01", name: "Relations internationales", short: "Monde", color: "violet", img: "binoculars",
      desc: "Diplomatie, conflits, coopérations : comprendre les rapports de force entre États." },
    { slug: "societe", ch: "02", name: "Enjeux sociétaux", short: "Société", color: "rouge", img: "protest",
      desc: "Droits, démocratie, inégalités et nouvelles formes d'engagement." },
    { slug: "climat", ch: "03", name: "Climat & écologie", short: "Climat", color: "ciel", img: "bulb",
      desc: "Les faits sur la crise climatique, puis les solutions qui existent déjà." },
    { slug: "culture", ch: "04", name: "Culture", short: "Culture", color: "jaune", img: "camerahead",
      desc: "Les œuvres, les scènes et les formes qui racontent notre époque." }
  ],

  /* Le podcast : deux formats. Ajoutez les épisodes dans "episodes" (le plus récent en premier).
     Modèle d'épisode :
       { num: 1, title: "Titre", guest: "Nom de l'invité·e", date: "12 novembre 2026", duration: "34 min",
         desc: "Deux phrases sur l'épisode.",
         youtube: "dQw4w9WgXcQ",               // podcast vidéo : l'identifiant après watch?v=
         spotify: "https://open.spotify.com/episode/...",
         apple: "", deezer: "",                  // liens facultatifs
         img: "" }                               // facultatif : visuel de l'épisode (voir LISEZ-MOI) */
  podcast: [
    { id: "audio", ch: "01", name: "Le podcast audio", short: "Audio", color: "violet", img: "mic",
      desc: "Une conversation avec une personne qui fait bouger les choses, à écouter partout : dans le métro, en marchant, en cuisinant.",
      status: "Nouvel épisode le 15 de chaque mois", episodes: [
        { num: 1, title: "Notre République : comment la comprendre ?", guest: "Swan Riché, fondateur de La Fresque de la République",
          date: "15 octobre 2026", dateISO: "2026-10-15", duration: "18 min", img: "ep01-cover",
          desc: "Pour ce premier épisode, Émergences reçoit Swan Riché, fondateur de La Fresque de la République, un atelier qui permet de comprendre comment fonctionnent nos institutions. Au programme : la Ve République, l'engagement citoyen et notre rapport à la vie démocratique. Une conversation pour questionner notre citoyenneté.",
          spotify: "https://open.spotify.com/episode/6z4ZKEAjbwktNby0YTkeRy", apple: "", deezer: "" }
      ] },
    { id: "video", ch: "02", name: "Le podcast vidéo", short: "Vidéo", color: "corail", img: "camera",
      desc: "La conversation filmée, en entier sur YouTube et en extraits sur Instagram et TikTok.",
      status: "Bientôt sur YouTube", episodes: [] }
  ],

  team: [
    { name: "Prune Hanniet", role: "Co-fondatrice", studies: "Étudiante en relations internationales", photo: "team-prune", color: "corail" },
    { name: "Vera Chevance", role: "Co-fondatrice", studies: "Étudiante en sciences politiques et histoire", photo: "team-vera", color: "jaune" },
    { name: "Samuel Gerardin", role: "Co-fondateur", studies: "Étudiant en science des données, économie et sciences politiques", photo: "team-samuel", color: "violet" },
    { name: "Daphnée Absalon", role: "Co-fondatrice", studies: "Étudiante en communication et marketing", photo: "team-daphnee", color: "ciel" }
  ],

  articles: [
    {
      slug: "quand-la-violence-couvre-la-voix-de-la-jeunesse", themes: ["societe"], format: "Édito", featured: true,
      title: "Quand la violence couvre la voix de la jeunesse",
      chapo: "Les images de violence autour des blocages de lycées ont tourné en boucle. Derrière, il y a des revendications concrètes et légitimes. On les remet au centre, et on liste les moyens de se faire entendre sans les rendre inaudibles.",
      author: "La rédaction", date: "5 novembre 2026", dateISO: "2026-11-05", read: 5,
      cover: { big: "53 %", small: "des collèges et lycées publics manquaient d'au moins un prof à la rentrée", color: "violet", sticker: "megaphone" },
      photo: "",
      body: [
        { h: "Notre position" },
        { p: "Chez Émergences, notre mot d'ordre est l'engagement citoyen. Nous avons le droit, quand nos représentants ne nous conviennent pas ou que le système nous semble trop injuste, de nous engager de différentes façons pour faire changer les choses." },
        { p: "Quand on a l'impression que nos dirigeants ne nous écoutent plus, la violence peut sembler la seule forme d'engagement qui reste. Le problème, c'est qu'elle délégitime des revendications importantes. Elle efface le vrai changement possible." },
        { p: "Nous voulons donc, le temps d'un article, remplacer les images de violence qui ont défilé sur les réseaux et dans les médias depuis le début de la mobilisation par les revendications réelles. Elles sont tout à fait légitimes : les lycées sont très inégaux, et la méritocratie a du mal à s'appliquer selon le lycée duquel on sort." },
        { p: "D'autres voies existent pour se faire entendre, car nous sommes dans une démocratie et des canaux existent. Il est peut-être temps, avec ces événements, de repenser les canaux de communication entre les dirigeants et une jeunesse qui ne se sent plus représentée ni écoutée." },
        { h: "Les revendications, côté lycéens" },
        { list: [
          "Des professeurs remplacés : à la rentrée, il manquait au moins un professeur dans 53 % des collèges et lycées publics selon le SNES-FSU, et environ 7,5 % des heures d'enseignement ne sont pas assurées selon un rapport parlementaire.",
          "Des classes moins chargées : 30 élèves par classe en moyenne en 2025, contre 27 en 2010.",
          "Des emplois du temps allégés : 26 à 29 heures de cours obligatoires par semaine, hors options.",
          "Des bâtiments rénovés : locaux délabrés, chauffage, toilettes, cantines.",
          "Plus de personnel : infirmières, équipes de direction et de santé scolaire.",
          "La fin de la pression de Parcoursup, accusé de manquer de transparence et d'opérer une sélection.",
          "Plus d'égalité entre établissements : les lycéens des banlieues dénoncent un sentiment de relégation."
        ] },
        { h: "Les revendications, côté étudiants" },
        { list: [
          "Plus de moyens pour l'enseignement supérieur et la fin du « sous-financement structurel » des universités.",
          "Plus de personnel : chargés de TD sous-payés et manque de moyens en fac.",
          "Plus de places dans l'enseignement supérieur.",
          "La fin du gel des APL et une vraie lutte contre la précarité étudiante.",
          "Une meilleure restauration universitaire : une heure de queue au Crous, des repas à 1 € difficiles à obtenir en pratique.",
          "Des conditions d'étude dignes : amphis surchargés, chaises cassées.",
          "Le rejet de la « sélection sociale et raciste » dénoncée par l'Union étudiante."
        ] },
        { h: "Les autres moyens de se faire entendre" },
        { p: "Même le président de l'Union syndicale lycéenne, Ryad Rani, juge les violences contre le personnel éducatif « contre-productives ». Voici des moyens non violents, du plus institutionnel au plus visible." },
        { fact: "Passer par les organisations lycéennes et étudiantes (USL, Union étudiante, UNEF), qui ont un accès direct au ministère : elles ont été reçues le vendredi 2 octobre par Édouard Geffray. S'appuyer sur les élus du Conseil national de la vie lycéenne et sur les conseils de la vie lycéenne de chaque établissement. Rédiger un cahier de revendications chiffré et priorisé : des demandes concrètes sont plus difficiles à esquiver que des slogans.", label: "1. Se faire représenter et négocier" },
        { fact: "Organiser des manifestations déclarées et encadrées, avec des enseignants et des parents aux côtés des élèves, comme à Sevran et à Saint-Denis, où leur présence a apaisé les tensions. Rejoindre les journées de grève et de manifestation appelées par les syndicats, comme celle du 6 octobre portée par la FSU, la CGT, Solidaires et SUD. Tenir des assemblées générales pour voter les actions et désigner des porte-parole.", label: "2. Mobiliser pacifiquement" },
        { fact: "Publier des témoignages et des vidéos qui montrent la réalité du quotidien : classes surchargées, bâtiments dégradés, professeurs absents. Écrire des tribunes, répondre aux médias et rencontrer les élus locaux, comme à Nice et à Bordeaux, où les rectorats ont reçu des représentants lycéens.", label: "3. Parler dans l'espace public" },
        { p: "La colère de la jeunesse est légitime, et ses demandes sont concrètes. C'est précisément pour qu'elles soient entendues qu'elles doivent rester visibles. Et la violence les rend inaudibles." },
        { sources: [
          "Le Monde, « En direct : blocages de lycées, après leur rencontre avec Édouard Geffray, les organisations lycéennes et étudiantes appellent à poursuivre la mobilisation », 2 octobre 2026"
        ] }
      ]
    },
    {
      slug: "lettre-a-l-engagement", themes: ["societe"], format: "Tribune", featured: true,
      title: "Lettre à l'engagement",
      chapo: "À vingt ans, on sort de sa bulle et on choisit son rapport au monde. Une lettre à celles et ceux qui hésitent encore à traverser le pont entre ce qu'ils pensent et ce qu'ils font.",
      author: "La rédaction", date: "5 novembre 2026", dateISO: "2026-11-05", read: 4,
      cover: { big: "20 ans", small: "l'âge de choisir son rapport au monde", color: "jaune", sticker: "woman" },
      photo: "",
      body: [
        { p: "À l'âge où on découvre réellement le monde, nos 20 ans, il est important de penser, ou du moins de repenser, notre rapport à celui-ci." },
        { p: "La vingtaine est un moment clef où nous sommes presque forcés de sortir de cette bulle dans laquelle on a grandi jusqu'à maintenant et de se lancer à la recherche du monde et de soi. C'est une période où ce qui nous touchait enfant ne nous touche plus forcément, alors que d'autres sensibilités, déjà présentes dans l'enfance, se renforcent. C'est cet esprit vif mais plus mûr, plus réfléchi, qui doit choisir le monde dans lequel il veut évoluer et quel rapport il veut entretenir avec lui." },
        { p: "À notre âge, la politique peut sembler lointaine : une affaire de grandes lignes et de polémiques qui nous touchent peu. Pourtant, elle est d'abord une question de priorités. Que voulons-nous conserver, créer ou modifier ? De quoi avons-nous peur, et lesquelles de ces peurs nous a-t-on transmises plutôt que de les avoir choisies ? Lesquelles pouvons-nous affronter ensemble, en tant que société ? Quel sentiment voulons-nous éprouver lorsque nous pensons au monde, et à notre propre place dans celui-ci ?" },
        { p: "Ces questions, chacun doit d'abord se les poser seul, en prenant du recul sur ce que son éducation et ses croyances lui ont appris : que voulons-nous, en tant qu'ensemble, que communauté ? Quand on s'est vraiment posé ces questions, on repère vite les discours qui s'arrêtent à la surface, ceux qui offrent des réponses toutes faites à ce qu'on n'a pas encore creusé. Notre propre réflexion n'a de sens que si elle débouche sur l'action. L'action est le pont entre le monde tel qu'il est et celui qu'on veut voir en place." },
        { quote: "L'action est le pont entre le monde tel qu'il est et celui qu'on veut voir en place." },
        { p: "Or ce pont, beaucoup d'entre nous hésitent à le traverser. On sent, dans notre génération, un repli sur la sphère privée : quand, dans le monde autour, tout paraît incertain, on se concentre sur ce qu'on peut maîtriser, ses proches, ses études, son avenir immédiat. Mais que nous nous en occupions ou non, l'espace public décide de ce dans quoi nous vivons : le prix des loyers, l'état de la planète, l'accès aux soins, la valeur de nos diplômes. Ces choix seront faits, avec nous ou sans nous. Donc autant être là quand ils se prennent." },
        { p: "Et nous avons de quoi peser. Notre génération grandit exposée, chaque jour, aux problèmes du monde : elle les voit, elle les ressent, et elle sait déjà ce qu'elle voudrait changer. Il lui manque moins d'idées que d'occasions de les faire entendre. Il ne s'agit pas de tout bousculer du jour au lendemain, mais de s'investir, chacun à sa façon : voter, s'associer, se présenter, agir près de chez soi." },
        { p: "Alors, si on dézoome, qu'on sort de cette explication trop longue pour un principe trop simple : il faut que nous tous, jeunes de ce monde, animés de principes et de valeurs propres, nous engagions sans peur de la différence des opinions, qui enrichit la réflexion, et décidions ensemble ce que nous voulons pour notre monde." }
      ]
    },
    {
      slug: "qui-a-interet-a-ce-qu-on-ait-peur", themes: ["societe"], format: "Article", featured: true,
      title: "Qui a intérêt à ce qu'on ait peur ?",
      chapo: "40 % des Français disent que la peur est l'émotion qui décrit le mieux leur état d'esprit. Comprendre pourquoi on a peur ne suffit pas : il faut se demander à qui cette peur profite, et si l'on peut faire de l'information autrement.",
      author: "La rédaction", date: "", read: 6,
      cover: { big: "40 %", small: "des Français choisissent « la peur » pour décrire leur état d'esprit", color: "rouge", sticker: "mouth" },
      photo: "",   // nom d'une image du dossier assets/ pour remplacer la couverture
      body: [
        { p: "Interrogés sur l'émotion qui décrit le mieux leur état d'esprit aujourd'hui, 40 % des Français répondent spontanément : « la peur »*. Devant la sérénité (34 %), devant l'espoir (21 %). Peur du climat, peur du déclassement, peur de l'autre, peur de l'IA, peur pour l'avenir de nos enfants. La peur n'a jamais occupé une place aussi centrale dans nos sociétés et à 20 ans, on est aux premières loges de ces peurs*." },
        { p: "C'est précisément ce qu'Émergences veut interroger : pas seulement comprendre pourquoi on a peur, mais comprendre qui a intérêt à ce qu'on ait peur et si on ne peut pas, à notre échelle, faire de l'information autrement." },
        { quote: "If it bleeds, it leads. Si ça saigne, ça fait la une.", by: "Adage journalistique" },
        { p: "Ce qui frappe, ce n'est pas seulement que l'on ait peur, mais de quoi. Effondrement climatique, alliances internationales qui se fissurent, IA qui recompose le rapport de l'homme au monde : ce sont des menaces globales et diffuses qu'on ne sait pas localiser. Impossible de pointer un danger précis et de s'en protéger, comme on le ferait face à un animal ou un incendie. Cette peur-là ne se referme jamais tout à fait. Elle s'installe." },
        { fact: "Entre 45 % et 69 % des personnes n'ont vécu, ni personnellement ni via un proche, aucun événement traumatique concret. La peur, en grande partie, n'est donc pas vécue. Elle est construite*.", label: "Fait troublant" },
        { h: "Qui a intérêt à ce qu'on ait peur ? Et pourquoi c'est plus rentable que de rassurer" },
        { p: "C'est le cœur du problème qu'on veut mettre sur la table. Trois acteurs entretiennent, plus ou moins consciemment, ce climat anxiogène. Les médias d'abord, pour qui la peur est un carburant d'audience. Les responsables politiques ensuite : 78 % des Français estiment qu'ils jouent sciemment sur les peurs collectives. Et la culture populaire enfin, avec ses dystopies écologiques et ses séries d'effondrement, qui ne semblent plus si lointaines qu'au début des années 2000." },
        { p: "George Gerbner avait théorisé ce mécanisme dès les années 1960 : plus on est exposé à des contenus saturés de danger, plus on finit par croire que le monde réel ressemble à ce qu'on voit à l'écran. Il appelait ça le « syndrome du grand méchant monde » : les gros consommateurs d'images anxiogènes surestiment massivement leur risque personnel d'agression, perçoivent les autres comme moins dignes de confiance, et vivent avec un fond de pessimisme permanent. Pas parce que le monde est devenu plus dangereux, mais parce que le système médiatique, en concurrence pour capter notre attention, a un intérêt économique direct à déformer notre perception du monde." },
        { p: "C'est exactement le cercle qu'Émergences refuse de reproduire : celui où l'on choisit un sujet, un angle, un titre, parce qu'ils font peur et donc parce qu'ils « marchent » plutôt que parce qu'ils informent vraiment." },
        { h: "Quand la peur devient de la haine" },
        { p: "Le vrai danger n'est pas la peur en elle-même, mais ce qu'elle produit collectivement. À petite dose, elle mobilise et pousse à s'informer, à participer. À forte dose, couplée à la colère et à un bouc émissaire désigné, elle devient un moteur de radicalité : 43 % des Français qui ressentent à la fois peur et colère trouvent normal de recourir à la violence pour défendre une cause." },
        { p: "Le politiste Shanto Iyengar parle de « polarisation affective » : ce n'est plus le désaccord d'idées qui structure le débat, mais l'affection pour son propre camp et l'hostilité envers l'autre. 67 % des Français qui ont peur préfèrent s'entourer de gens qui partagent leurs opinions et donc leurs peurs. Un cercle qui se referme sur lui-même, et qui rend le compromis démocratique de plus en plus difficile." },
        { p: "Rien de tout cela n'est une fatalité. Sébastien Bohler, neuroscientifique, propose une piste très concrète : une véritable « diète médiatique » : 15 à 20 minutes d'information par jour, en évitant les chaînes en continu qui répètent la même actualité anxiogène en boucle, sans rien y ajouter." },
        { p: "Mais la réponse individuelle ne suffit pas, il faut aussi des médias qui fassent un autre choix éditorial." },
        { p: "C'est le pari, plus exigeant, que porte Émergences : ne pas céder à la logique du clic anxiogène, prendre le temps d'expliquer plutôt que d'alarmer, choisir des sujets et des angles pour ce qu'ils apportent à la compréhension du monde plutôt que pour leur capacité à faire peur. C'est un choix moins rentable, à court terme, qu'un titre qui joue sur l'urgence ou le danger." },
        { p: "Mais c'est celui qui, à long terme, laisse une place à l'action plutôt qu'à la sidération et c'est précisément ce qui, selon Laborit, protège d'une peur qui rend malade : ne pas laisser les gens seuls, sans prise, face à ce qu'ils regardent." },
        { p: "Ce qui protège biologiquement du stress chronique, historiquement, c'est le lien : le groupe, la communauté, la solidarité, tout ce que l'individualisation croissante de nos sociétés, depuis les années 80, a fragilisé. Recréer des rituels collectifs, restaurer des corps intermédiaires, réguler les logiques d'audience des médias et responsabiliser les responsables politiques : ce sont là des pistes systémiques, pas seulement personnelles. Face à des peurs qui nous isolent, c'est peut-être notre génération qui peut recréer ce lien collectif qui nous entoure et nous soude. C'est ce qu'Émergences veut incarner non pas seulement comme média, mais comme communauté." },
        { p: "Antoine Bristielle le résume bien : il ne s'agit pas de supprimer la peur ; elle fait partie de nous ; elle nous a permis de survivre. Il s'agit de la reconnecter à des voies d'action crédibles, à des horizons communs." },
        { p: "C'est très exactement l'ambition d'Émergences : ne pas ajouter une voix de plus au bruit anxiogène, mais ouvrir un espace où notre génération peut comprendre le monde sans y perdre le sommeil et surtout, sans perdre l'envie d'agir dessus." },
        { note: "* Antoine Bristielle, Les entrepreneurs de la peur. Quand les émotions nous gouvernent, JC Lattès, février 2026." },
        { sources: [
          "Les entrepreneurs de la peur – JC Lattès",
          "Rencontre avec Antoine Bristielle – Librairie Kléber",
          "Interview d'Antoine Bristielle – La Libre, 26 février 2026",
          "Fractures françaises 2025 – Sciences Po Cevipof",
          "Le Monde, « La peur, une émotion délétère en politique », 22 mai 2026",
          "France Inter, Grand bien vous fasse, 16 juin 2026"
        ] }
      ]
    }
  ]
};
