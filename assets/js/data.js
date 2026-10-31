/*
 * Catalogue des récits de Soalma.
 *
 * Chaque récit est découpé en tableaux. Un tableau associe une scène
 * illustrée (voir scenes.js) et quelques paragraphes. Le champ `choix`
 * place un moment interactif après le tableau indiqué.
 *
 * Enregistrements audio : déposer le fichier dans assets/audio/ puis
 * renseigner `audio` avec le code de la langue, par exemple
 *   audio: { moore: 'assets/audio/yennenga-moore.mp3' }
 */

export const LANGUES = {
  fr: { nom: 'Français', note: 'Voix de synthèse du navigateur' },
  moore: { nom: 'Mooré', peuple: 'Mossi', zone: 'Centre et Nord', texte: 'Langue la plus parlée du pays, celle des royaumes mossi de Ouagadougou, Tenkodogo et du Yatenga.' },
  dioula: { nom: 'Dioula', peuple: 'Dioula, Bobo et voisins', zone: 'Ouest', texte: 'Langue des marchés et des échanges, comprise bien au-delà de l\'Ouest du pays.' },
  fulfulde: { nom: 'Fulfulde', peuple: 'Peul', zone: 'Sahel', texte: 'Langue des éleveurs peuls, parlée du Sénégal au Cameroun et très présente autour de Dori.' },
  gulmancema: { nom: 'Gulmancema', peuple: 'Gourmantché', zone: 'Est', texte: 'Langue du Gulmu, l\'ancien pays gourmantché dont Fada N\'Gourma est le cœur.' },
  kasem: { nom: 'Kasem', peuple: 'Kassena', zone: 'Centre-Sud', texte: 'Langue des Kassena, de part et d\'autre de la frontière avec le Ghana.' },
  lobiri: { nom: 'Lobiri', peuple: 'Lobi', zone: 'Sud-Ouest', texte: 'Langue des Lobi, autour de Gaoua et de Loropéni.' },
};

export const TYPES = ['Conte', 'Légende', 'Récit historique'];

