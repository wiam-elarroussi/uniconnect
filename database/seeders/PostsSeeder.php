<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostsSeeder extends Seeder
{
    public function run(): void
    {
        $uniId = 1;
        $users = User::where('university_id', $uniId)->where('role', 'user')->pluck('id')->toArray();
        $admin = User::where('email', 'admin@supmti.ma')->first();

        $ch = fn ($slug) => Channel::where('slug', $slug)->where('university_id', $uniId)->first();

        $make = function ($body, $userId, $channel, $img = null, $daysAgo = 0) use ($uniId) {
            $p = Post::create([
                'body'          => $body,
                'user_id'       => $userId,
                'university_id' => $uniId,
                'channel_id'    => $channel ? $channel->id : null,
                'created_at'    => now()->subDays($daysAgo)->subHours(rand(0, 20)),
                'updated_at'    => now()->subDays($daysAgo),
            ]);
            if ($img) {
                PostMedia::create(['post_id' => $p->id, 'path' => 'posts/' . $img, 'position' => 0]);
            }
            echo 'POST: ' . substr($body, 0, 60) . PHP_EOL;
        };

        $u = fn () => $users[array_rand($users)];

        // Annonces Officielles
        $make('Bienvenue a tous les etudiants SupMTI ! Le campus est desormais sur UniConnect. Suivez les canaux qui vous interessent pour rester informes. Bonne rentree a tous !', $admin->id, $ch('annonces-officielles'), 'post_annonce.jpg', 5);
        $make('Rappel important : la soutenance des projets de fin de semestre aura lieu les 28 et 29 mai. Tous les etudiants de 3eme annee doivent deposer leur rapport avant le 20 mai. Bon courage !', $admin->id, $ch('annonces-officielles'), null, 3);

        // Vie etudiante
        $make('Soiree integration des nouveaux etudiants ce vendredi ! Theme : Tech & Tradition. Buffet marocain + DJ set. Entree libre pour tous les etudiants SupMTI.', $u(), $ch('vie-etudiante'), 'post_campus1.jpg', 9);
        $make('Qui veut former un groupe de revision pour la semaine des partiels ? On cherche 4-5 personnes motivees, preference pour les filieres GL/IA. On travaille a la bibliotheque ou en visio.', $u(), $ch('vie-etudiante'), 'post_campus2.jpg', 3);

        // Dev Web
        $make('Je cherche des co-equipiers pour le hackathon DevMaroc 2026 prevu le mois prochain a Casablanca. On a besoin d un front-end React et un back-end Node. Interesses ? Commentez ou envoyez un MP.', $u(), $ch('dev-web'), 'post_dev_web.jpg', 4);
        $make('Ressource du jour : le cours complet de Tailwind CSS v4 est disponible gratuitement sur YouTube. Indispensable pour tous ceux qui font du dev web en 2026. Lien en commentaire.', $u(), $ch('dev-web'), null, 2);
        $make('Mon premier projet Laravel + React deploye ! Une app de gestion des emplois du temps pour notre promo. Merci a ceux qui ont aide a debugger. Open source sur GitHub.', $u(), $ch('dev-web'), 'post_dev_web.jpg', 1);

        // Dev Mobile
        $make('Flutter vs React Native en 2026 : mon avis apres avoir developpe une app des deux cotes. Flutter gagne en perf et UX, mais le marche marocain recrute encore beaucoup de RN.', $u(), $ch('dev-mobile'), 'post_dev_mobile.jpg', 6);
        $make('Atelier Flutter ce vendredi a 14h en salle B204 ! On va construire une app de suivi de presence de A a Z. Amenez vos laptops, l environnement de dev doit etre installe.', $u(), $ch('dev-mobile'), null, 1);

        // IA
        $make('Resultats impressionnants avec notre modele de detection de plagiat en NLP. Entraine sur des memoires academiques marocains, il atteint 94% de precision. On cherche des feedbacks !', $u(), $ch('intelligence-artificielle'), 'post_ia.jpg', 7);
        $make('Le prof propose un groupe de lecture sur le paper Attention Is All You Need (Transformers). Premiere seance jeudi a 17h. Niveau requis : bases de Python + algebre lineaire.', $u(), $ch('intelligence-artificielle'), null, 2);

        // Cybersecurite
        $make('CTF writeup : comment j ai resolu le challenge ReverseMe du Morocco CyberChallenge 2026. Buffer overflow classique avec protection ASLR contournee via une fuite d adresse.', $u(), $ch('cybersecurite'), 'post_cyber.jpg', 5);
        $make('ATTENTION : Phishing en circulation ciblant les adresses @supmti.ma. L email imite le portail pedagogique et demande vos identifiants. Ne cliquez PAS sur le lien suspect.', $admin->id, $ch('cybersecurite'), null, 1);

        // Reseaux
        $make('Partage : mes notes completes du cours Reseaux Avances (OSPF, BGP, MPLS) en PDF. J ai aussi ajoute des exercices corriges des examens 2024-2025. Disponible sur le drive de la promo.', $u(), $ch('reseaux-systemes'), 'post_reseau.jpg', 3);
        $make('Quelqu un a reussi a configurer un VPN WireGuard sur Raspberry Pi ? Je bloque sur la gestion des peers dynamiques. Mon config est en commentaire.', $u(), $ch('reseaux-systemes'), null, 2);

        // BDD
        $make('Comparaison PostgreSQL vs MySQL pour les projets academiques en 2026. PostgreSQL gagne sur tout sauf la simplicite de configuration. Voici mes benchmarks sur 1 million de lignes.', $u(), $ch('bases-de-donnees'), 'post_bdd.jpg', 4);
        $make('Schema de base de donnees pour un systeme de gestion universitaire complet : UML + SQL dump disponible. Parfait comme point de depart pour un PFE ou projet de semestre.', $u(), $ch('bases-de-donnees'), null, 6);

        // Cloud
        $make('AWS offre 12 mois gratuits + des credits speciaux pour les etudiants via AWS Educate. J ai deploye mon projet PFE sur EC2 + RDS pour 0 dirham. Voici comment s inscrire et maximiser les credits.', $u(), $ch('cloud-devops'), 'post_cloud.jpg', 6);

        // Gestion de projet
        $make('Notre equipe a adopte Notion + GitHub Projects pour gerer notre PFE en methode Scrum. Sprints de 2 semaines, daily async sur WhatsApp. 3 mois plus tard : livrable a temps et client satisfait.', $u(), $ch('gestion-projet'), 'post_projet.jpg', 8);

        // Entrepreneuriat
        $make('Nous avons ete selectionnes pour le programme d incubation StartGate Maroc avec notre startup EdTech ! 6 mois d accompagnement, 50k MAD de financement seed. Questions ? Je suis disponible.', $u(), $ch('entrepreneuriat'), 'post_startup.jpg', 10);
        $make('Retour d experience : j ai tente de lancer une app de livraison sur campus pendant mes etudes. Voici ce qui a marche, ce qui a echoue, et ce que je referais differemment.', $u(), $ch('entrepreneuriat'), null, 3);

        // Marketing
        $make('Cas pratique : comment Marjane a transforme sa strategie digitale en 2025. Analyse du tunnel de conversion, strategie social media et ROI des campagnes Meta Ads. Un vrai cas d ecole !', $u(), $ch('marketing-digital'), 'post_marketing.jpg', 5);

        // Maths
        $make('Fiches de revision pour l examen d Analyse Numerique de demain : methodes de Runge-Kutta, interpolation de Lagrange et decomposition LU. Bonne chance a tous !', $u(), $ch('maths-algo'), 'post_maths.jpg', 1);
        $make('Quelqu un peut m expliquer la difference intuitive entre gradient descent et gradient conjugue ? Le cours n est pas tres clair et l examen approche...', $u(), $ch('maths-algo'), null, 0);

        // PFE
        $make('Mon PFE : plateforme de e-learning adaptative basee sur l IA pour l OFPPT. Stack : Laravel + React + Python (FastAPI pour le moteur de recommandation). Presentation dans 3 semaines !', $u(), $ch('pfe'), 'post_pfe.jpg', 14);
        $make('Conseil pour la recherche de sujet PFE : contactez directement les entreprises tech marocaines. J ai eu mon stage PFE chez InTech en envoyant 20 emails personnalises. Taux de reponse : 40%.', $u(), $ch('pfe'), null, 7);

        // Stages
        $make('Offre de stage PFE confirmee chez OCP Digital Factory : developpeur full-stack React/Node. Duree 6 mois, indemnite 3000 MAD/mois. Postulez avant le 25 mai sur leur portail RH.', $u(), $ch('opportunites-stages'), 'post_stage.jpg', 2);
        $make('CIH Bank recrute des stagiaires en cybersecurite et developpement (Java Spring Boot). Duree 3 mois, basee a Casablanca. Profil : 3eme annee minimum. Dossier : CV + lettre de motivation.', $u(), $ch('opportunites-stages'), null, 4);

        // Sport
        $make('Tournoi de football inter-filieres samedi prochain au terrain du campus ! Inscriptions ouvertes jusqu a jeudi. Equipes de 7 joueurs, tarif 50 MAD par equipe. Qui est chaud ?', $u(), $ch('sport-bien-etre'), 'post_sport.jpg', 2);

        // Logement
        $make('Colocation disponible a 5 min du campus (Hay Riad) : chambre meublee, WiFi fibre, cuisine equipee. 1800 MAD/mois charges comprises. Preference etudiant SupMTI. Contactez en MP.', $u(), $ch('logement-transport'), 'post_logement.jpg', 6);

        // Langues
        $make('Club Anglais SupMTI : sessions de conversation chaque mercredi a 18h, salle A101. Tous niveaux acceptes. L objectif : etre a l aise en entretien technique en anglais avant la fin de l annee.', $u(), $ch('langues-communication'), null, 5);

        // Petites annonces
        $make('Vends MacBook Pro M1 13 pouces (2021) : 8Go RAM, 256Go SSD, excellent etat, batterie 95%. Prix : 9500 MAD ferme. Vendu avec chargeur original et housse. Contactez en MP pour voir l appareil.', $u(), $ch('petites-annonces'), null, 8);
    }
}