export const CONTES = [
  {
    id: 'yennenga',
    titre: 'Yennenga, la princesse cavalière',
    type: 'Légende',
    peuple: 'Mossi',
    langue: 'moore',
    lieu: { nom: 'Tenkodogo', zone: 'Centre-Est', lon: -0.3697, lat: 11.78 },
    duree: 6,
    couleur: '#C8513A',
    accroche: 'La fille du roi de Gambaga montait mieux que les guerriers de son père. Un soir, elle partit sans se retourner.',
    resume: 'Fille du roi Nedega, Yennenga refuse la vie que son père lui impose. Sa fuite à cheval est à l\'origine du peuple mossi.',
    couverture: 1,
    tableaux: [
      {
        titre: 'La fille du roi',
        scene: { sky: 'dusk', items: [
          { k: 'palace', x: 420, layer: 'mid', s: 1.1 },
          { k: 'baobab', x: 1340, layer: 'mid', s: 1.2 },
          { k: 'rider', x: 980, spear: true, cape: true },
          { k: 'grass', x: 200, w: 260 }, { k: 'grass', x: 1450, w: 200 },
        ] },
        texte: [
          'Il y a très longtemps, au pays des Dagomba, régnait à Gambaga un roi nommé Nedega. De tous ses enfants, celle qu\'il aimait le plus était sa fille Yennenga.',
          'Yennenga n\'était pas une princesse comme les autres. Elle maniait la lance, le javelot et l\'arc, et aucun cavalier du royaume ne tenait son cheval mieux qu\'elle. Dans les batailles, elle chevauchait en tête des guerriers de son père, et ses ennemis craignaient son nom.',
          'Le roi en était fier. Si fier qu\'il ne voulait plus s\'en séparer.',
        ],
      },
      {
        titre: 'Le champ de gombo',
        scene: { sky: 'day', items: [
          { k: 'hut', x: 1320, layer: 'mid' }, { k: 'granary', x: 1450, layer: 'mid' },
          { k: 'okra', x: 520, dry: true }, { k: 'okra', x: 860, dry: true, layer: 'mid' },
          { k: 'woman', x: 1080 },
        ] },
        texte: [
          'Les années passèrent. Yennenga devint une jeune femme et souhaita fonder sa propre famille. Mais chaque fois qu\'un prétendant se présentait, le roi le renvoyait : il avait besoin de sa fille à la tête de ses troupes.',
          'Yennenga ne voulait pas désobéir. Elle choisit de parler à son père sans un mot. Elle sema un champ de gombo, le soigna jusqu\'à ce que les plantes portent leurs fruits, puis les laissa sécher sur pied sans jamais les récolter.',
          '« Pourquoi laisses-tu perdre ta récolte ? » lui demanda-t-on. « Je suis comme ce gombo, répondit-elle. Personne ne me cueille, et je me fane. » Le roi entendit la réponse, mais refusa de la comprendre.',
        ],
      },
      {
        titre: 'La fuite dans la nuit',
        scene: { sky: 'night', items: [
          { k: 'acacia', x: 300, layer: 'mid', s: 1.2 }, { k: 'ronier', x: 1420, layer: 'mid' },
          { k: 'rider', x: 800, cape: true, run: true, anim: 'gallop' },
          { k: 'grass', x: 300, w: 300 }, { k: 'grass', x: 1250, w: 260 },
        ] },
        texte: [
          'Une nuit, Yennenga sella son étalon, se déguisa en homme et quitta Gambaga. Elle galopa vers le nord, traversa des forêts et franchit une rivière gonflée par les pluies.',
          'Son cheval était rapide et loyal. Mais au matin du troisième jour, épuisé, il l\'emmena loin de toute route connue, au plus profond d\'une forêt où personne ne vivait.',
        ],
      },
      {
        titre: 'Riallé, le chasseur',
        scene: { sky: 'dawn', items: [
          { k: 'baobab', x: 1250, layer: 'mid', s: 1.4 }, { k: 'hut', x: 300, layer: 'mid' },
          { k: 'horse', x: 1120 }, { k: 'woman', x: 760 }, { k: 'hunter', x: 600, flip: true },
          { k: 'fire', x: 420, s: 0.8 },
        ] },
        texte: [
          'Dans cette forêt vivait un chasseur solitaire nommé Riallé. Il recueillit le voyageur, le fit manger et le laissa dormir près du feu.',
          'Quand Yennenga ôta son déguisement, Riallé découvrit une femme. Ils apprirent à se connaître, puis à s\'aimer. De leur union naquit un fils.',
          'En souvenir du cheval qui avait conduit sa mère jusque-là, ils l\'appelèrent Ouédraogo, ce qui veut dire « étalon ».',
        ],
      },
      {
        titre: 'Le peuple de l\'étalon',
        scene: { sky: 'day', items: [
          { k: 'hut', x: 200, layer: 'far' }, { k: 'hut', x: 330, layer: 'far' }, { k: 'hut', x: 1380, layer: 'far' },
          { k: 'hut', x: 260, layer: 'mid' }, { k: 'granary', x: 420, layer: 'mid' }, { k: 'hut', x: 1300, layer: 'mid' },
          { k: 'rider', x: 820, spear: true },
        ] },
        texte: [
          'Devenu adulte, Ouédraogo se rendit à Gambaga. Le vieux roi Nedega, heureux de retrouver sa fille à travers son petit-fils, le couvrit de présents : des chevaux, du bétail et des cavaliers.',
          'Ouédraogo fonda le royaume de Tenkodogo. Ses descendants créèrent d\'autres royaumes, à Ouagadougou et au Yatenga, et formèrent le peuple mossi.',
          'Aujourd\'hui encore, le cheval de Yennenga est partout au Burkina Faso. Le grand prix du FESPACO, le festival panafricain du cinéma de Ouagadougou, s\'appelle l\'Étalon de Yennenga.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Si tu étais Yennenga, que ferais-tu maintenant ?',
      options: [
        { label: 'Obéir et attendre', reponse: 'Beaucoup l\'auraient fait. Mais attendre, pour Yennenga, voulait dire se faner comme son champ. Écoute ce qu\'elle décida.' },
        { label: 'Parler encore au roi', reponse: 'Elle l\'avait déjà fait, à sa manière, et il n\'avait pas voulu entendre. Il ne lui restait qu\'un chemin.' },
        { label: 'Partir', reponse: 'C\'est ce qu\'elle fit. Mais partir seule, de nuit, à travers la brousse, demandait un immense courage.' },
      ],
    },
    morale: 'Une voix qu\'on refuse d\'entendre finit toujours par trouver son propre chemin.',
    glossaire: [
      { mot: 'Ouédraogo', langue: 'Mooré', sens: 'Étalon, cheval mâle. C\'est aujourd\'hui l\'un des noms de famille les plus répandus du pays.' },
      { mot: 'Naaba', langue: 'Mooré', sens: 'Chef, roi.' },
      { mot: 'FESPACO', langue: 'Français', sens: 'Festival panafricain du cinéma et de la télévision de Ouagadougou, créé en 1969.' },
    ],
    quiz: [
      { q: 'Comment Yennenga fait-elle comprendre son désir à son père ?', choix: ['Elle lui écrit un message', 'Elle laisse sécher un champ de gombo', 'Elle refuse de combattre'], bonne: 1, explication: 'Le gombo non récolté était un message : comme les fruits, elle se fanait sans être cueillie.' },
      { q: 'Que signifie le nom Ouédraogo ?', choix: ['Le chasseur', 'L\'étalon', 'La forêt'], bonne: 1, explication: 'Le fils de Yennenga porte le nom du cheval qui a guidé sa mère.' },
    ],
    sources: ['Tradition orale mossi, transmise sous de nombreuses variantes.', 'Le trophée « Étalon de Yennenga » du FESPACO.'],
    audio: {},
  },

  {
    id: 'moogho-naaba',
    titre: 'Le faux départ du Moogho Naaba',
    type: 'Récit historique',
    peuple: 'Mossi',
    langue: 'moore',
    lieu: { nom: 'Ouagadougou', zone: 'Centre', lon: -1.5197, lat: 12.3714 },
    duree: 5,
    couleur: '#9E2B25',
    accroche: 'Chaque vendredi à l\'aube, à Ouagadougou, un roi s\'apprête à partir en guerre. Et chaque vendredi, il renonce.',
    resume: 'La cérémonie hebdomadaire du palais du Moogho Naaba rejoue une vieille histoire : celle d\'un roi qui choisit son peuple plutôt que sa colère.',
    couverture: 0,
    tableaux: [
      {
        titre: 'Le vendredi à l\'aube',
        scene: { sky: 'dawn', items: [
          { k: 'palace', x: 800, layer: 'mid', s: 1.3 },
          { k: 'horse', x: 1180, saddle: true },
          { k: 'crowd', x: 520, n: 8, w: 380 },
        ] },
        texte: [
          'Si tu passes un vendredi matin près du palais du Moogho Naaba, à Ouagadougou, tu verras une scène étonnante. Les dignitaires de la cour sont assis par terre, en silence. Devant le palais, un cheval attend, sellé et harnaché comme pour la guerre.',
          'Le soleil se lève à peine. Tout le monde regarde la porte. Le roi va paraître.',
        ],
      },
      {
        titre: 'La reine qui ne revint pas',
        scene: { sky: 'night', items: [
          { k: 'palace', x: 700, layer: 'mid', s: 1.2 },
          { k: 'baobab', x: 1350, layer: 'mid', s: 1.1 },
          { k: 'man', x: 980 },
        ] },
        texte: [
          'Pour comprendre cette cérémonie, il faut remonter très loin. On raconte qu\'un jour, l\'une des épouses du Moogho Naaba partit rendre visite à sa famille, dans un royaume voisin. Les jours passèrent, puis les semaines. Elle ne revint pas.',
          'Le roi envoya des messagers. Ils revinrent seuls. Alors la colère monta en lui. Il fit seller son cheval et revêtit le rouge, la couleur de la guerre : il irait lui-même la chercher, les armes à la main.',
        ],
      },
      {
        titre: 'Les ministres supplient',
        scene: { sky: 'dawn', items: [
          { k: 'palace', x: 760, layer: 'mid', s: 1.2 },
          { k: 'horse', x: 1220, saddle: true },
          { k: 'man', x: 1000 },
          { k: 'crowd', x: 520, n: 7, w: 340, s: 0.8 },
        ] },
        texte: [
          'Au moment où le roi allait monter à cheval, ses ministres se jetèrent à terre devant lui. « Naaba, si tu pars, qui protégera le Moogho ? Une guerre pour une seule personne mettrait en danger tout ton peuple. »',
          'Le roi resta longtemps immobile devant son cheval. Puis il rentra dans le palais. Quand il en ressortit, il ne portait plus le rouge, mais le blanc, la couleur de la paix.',
        ],
      },
      {
        titre: 'Une leçon chaque semaine',
        scene: { sky: 'day', items: [
          { k: 'palace', x: 800, layer: 'mid', s: 1.3 },
          { k: 'crowd', x: 400, n: 9, w: 420 }, { k: 'crowd', x: 1220, n: 8, w: 380 },
        ] },
        texte: [
          'Depuis, la scène est rejouée chaque vendredi. Le roi apparaît vêtu de rouge, le cheval est prêt, les dignitaires le supplient de rester. Il se retire, puis revient en blanc. La cour le salue, et chacun repart à ses occupations.',
          'Les historiens proposent plusieurs lectures de ce rituel, mais le message reste le même : celui qui gouverne doit placer l\'intérêt de son peuple au-dessus de sa propre colère.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Tu es l\'un des ministres du roi. Que lui dis-tu ?',
      options: [
        { label: 'Partez, Naaba, votre honneur l\'exige', reponse: 'C\'était l\'avis de quelques jeunes guerriers. Mais les plus anciens savaient ce qu\'une guerre coûterait au royaume.' },
        { label: 'Restez, le royaume a besoin de vous', reponse: 'C\'est ce que dirent les ministres, l\'un après l\'autre. Écoute la suite.' },
        { label: 'Envoyons d\'abord une ambassade', reponse: 'Une idée sage, mais les messagers avaient déjà échoué. Les ministres choisirent une autre voie : supplier le roi.' },
      ],
    },
    morale: 'Un chef se mesure aux colères qu\'il sait retenir.',
    glossaire: [
      { mot: 'Moogho', langue: 'Mooré', sens: 'Le monde, et par extension le pays mossi.' },
      { mot: 'Moogho Naaba', langue: 'Mooré', sens: 'Roi des Mossi de Ouagadougou.' },
    ],
    quiz: [
      { q: 'Que symbolise le rouge porté par le roi ?', choix: ['La guerre', 'La fête', 'Le deuil'], bonne: 0, explication: 'Le rouge annonce la guerre. Le blanc, qu\'il porte ensuite, annonce la paix.' },
      { q: 'Quel jour la cérémonie a-t-elle lieu ?', choix: ['Le lundi', 'Le vendredi', 'Le dimanche'], bonne: 1, explication: 'Elle se déroule chaque vendredi matin devant le palais.' },
    ],
    sources: ['Tradition de la cour du Moogho Naaba, Ouagadougou.', 'Plusieurs versions circulent sur l\'identité de l\'épouse et du royaume voisin.'],
    audio: {},
  },

  {
    id: 'lievre-hyene',
    titre: 'Soamba le lièvre et Katré l\'hyène',
    type: 'Conte',
    peuple: 'Mossi',
    langue: 'moore',
    lieu: { nom: 'Ouahigouya', zone: 'Nord (Yatenga)', lon: -2.4216, lat: 13.5828 },
    duree: 6,
    couleur: '#E3A63B',
    accroche: 'Pendant la grande sécheresse, tous les animaux creusent un puits. Tous, sauf une.',
    resume: 'Katré l\'hyène refuse de travailler mais vient boire la nuit. Soamba le lièvre lui tend un piège collant.',
    couverture: 3,
    tableaux: [
      {
        titre: 'La grande sécheresse',
        scene: { sky: 'dust', ground: 'sahel', items: [
          { k: 'baobab', x: 1100, layer: 'mid', s: 1.5 },
          { k: 'acacia', x: 300, layer: 'far', s: 1.4 },
          { k: 'hare', x: 640, s: 1.5 }, { k: 'hyena', x: 900, flip: true },
        ] },
        texte: [
          'Cette année-là, au Yatenga, la pluie ne vint pas. Les mares séchèrent l\'une après l\'autre, l\'herbe devint de la paille et les animaux de la brousse eurent soif.',
          'Le lion, chef de la brousse, réunit tout le monde sous le grand baobab. « Creusons un puits ensemble, dit-il. Chacun donnera ses bras, et chacun boira. »',
        ],
      },
      {
        titre: 'Celle qui ne creuse pas',
        scene: { sky: 'day', ground: 'sahel', items: [
          { k: 'acacia', x: 1260, layer: 'mid', s: 1.4 },
          { k: 'well', x: 620, s: 1.3 }, { k: 'hare', x: 820, s: 1.4, flip: true },
          { k: 'hyena', x: 1230, s: 0.9, y: 826, anim: 'breathe' },
        ] },
        texte: [
          'Tous se mirent au travail. L\'éléphant enlevait la terre, le phacochère creusait avec son groin, Soamba le lièvre courait porter les calebasses de sable. Seule Katré l\'hyène resta couchée à l\'ombre.',
          '« Moi, je n\'ai pas soif », dit-elle en bâillant. Au bout de sept jours, l\'eau jaillit, claire et fraîche. Les animaux dansèrent autour du puits.',
        ],
      },
      {
        titre: 'Les traces de la nuit',
        scene: { sky: 'night', ground: 'sahel', items: [
          { k: 'acacia', x: 1200, layer: 'mid', s: 1.3 },
          { k: 'well', x: 720, s: 1.3 },
          { k: 'hyena', x: 480, anim: 'sneak' },
        ] },
        texte: [
          'Le lendemain matin, le niveau du puits avait baissé et la margelle était couverte de boue. Quelqu\'un était venu boire pendant la nuit, et s\'y était même roulé.',
          'Les animaux regardèrent les traces : de grosses pattes, une démarche penchée. Tout le monde pensait la même chose, mais personne n\'osait accuser Katré.',
        ],
      },
      {
        titre: 'La statue de gomme',
        scene: { sky: 'night', ground: 'sahel', items: [
          { k: 'acacia', x: 300, layer: 'mid', s: 1.2 },
          { k: 'well', x: 980, s: 1.3 }, { k: 'statue', x: 800, s: 1.1 },
          { k: 'hyena', x: 640, anim: 'struggle' },
        ] },
        texte: [
          'Soamba sculpta dans le bois une petite statue, la couvrit de gomme bien collante récoltée sur les arbres, et la posa au bord du puits.',
          'Cette nuit-là, Katré arriva, sûre d\'elle. « Pousse-toi de mon chemin ! » cria-t-elle à la statue. La statue ne bougea pas. Katré la frappa de la patte droite, qui resta collée. Puis de la patte gauche. Puis elle donna un coup de tête. Au lever du jour, elle était prisonnière, collée de partout.',
        ],
      },
      {
        titre: 'Le matin de la honte',
        scene: { sky: 'dawn', ground: 'sahel', items: [
          { k: 'baobab', x: 1300, layer: 'mid', s: 1.3 },
          { k: 'well', x: 760, s: 1.2 }, { k: 'statue', x: 600 }, { k: 'hyena', x: 470 },
          { k: 'hare', x: 1000, s: 1.4, flip: true, anim: 'hop' },
        ] },
        texte: [
          'Les animaux la trouvèrent ainsi. Ils rirent si fort que toute la brousse les entendit. On la décolla, mais on lui interdit de revenir au puits.',
          'Depuis ce jour, dit-on, l\'hyène rôde la nuit, la tête basse, et son rire ressemble à celui des animaux qui se moquèrent d\'elle.',
        ],
      },
    ],
    choix: {
      apres: 2,
      question: 'Comment attraper le voleur d\'eau ?',
      options: [
        { label: 'Monter la garde toute la nuit', reponse: 'Le phacochère essaya. Il s\'endormit avant minuit, et l\'eau disparut encore. Soamba avait une meilleure idée.' },
        { label: 'Accuser Katré devant tous', reponse: 'Sans preuve, Katré aurait tout nié en riant. Soamba préférait qu\'elle se dénonce elle-même.' },
        { label: 'Tendre un piège', reponse: 'C\'est ce que proposa Soamba, et son piège était particulièrement malin.' },
      ],
    },
    morale: 'Celui qui refuse de creuser le puits ne doit pas venir y boire.',
    glossaire: [
      { mot: 'Soamba', langue: 'Mooré', sens: 'Le lièvre, personnage rusé des contes.' },
      { mot: 'Katré', langue: 'Mooré', sens: 'L\'hyène, personnage glouton et paresseux des contes.' },
      { mot: 'Yatenga', langue: 'Mooré', sens: 'Ancien royaume mossi du Nord, dont la capitale est Ouahigouya.' },
    ],
    quiz: [
      { q: 'Pourquoi les animaux creusent-ils un puits ?', choix: ['Pour cacher un trésor', 'À cause de la sécheresse', 'Pour piéger l\'hyène'], bonne: 1, explication: 'La pluie n\'est pas venue et les mares ont séché.' },
      { q: 'Comment Katré est-elle démasquée ?', choix: ['Elle avoue', 'Elle reste collée à une statue de gomme', 'Le lion la surprend'], bonne: 1, explication: 'Le piège de Soamba la retient jusqu\'au matin.' },
    ],
    sources: ['Conte populaire mossi. Le motif du personnage collé à une statue de gomme se retrouve dans de nombreux contes d\'Afrique de l\'Ouest.'],
    audio: {},
  },

  {
    id: 'dafra',
    titre: 'Les silures sacrés de Dafra',
    type: 'Légende',
    peuple: 'Bobo',
    langue: 'dioula',
    lieu: { nom: 'Dafra, près de Bobo-Dioulasso', zone: 'Ouest', lon: -4.255, lat: 11.135 },
    duree: 5,
    couleur: '#3E7C59',
    accroche: 'Au fond d\'une faille, près de Bobo-Dioulasso, dorment des poissons que personne n\'a le droit de pêcher.',
    resume: 'Un pacte entre les fondateurs de Sya et le génie de l\'eau explique pourquoi les silures de Dafra sont protégés depuis des générations.',
    couverture: 0,
    tableaux: [
      {
        titre: 'La faille dans la falaise',
        scene: { sky: 'day', ground: 'rock', items: [
          { k: 'cliff', x: 300, side: 'left', layer: 'mid', s: 1.4 }, { k: 'cliff', x: 1300, side: 'right', layer: 'mid', s: 1.4 },
          { k: 'pond', x: 800, y: 790, w: 1100 },
          { k: 'catfish', x: 640, y: 800, s: 0.9, c: '#1D2B26', anim: 'swim' },
          { k: 'catfish', x: 980, y: 820, s: 0.7, c: '#1D2B26', anim: 'swim-r', flip: true },
        ] },
        texte: [
          'À quelques kilomètres de Bobo-Dioulasso, un sentier descend entre les rochers jusqu\'au fond d\'une faille. Là dort une mare d\'eau verte, à l\'ombre des falaises : c\'est Dafra.',
          'Dans cette eau vivent des silures, de gros poissons à moustaches. Personne ne les pêche. Personne ne les mange. Les gens viennent les nourrir et leur confier leurs prières.',
        ],
      },
      {
        titre: 'Le génie de l\'eau',
        scene: { sky: 'night', ground: 'rock', items: [
          { k: 'cliff', x: 260, side: 'left', layer: 'mid', s: 1.4 }, { k: 'cliff', x: 1340, side: 'right', layer: 'mid', s: 1.4 },
          { k: 'pond', x: 800, y: 790, w: 1000 },
          { k: 'catfish', x: 760, y: 810, c: '#0B1222', anim: 'swim' },
          { k: 'hunter', x: 1080, y: 770, s: 0.9, flip: true },
        ] },
        texte: [
          'On raconte qu\'autrefois, les ancêtres qui fondèrent Sya, le vieux nom de Bobo-Dioulasso, traversaient une période de malheurs : les récoltes étaient maigres et la maladie frappait les familles.',
          'Un chasseur, parti loin dans la brousse, découvrit la faille de Dafra. Au bord de l\'eau, une voix lui parla. C\'était le génie du lieu : « Prends soin de mes enfants, les poissons de cette mare, et je veillerai sur les tiens. »',
        ],
      },
      {
        titre: 'Le pacte',
        scene: { sky: 'dawn', ground: 'rock', items: [
          { k: 'cliff', x: 260, side: 'left', layer: 'mid', s: 1.3 }, { k: 'cliff', x: 1340, side: 'right', layer: 'mid', s: 1.3 },
          { k: 'pond', x: 800, y: 800, w: 900 },
          { k: 'crowd', x: 800, y: 740, n: 7, w: 340, s: 0.7 },
        ] },
        texte: [
          'Le chasseur rapporta ces paroles au village. Les anciens acceptèrent le pacte. Depuis, les silures de Dafra sont sacrés : leur faire du mal, c\'est rompre l\'alliance avec le génie et attirer le malheur.',
        ],
      },
      {
        titre: 'Les visiteurs de Dafra',
        scene: { sky: 'day', ground: 'rock', items: [
          { k: 'cliff', x: 300, side: 'left', layer: 'mid', s: 1.4 }, { k: 'cliff', x: 1300, side: 'right', layer: 'mid', s: 1.4 },
          { k: 'pond', x: 800, y: 800, w: 1000 },
          { k: 'catfish', x: 700, y: 812, s: 0.8, c: '#1D2B26', anim: 'swim' },
          { k: 'woman', x: 1020, y: 770, s: 0.8 }, { k: 'child', x: 1090, y: 770, s: 0.8 },
        ] },
        texte: [
          'Aujourd\'hui encore, des familles entières descendent vers la mare. Elles viennent demander un enfant, une guérison, la réussite d\'un projet. Elles nourrissent les silures, guidées par les gardiens du site.',
          'Dafra rappelle une idée ancienne : une communauté vit en paix tant qu\'elle respecte les êtres et les lieux qui l\'entourent.',
        ],
      },
    ],
    choix: {
      apres: 2,
      question: 'Un voyageur affamé voit un silure à portée de main. Que lui conseilles-tu ?',
      options: [
        { label: 'Le pêcher discrètement', reponse: 'Personne ne le verrait, peut-être. Mais à Dafra, on dit que l\'alliance se rompt même en secret.' },
        { label: 'Lui donner à manger', reponse: 'C\'est la bonne façon de faire : les visiteurs apportent souvent de la nourriture aux poissons.' },
        { label: 'Demander aux gardiens du lieu', reponse: 'Sage décision. Les gardiens lui expliqueraient les règles et l\'aideraient à trouver à manger ailleurs.' },
      ],
    },
    morale: 'Ce que l\'on protège finit par nous protéger.',
    glossaire: [
      { mot: 'Sya', langue: 'Bobo', sens: 'Ancien nom de Bobo-Dioulasso.' },
      { mot: 'Silure', langue: 'Français', sens: 'Poisson-chat d\'eau douce, reconnaissable à ses barbillons.' },
    ],
    quiz: [
      { q: 'Pourquoi les silures de Dafra ne sont-ils pas pêchés ?', choix: ['Ils sont trop petits', 'Ils sont liés à un pacte avec le génie de l\'eau', 'Ils sont vénéneux'], bonne: 1, explication: 'Les protéger, c\'est respecter l\'alliance conclue par les ancêtres.' },
      { q: 'Quel est l\'ancien nom de Bobo-Dioulasso ?', choix: ['Sya', 'Nungu', 'Gambaga'], bonne: 0, explication: 'Sya est le nom du vieux quartier fondateur de la ville.' },
    ],
    sources: ['Tradition orale de Bobo-Dioulasso autour du site de Dafra.', 'Les récits varient selon les familles gardiennes du lieu.'],
    audio: { dioula: 'assets/audio/dafra-dioula.mp3' },
  },

  {
    id: 'sabou',
    titre: 'Les crocodiles de Sabou',
    type: 'Légende',
    peuple: 'Mossi',
    langue: 'moore',
    lieu: { nom: 'Sabou', zone: 'Centre-Ouest', lon: -2.2378, lat: 12.0647 },
    duree: 5,
    couleur: '#5B7F3A',
    accroche: 'Un chasseur perdu, mourant de soif, suit un crocodile. Il ne le sait pas encore, mais il va fonder un village.',
    resume: 'La mare de Sabou abrite des crocodiles sacrés. Une promesse faite il y a des siècles explique pourquoi on y vit à leurs côtés.',
    couverture: 2,
    tableaux: [
      {
        titre: 'Le chasseur perdu',
        scene: { sky: 'dust', items: [
          { k: 'acacia', x: 1150, layer: 'mid', s: 1.5 }, { k: 'acacia', x: 260, layer: 'far', s: 1.3 },
          { k: 'hunter', x: 720 },
          { k: 'grass', x: 420, w: 300 }, { k: 'grass', x: 1350, w: 260 },
        ] },
        texte: [
          'Il y a bien longtemps, un chasseur quitta son village pour suivre la trace d\'une antilope. Il marcha toute la journée, puis une deuxième, oubliant de compter les pas qui l\'éloignaient de chez lui.',
          'Quand il voulut rentrer, il ne reconnut plus rien. Sa gourde était vide. Le soleil brûlait, et la soif lui serrait la gorge au point qu\'il ne pouvait plus avancer.',
        ],
      },
      {
        titre: 'Le guide inattendu',
        scene: { sky: 'dusk', items: [
          { k: 'baobab', x: 1250, layer: 'mid', s: 1.3 },
          { k: 'hunter', x: 1040, flip: true },
          { k: 'croc', x: 600, s: 1.1, anim: 'crawl' },
          { k: 'grass', x: 300, w: 300 },
        ] },
        texte: [
          'Il s\'assit à l\'ombre d\'un arbre, persuadé qu\'il allait mourir. C\'est alors qu\'il vit un crocodile sortir des herbes.',
          'L\'animal le regarda longtemps, puis se mit à marcher lentement, en se retournant de temps en temps, comme pour l\'inviter à le suivre.',
        ],
      },
      {
        titre: 'La mare',
        scene: { sky: 'dusk', items: [
          { k: 'ronier', x: 260, layer: 'mid', s: 1.1 }, { k: 'acacia', x: 1330, layer: 'mid', s: 1.3 },
          { k: 'pond', x: 760, y: 770, w: 1000 },
          { k: 'croc', x: 480, y: 790, s: 0.8 }, { k: 'croc', x: 1080, y: 800, s: 0.7, flip: true },
          { k: 'hunter', x: 1300, y: 820 },
        ] },
        texte: [
          'Le crocodile le conduisit jusqu\'à une mare cachée par les arbres. Le chasseur but longtemps et retrouva ses forces. Autour de lui, d\'autres crocodiles se reposaient sur la rive sans lui prêter attention.',
          'Avant de repartir, il fit une promesse à voix haute : « Ni moi ni mes descendants ne vous ferons jamais de mal. Cette mare sera votre maison, et nous la protégerons. »',
        ],
      },
      {
        titre: 'La promesse tenue',
        scene: { sky: 'day', items: [
          { k: 'hut', x: 220, layer: 'mid' }, { k: 'hut', x: 360, layer: 'mid' }, { k: 'granary', x: 480, layer: 'mid' },
          { k: 'pond', x: 900, y: 780, w: 900 },
          { k: 'croc', x: 860, y: 800, s: 0.8 },
          { k: 'child', x: 1220, y: 820 }, { k: 'man', x: 1320, y: 820 },
        ] },
        texte: [
          'Le chasseur revint avec sa famille et s\'installa près de la mare. Ainsi naquit le village de Sabou. Depuis, ses habitants vivent aux côtés des crocodiles sacrés.',
          'On dit que lorsqu\'un vieux crocodile meurt, il reçoit des funérailles, comme un membre de la famille.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Que doit faire le chasseur ?',
      options: [
        { label: 'Fuir le crocodile', reponse: 'La peur était naturelle. Mais fuir sans eau et sans chemin, c\'était se perdre davantage. Le chasseur décida de faire confiance.' },
        { label: 'Le suivre', reponse: 'C\'est ce qu\'il fit, à bout de forces, pas après pas.' },
        { label: 'Le chasser pour le manger', reponse: 'Il n\'en avait plus la force. Et heureusement : ce crocodile allait lui sauver la vie.' },
      ],
    },
    morale: 'La reconnaissance est une dette que l\'on transmet à ses enfants.',
    glossaire: [
      { mot: 'Mare sacrée', langue: 'Français', sens: 'Point d\'eau protégé par un interdit coutumier.' },
      { mot: 'Interdit', langue: 'Français', sens: 'Règle héritée des ancêtres, qu\'une famille ou un village s\'engage à respecter.' },
    ],
    quiz: [
      { q: 'Comment le chasseur est-il sauvé ?', choix: ['Un oiseau le guide', 'Un crocodile le conduit à une mare', 'Il trouve un puits'], bonne: 1, explication: 'Le crocodile le mène jusqu\'à l\'eau.' },
      { q: 'Quelle promesse fait-il ?', choix: ['Ne jamais faire de mal aux crocodiles', 'Ne plus jamais chasser', 'Construire un puits'], bonne: 0, explication: 'Une promesse que ses descendants tiennent encore.' },
    ],
    sources: ['Tradition orale de Sabou. Des récits proches existent pour la mare de Bazoulé.'],
    audio: {},
  },

  {
    id: 'diaba-lompo',
    titre: 'Diaba Lompo, le roi venu du ciel',
    type: 'Légende',
    peuple: 'Gourmantché',
    langue: 'gulmancema',
    lieu: { nom: 'Fada N\'Gourma', zone: 'Est', lon: 0.3584, lat: 12.0616 },
    duree: 5,
    couleur: '#E8C98A',
    accroche: 'Une nuit, une lumière descend sur une colline. Avec elle arrive l\'homme qui fondera le Gulmu.',
    resume: 'La légende fondatrice du royaume gourmantché raconte l\'arrivée d\'un chef descendu du ciel et accepté pour sa justice.',
    couverture: 0,
    tableaux: [
      {
        titre: 'Une lumière sur la colline',
        scene: { sky: 'night', items: [
          { k: 'beam', x: 820, y: 640, layer: 'far', s: 2.2 },
          { k: 'baobab', x: 260, layer: 'mid', s: 1.2 }, { k: 'hut', x: 1320, layer: 'mid' },
          { k: 'crowd', x: 1150, n: 5, w: 200, s: 0.8 },
        ] },
        texte: [
          'À l\'est du Burkina Faso, au pays gourmantché, on raconte qu\'aux premiers temps, les hommes vivaient dispersés, sans roi pour les rassembler.',
          'Une nuit, une grande lumière apparut au-dessus d\'une colline. Ceux qui la virent dirent qu\'un homme descendait du ciel, avec son cheval et ses gens. On l\'appela Diaba Lompo.',
        ],
      },
      {
        titre: 'L\'homme venu d\'en haut',
        scene: { sky: 'dawn', items: [
          { k: 'baobab', x: 1320, layer: 'mid', s: 1.3 },
          { k: 'rider', x: 520, spear: true },
          { k: 'crowd', x: 1000, n: 7, w: 320 },
        ] },
        texte: [
          'Diaba Lompo apportait des objets que personne n\'avait jamais vus. Il parlait avec sagesse et réglait les disputes avec justice. Peu à peu, les familles de la région vinrent le consulter.',
        ],
      },
      {
        titre: 'La naissance du Gulmu',
        scene: { sky: 'day', items: [
          { k: 'palace', x: 820, layer: 'far', s: 1.4 },
          { k: 'hut', x: 300, layer: 'mid' }, { k: 'granary', x: 430, layer: 'mid' }, { k: 'hut', x: 1250, layer: 'mid' },
          { k: 'crowd', x: 800, n: 10, w: 520 },
        ] },
        texte: [
          'Les Gourmantché firent de lui leur chef. Ses descendants fondèrent plusieurs royaumes, réunis sous le nom de Gulmu, le pays gourmantché. Leur capitale devint Nungu, la ville que l\'on appelle aujourd\'hui Fada N\'Gourma.',
          'Les rois du Gulmu se disent encore descendants de Diaba Lompo, et la colline de sa descente reste un lieu de mémoire.',
        ],
      },
      {
        titre: 'Ce que dit la légende',
        scene: { sky: 'night', items: [
          { k: 'baobab', x: 1250, layer: 'mid', s: 1.3 },
          { k: 'fire', x: 760 }, { k: 'griot', x: 600 }, { k: 'crowd', x: 960, n: 4, w: 160, s: 0.7 },
        ] },
        texte: [
          'Les historiens voient dans ce récit la mémoire d\'une dynastie venue d\'ailleurs et accueillie par les populations locales. La légende, elle, préfère le ciel.',
          'Elle dit que le pouvoir juste est un don qui vient d\'en haut, et qu\'il doit servir ceux d\'en bas.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Les anciens hésitent. À quoi reconnaît-on un bon chef ?',
      options: [
        { label: 'À sa richesse', reponse: 'La richesse impressionne, mais elle ne rend pas la justice. Les anciens regardèrent autre chose.' },
        { label: 'À sa force', reponse: 'La force fait peur, elle ne rassemble pas. Les anciens cherchaient autre chose.' },
        { label: 'À la justice de ses décisions', reponse: 'C\'est ce qui convainquit les Gourmantché : Diaba Lompo tranchait les conflits sans favoriser personne.' },
      ],
    },
    morale: 'Le pouvoir n\'est légitime que s\'il rend justice à tous.',
    glossaire: [
      { mot: 'Gulmu', langue: 'Gulmancema', sens: 'Le pays gourmantché.' },
      { mot: 'Nungu', langue: 'Gulmancema', sens: 'Nom traditionnel de Fada N\'Gourma.' },
    ],
    quiz: [
      { q: 'D\'où vient Diaba Lompo selon la légende ?', choix: ['De la mer', 'Du ciel', 'Du désert'], bonne: 1, explication: 'Il serait descendu du ciel sur une colline, avec son cheval.' },
      { q: 'Quel est le nom traditionnel de Fada N\'Gourma ?', choix: ['Sya', 'Nungu', 'Gambaga'], bonne: 1, explication: 'Nungu était la capitale du Gulmu.' },
    ],
    sources: ['Tradition orale gourmantché sur les origines du Gulmu.'],
    audio: {},
  },

  {
    id: 'vache-blanche',
    titre: 'Le berger et la vache blanche',
    type: 'Conte',
    peuple: 'Peul',
    langue: 'fulfulde',
    lieu: { nom: 'Dori', zone: 'Sahel', lon: -0.0345, lat: 14.0354 },
    duree: 6,
    couleur: '#D9B26F',
    accroche: 'Le vent de sable emporte la vache préférée de Hamadou. Pour la retrouver, il devra d\'abord s\'arrêter.',
    resume: 'Un jeune berger peul cherche sa vache perdue dans l\'harmattan. Sur sa route, une vieille femme met sa patience à l\'épreuve.',
    adaptation: true,
    couverture: 0,
    tableaux: [
      {
        titre: 'Le troupeau de Hamadou',
        scene: { sky: 'day', ground: 'sahel', items: [
          { k: 'acacia', x: 1280, layer: 'mid', s: 1.5 },
          { k: 'cow', x: 300, layer: 'mid' }, { k: 'cow', x: 460, layer: 'mid', flip: true },
          { k: 'cow', x: 720, white: true, s: 1.2 }, { k: 'herder', x: 1000 },
        ] },
        texte: [
          'Au Sahel, près de Dori, vivait un jeune berger nommé Hamadou. Son père lui avait confié le troupeau de la famille.',
          'Parmi toutes les bêtes, il en aimait une plus que les autres : une vache blanche aux longues cornes, calme et douce, qui marchait toujours en tête.',
        ],
      },
      {
        titre: 'Le vent de sable',
        scene: { sky: 'dust', ground: 'sahel', items: [
          { k: 'acacia', x: 400, layer: 'far', s: 1.3 },
          { k: 'cow', x: 500, layer: 'mid' }, { k: 'cow', x: 650, layer: 'mid', flip: true },
          { k: 'herder', x: 980, anim: 'lean' },
        ] },
        texte: [
          'Un jour de saison sèche, l\'harmattan se leva. Le vent souleva tant de sable que le ciel devint jaune et que Hamadou ne voyait plus ses propres mains.',
          'Quand la tempête se calma, il compta ses bêtes. La vache blanche avait disparu. Il confia le troupeau à son petit frère et partit à sa recherche, avec un bâton, une gourde et un peu de lait caillé.',
        ],
      },
      {
        titre: 'La vieille femme du puits',
        scene: { sky: 'day', ground: 'sahel', items: [
          { k: 'acacia', x: 1300, layer: 'mid', s: 1.3 },
          { k: 'well', x: 640, s: 1.3 }, { k: 'oldwoman', x: 780 }, { k: 'herder', x: 1060, flip: true },
        ] },
        texte: [
          'Après une longue marche, il arriva près d\'un puits. Une vieille femme essayait de remonter le seau, mais la corde était trop lourde pour ses bras.',
          'Hamadou était pressé. Sa vache était peut-être en danger.',
        ],
      },
      {
        titre: 'Le conseil',
        scene: { sky: 'dusk', ground: 'sahel', items: [
          { k: 'acacia', x: 300, layer: 'mid', s: 1.3 },
          { k: 'well', x: 700, s: 1.3 }, { k: 'oldwoman', x: 880 }, { k: 'herder', x: 560 },
        ] },
        texte: [
          'Hamadou tira la corde, remplit les canaris de la vieille femme et lui offrit la moitié de son lait caillé. Elle but, le remercia, puis lui dit :',
          '« Ta vache est partie vers la mare aux trois acacias. Les bêtes savent où trouver l\'eau. Va avant la nuit. »',
        ],
      },
      {
        titre: 'La mare aux trois acacias',
        scene: { sky: 'dusk', ground: 'sahel', items: [
          { k: 'acacia', x: 540, layer: 'mid', s: 1.2 }, { k: 'acacia', x: 800, layer: 'mid', s: 1.4 }, { k: 'acacia', x: 1060, layer: 'mid', s: 1.1 },
          { k: 'pond', x: 800, y: 760, w: 760 },
          { k: 'cow', x: 760, y: 790, white: true }, { k: 'cow', x: 560, y: 780, s: 0.8 },
          { k: 'herder', x: 1240 },
        ] },
        texte: [
          'Hamadou courut. Au coucher du soleil, il vit trois acacias et, sous eux, une mare. Sa vache blanche buvait tranquillement, entourée d\'autres bêtes égarées.',
          'Il les ramena toutes au campement. Les autres bergers vinrent le remercier, et le père de Hamadou comprit que son fils était devenu un homme.',
        ],
      },
    ],
    choix: {
      apres: 2,
      question: 'Hamadou est pressé. Que doit-il faire ?',
      options: [
        { label: 'Continuer sa route', reponse: 'Il y pensa. Mais le pulaaku, la règle de conduite des Peuls, lui rappelait que la patience et le respect passent avant tout. Il s\'arrêta.' },
        { label: 'Aider la vieille femme', reponse: 'C\'est ce qu\'il fit, sans hésiter longtemps.' },
        { label: 'Lui demander d\'abord si elle a vu sa vache', reponse: 'Il aurait pu. Mais il eut honte de marchander son aide. Il remonta d\'abord le seau.' },
      ],
    },
    morale: 'Le temps donné aux autres n\'est jamais du temps perdu.',
    glossaire: [
      { mot: 'Pulaaku', langue: 'Fulfulde', sens: 'Code de conduite peul : patience, retenue, sens de l\'honneur.' },
      { mot: 'Harmattan', langue: 'Français', sens: 'Vent sec et chargé de poussière qui souffle du Sahara pendant la saison sèche.' },
      { mot: 'Canari', langue: 'Français d\'Afrique', sens: 'Grande jarre en terre cuite qui garde l\'eau fraîche.' },
    ],
    quiz: [
      { q: 'Qu\'est-ce que le pulaaku ?', choix: ['Un instrument de musique', 'Le code de conduite des Peuls', 'Une danse'], bonne: 1, explication: 'Il guide la conduite : patience, maîtrise de soi, respect.' },
      { q: 'Qui indique à Hamadou où trouver sa vache ?', choix: ['Son père', 'La vieille femme qu\'il a aidée', 'Un marchand'], bonne: 1, explication: 'Sa générosité lui vaut le conseil qui le mène à la mare.' },
    ],
    sources: ['Adaptation libre de motifs fréquents des contes peuls du Sahel (le berger, la bête égarée, l\'épreuve de l\'hospitalité).'],
    audio: {},
  },

  {
    id: 'loropeni',
    titre: 'Les murs de Loropéni',
    type: 'Récit historique',
    peuple: 'Lobi',
    langue: 'lobiri',
    lieu: { nom: 'Loropéni', zone: 'Sud-Ouest', lon: -3.5564, lat: 10.3197 },
    duree: 5,
    couleur: '#A4532E',
    accroche: 'Au milieu des arbres, des murs de pierre plus hauts qu\'un homme. Personne ne sait vraiment qui les a construits.',
    resume: 'Un grand-père raconte à son petit-fils l\'histoire des ruines de Loropéni, premier site du Burkina Faso inscrit au patrimoine mondial.',
    couverture: 1,
    tableaux: [
      {
        titre: 'Les pierres dans la forêt',
        scene: { sky: 'day', items: [
          { k: 'acacia', x: 200, layer: 'far', s: 1.4 }, { k: 'baobab', x: 1400, layer: 'mid', s: 1.2 },
          { k: 'ruins', x: 760, layer: 'mid', w: 900, s: 1.2, color: '#7E3F23' },
          { k: 'man', x: 1060, staff: false }, { k: 'child', x: 1150 },
        ] },
        texte: [
          '« Grand-père, qui a construit ces murs ? » Le petit Sié pose la question chaque fois qu\'ils passent près des ruines. Entre les arbres, des murs de pierre se dressent, plus hauts qu\'un homme.',
          'Le grand-père s\'assoit sur une pierre. « Écoute. Ce que je sais, je le tiens de mon père, qui le tenait du sien. »',
        ],
      },
      {
        titre: 'Le temps de l\'or',
        scene: { sky: 'dusk', items: [
          { k: 'ruins', x: 800, layer: 'mid', w: 1000, s: 1.3 },
          { k: 'crowd', x: 560, n: 6, w: 280, s: 0.9 }, { k: 'horse', x: 1060, s: 0.9 },
        ] },
        texte: [
          '« Il y a plus de mille ans, cette région était connue pour son or. Des marchands venaient de très loin pour l\'échanger, et leurs routes rejoignaient celles qui traversaient le Sahara. »',
          '« Ceux qui contrôlaient cet or vivaient ici, derrière ces murs. Ils ont monté les pierres de latérite une à une, pour protéger leurs biens, leurs familles, peut-être leurs secrets. »',
        ],
      },
      {
        titre: 'Le silence',
        scene: { sky: 'night', items: [
          { k: 'ruins', x: 760, layer: 'mid', w: 1100, s: 1.2 },
          { k: 'baobab', x: 1350, s: 0.9 }, { k: 'grass', x: 400, w: 400 }, { k: 'grass', x: 900, w: 300 },
        ] },
        texte: [
          '« Puis les habitants sont partis. On ne sait pas exactement pourquoi. Certains disent que l\'or s\'est épuisé, d\'autres parlent de guerres. Au début du XIXe siècle, les lieux étaient déjà abandonnés, et la forêt a repris sa place. »',
          '« Les Lobi qui vivent ici aujourd\'hui respectent ces ruines. Ils savent qu\'elles appartiennent à ceux d\'avant. »',
        ],
      },
      {
        titre: 'Un patrimoine du monde',
        scene: { sky: 'day', items: [
          { k: 'ruins', x: 700, layer: 'mid', w: 900, s: 1.2, color: '#7E3F23' },
          { k: 'ronier', x: 1380, layer: 'mid' },
          { k: 'child', x: 980 }, { k: 'man', x: 1080 },
        ] },
        texte: [
          '« En 2009, les ruines de Loropéni sont devenues le premier site du Burkina Faso inscrit au patrimoine mondial de l\'UNESCO. Des chercheurs viennent les étudier, et des visiteurs du monde entier marchent là où tu marches. »',
          'Sié regarde les murs autrement. Ce ne sont plus de vieilles pierres : ce sont des questions qui attendent encore leurs réponses.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Sié se demande à quoi servaient ces murs. Et toi, qu\'en penses-tu ?',
      options: [
        { label: 'À se défendre', reponse: 'C\'est une hypothèse sérieuse : des murs aussi hauts protégeaient des attaques.' },
        { label: 'À garder l\'or', reponse: 'Peut-être aussi. Les archéologues relient le site au commerce de l\'or.' },
        { label: 'On ne sait pas encore', reponse: 'C\'est la réponse la plus honnête. Les chercheurs en débattent toujours, et c\'est ce qui rend le lieu fascinant.' },
      ],
    },
    morale: 'Un peuple qui oublie son passé perd le chemin de son avenir.',
    glossaire: [
      { mot: 'Latérite', langue: 'Français', sens: 'Roche rouge riche en fer, très utilisée pour construire en Afrique de l\'Ouest.' },
      { mot: 'Lobi', langue: 'Lobiri', sens: 'Peuple du Sud-Ouest du Burkina Faso.' },
    ],
    quiz: [
      { q: 'À quel commerce le site de Loropéni est-il lié ?', choix: ['Le sel', 'L\'or', 'Le coton'], bonne: 1, explication: 'La région était connue pour l\'extraction et le commerce de l\'or.' },
      { q: 'En quelle année Loropéni a-t-il été inscrit au patrimoine mondial ?', choix: ['1998', '2009', '2019'], bonne: 1, explication: 'C\'était le premier site du pays inscrit par l\'UNESCO.' },
    ],
    sources: ['UNESCO, Centre du patrimoine mondial : « Les ruines de Loropéni » (inscription 2009).', 'Mise en récit sous forme de dialogue par l\'équipe Soalma.'],
    audio: {},
  },

  {
    id: 'tiebele',
    titre: 'Le python des murs de Tiébélé',
    type: 'Légende',
    peuple: 'Kassena',
    langue: 'kasem',
    lieu: { nom: 'Tiébélé', zone: 'Centre-Sud', lon: -0.9672, lat: 11.0964 },
    duree: 5,
    couleur: '#B4552F',
    accroche: 'Sur les cases de Tiébélé, les femmes peignent un serpent. Il rappelle la nuit où il a sauvé le village.',
    resume: 'Pourquoi le python est-il respecté et dessiné sur les murs de la cour royale de Tiébélé ? Une légende kassena le raconte.',
    couverture: 0,
    tableaux: [
      {
        titre: 'La cour royale',
        scene: { sky: 'day', items: [
          { k: 'tiebele', x: 520, s: 1.3 }, { k: 'tiebele', x: 1080, round: true, s: 1.2 },
          { k: 'tiebele', x: 1350, layer: 'mid', s: 1.1 },
          { k: 'woman', x: 820 },
        ] },
        texte: [
          'Dans le sud du Burkina Faso, près de la frontière du Ghana, Tiébélé abrite la cour royale des Kassena. Ses cases de terre sont couvertes de dessins : des lignes, des triangles, des losanges, peints en noir, en blanc et en rouge.',
          'Ce sont les femmes qui les peignent, ensemble, après la saison des pluies. Elles se transmettent les gestes et les motifs de mère en fille.',
        ],
      },
      {
        titre: 'Le serpent de la nuit',
        scene: { sky: 'night', items: [
          { k: 'tiebele', x: 300, layer: 'mid', s: 1.2 }, { k: 'tiebele', x: 560, layer: 'mid', round: true },
          { k: 'python', x: 900, s: 1.4 },
          { k: 'crowd', x: 1350, y: 700, n: 5, w: 200, s: 0.6 },
        ] },
        texte: [
          'Parmi les motifs, l\'un revient souvent : le python. On raconte qu\'une nuit, il y a très longtemps, des ennemis approchaient du village pendant que tout le monde dormait.',
          'Un grand python sortit alors des broussailles et s\'étendit en travers du chemin. Les assaillants, effrayés, firent demi-tour, persuadés que le village était protégé par des forces invisibles.',
        ],
      },
      {
        titre: 'Peindre pour se souvenir',
        scene: { sky: 'day', items: [
          { k: 'tiebele', x: 760, s: 1.5 },
          { k: 'woman', x: 460 }, { k: 'woman', x: 1080, flip: true }, { k: 'child', x: 1180 },
        ] },
        texte: [
          'Pour ne pas oublier, les femmes dessinèrent le serpent sur les murs. Avec le temps, d\'autres motifs l\'ont rejoint, inspirés des calebasses, des nattes tressées ou des écailles. Chacun porte une histoire ou une leçon.',
          'Les couleurs viennent de la terre : argile, kaolin, latérite. Pour que les dessins résistent à la pluie, on les recouvre d\'un vernis naturel préparé avec les gousses du néré.',
        ],
      },
      {
        titre: 'Une bibliothèque de terre',
        scene: { sky: 'dusk', items: [
          { k: 'tiebele', x: 420, s: 1.2 }, { k: 'tiebele', x: 800, round: true, s: 1.3 }, { k: 'tiebele', x: 1200, s: 1.1 },
        ] },
        texte: [
          'Tiébélé ressemble à une bibliothèque dont les livres seraient des murs. Ceux qui savent les lire y retrouvent l\'histoire du village, ses croyances et ses règles de vie.',
          'Quand une peinture s\'efface, on la refait. C\'est ainsi que la mémoire reste vivante : en la recommençant.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Au réveil, les villageois découvrent le python. Que doivent-ils faire ?',
      options: [
        { label: 'Le tuer par prudence', reponse: 'Des étrangers l\'auraient fait. Mais les anciens avaient compris ce qui s\'était passé cette nuit-là.' },
        { label: 'Le laisser repartir en paix', reponse: 'C\'est ce qu\'ils firent, et ils décidèrent de ne plus jamais faire de mal aux pythons.' },
        { label: 'L\'enfermer', reponse: 'On n\'enferme pas un protecteur. Les anciens le laissèrent partir.' },
      ],
    },
    morale: 'La mémoire d\'un peuple vit aussi longtemps qu\'on prend la peine de la repeindre.',
    glossaire: [
      { mot: 'Kassena', langue: 'Kasem', sens: 'Peuple du sud du Burkina Faso et du nord du Ghana.' },
      { mot: 'Néré', langue: 'Français d\'Afrique', sens: 'Arbre de savane. Ses graines servent aussi à préparer le soumbala.' },
      { mot: 'Kaolin', langue: 'Français', sens: 'Argile blanche utilisée comme pigment.' },
    ],
    quiz: [
      { q: 'Qui peint les murs de Tiébélé ?', choix: ['Les hommes', 'Les femmes', 'Des artisans venus d\'ailleurs'], bonne: 1, explication: 'Le savoir-faire se transmet entre femmes, de génération en génération.' },
      { q: 'Pourquoi le python est-il respecté selon la légende ?', choix: ['Il a protégé le village', 'Il apporte la pluie', 'Il garde l\'or'], bonne: 0, explication: 'Il a fait fuir les ennemis pendant la nuit.' },
    ],
    sources: ['Tradition kassena de la cour royale de Tiébélé.', 'Les significations des motifs varient selon les familles et les interlocuteurs.'],
    audio: {},
  },

  {
    id: 'karfiguela',
    titre: 'Le chasseur des cascades',
    type: 'Conte',
    peuple: 'Dioula et Gouin',
    langue: 'dioula',
    lieu: { nom: 'Cascades de Karfiguéla, Banfora', zone: 'Cascades', lon: -4.81, lat: 10.69 },
    duree: 5,
    couleur: '#4A90A4',
    accroche: 'Au pied des cascades, une biche lève la tête et parle au chasseur qui la vise.',
    resume: 'Bakary, chasseur dozo trop gourmand, rencontre la gardienne des eaux de Karfiguéla. Elle lui propose un pacte.',
    adaptation: true,
    couverture: 1,
    tableaux: [
      {
        titre: 'Le meilleur chasseur',
        scene: { sky: 'day', ground: 'rock', items: [
          { k: 'waterfall', x: 760, layer: 'mid', s: 1.3 },
          { k: 'ronier', x: 1380, layer: 'mid' },
          { k: 'hunter', x: 1120 }, { k: 'grass', x: 300, w: 400 },
        ] },
        texte: [
          'Près de Banfora, là où la rivière dévale les rochers en cascades, vivait un chasseur nommé Bakary. C\'était un dozo, membre de la confrérie des chasseurs, réputé pour son adresse et sa connaissance de la brousse.',
          'Mais Bakary aimait trop la chasse. Il tuait plus qu\'il ne pouvait manger, et vendait le reste au marché.',
        ],
      },
      {
        titre: 'La biche au bord de l\'eau',
        scene: { sky: 'dusk', ground: 'rock', items: [
          { k: 'waterfall', x: 800, layer: 'mid', s: 1.3 },
          { k: 'pond', x: 800, y: 760, w: 700 },
          { k: 'doe', x: 980, flip: true }, { k: 'archer', x: 380 },
        ] },
        texte: [
          'Un soir, au pied des cascades, il aperçut une biche qui buvait. Il banda son arc. La biche leva la tête et le regarda droit dans les yeux. Puis elle parla.',
          '« Bakary, je suis la gardienne de cette eau. Chaque animal que tu tues sans besoin est un enfant que je perds. Si tu continues, la brousse se videra, et tes enfants n\'auront plus rien à chasser. »',
        ],
      },
      {
        titre: 'Le pacte du chasseur',
        scene: { sky: 'night', ground: 'rock', items: [
          { k: 'waterfall', x: 800, layer: 'mid', s: 1.3 },
          { k: 'pond', x: 800, y: 760, w: 700 },
          { k: 'doe', x: 940, flip: true }, { k: 'hunter', x: 620 },
        ] },
        texte: [
          '« Ne chasse que ce dont ta famille a besoin. Épargne les femelles qui portent leurs petits. Et ne chasse jamais près de cette eau. En échange, ta famille ne manquera de rien. »',
          'Bakary accepta. Il revint au village, réunit les autres chasseurs et leur transmit les paroles de la gardienne.',
        ],
      },
      {
        titre: 'La brousse pleine',
        scene: { sky: 'dawn', items: [
          { k: 'waterfall', x: 300, layer: 'far', s: 1.2 },
          { k: 'hut', x: 1250, layer: 'mid' }, { k: 'hut', x: 1380, layer: 'mid' },
          { k: 'doe', x: 600, layer: 'mid' }, { k: 'doe', x: 720, layer: 'mid', s: 0.8 },
          { k: 'hunter', x: 1000 },
        ] },
        texte: [
          'Les années passèrent. Autour de Banfora, la brousse resta pleine d\'animaux, les cascades continuèrent de chanter, et les chasseurs furent respectés pour leur sagesse autant que pour leur adresse.',
          'Les dozos disent encore que le bon chasseur n\'est pas celui qui tue le plus, mais celui qui sait quand s\'arrêter.',
        ],
      },
    ],
    choix: {
      apres: 1,
      question: 'Que doit faire Bakary ?',
      options: [
        { label: 'Tirer quand même', reponse: 'Sa main trembla. Une biche qui parle n\'est pas un gibier comme les autres. Il baissa son arc.' },
        { label: 'Baisser son arc et écouter', reponse: 'C\'est ce qu\'il fit. La gardienne lui proposa alors un pacte.' },
        { label: 'S\'enfuir', reponse: 'Il recula d\'un pas, mais la voix le retint : « N\'aie pas peur. Écoute-moi. »' },
      ],
    },
    morale: 'La brousse nourrit celui qui la respecte.',
    glossaire: [
      { mot: 'Dozo', langue: 'Dioula', sens: 'Chasseur traditionnel, membre d\'une confrérie aux règles strictes.' },
      { mot: 'Karfiguéla', langue: 'Toponyme', sens: 'Village près de Banfora, connu pour ses cascades.' },
    ],
    quiz: [
      { q: 'Qui est la biche ?', choix: ['Une sorcière', 'La gardienne de l\'eau', 'La femme de Bakary'], bonne: 1, explication: 'Elle veille sur les animaux qui vivent autour des cascades.' },
      { q: 'Selon les dozos, qu\'est-ce qu\'un bon chasseur ?', choix: ['Celui qui tue le plus', 'Celui qui sait quand s\'arrêter', 'Celui qui chasse seul'], bonne: 1, explication: 'La mesure fait partie des règles de la confrérie.' },
    ],
    sources: ['Adaptation libre inspirée des récits de chasseurs dozos et des génies protecteurs de l\'eau dans l\'Ouest du Burkina Faso.'],
    audio: { dioula: 'assets/audio/karfiguela-dioula.mp3' },
  },
];

export const getConte = (id) => CONTES.find((c) => c.id === id);

/** Ajoute les espaces insécables de la typographie française. */
export function typo(str) {
  return str
    .replace(/« /g, '« ')
    .replace(/ »/g, ' »')
    .replace(/ ([:;!?])/g, ' $1');
}
