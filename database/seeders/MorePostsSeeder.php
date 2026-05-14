<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\User;
use Illuminate\Database\Seeder;

class MorePostsSeeder extends Seeder
{
    private int $uniId = 1;

    public function run(): void
    {
        $users = User::where('university_id', $this->uniId)->where('role', 'user')->pluck('id')->toArray();
        $admin = User::where('email', 'admin@supmti.ma')->first();
        $ch    = fn ($slug) => Channel::where('slug', $slug)->where('university_id', $this->uniId)->first();
        $u     = fn () => $users[array_rand($users)];

        $imgs = [
            'post_dev_web.jpg', 'post_dev_mobile.jpg', 'post_ia.jpg', 'post_cyber.jpg',
            'post_reseau.jpg',  'post_bdd.jpg',        'post_cloud.jpg', 'post_projet.jpg',
            'post_startup.jpg', 'post_marketing.jpg',  'post_maths.jpg', 'post_campus1.jpg',
            'post_campus2.jpg', 'post_stage.jpg',      'post_sport.jpg', 'post_pfe.jpg',
        ];
        $img = fn ($name) => file_exists(storage_path("app/public/posts/$name")) ? $name : null;

        $make = function ($body, $userId, $channel, $imgFile = null, $daysAgo = 0) use ($img) {
            $p = Post::create([
                'body'          => $body,
                'user_id'       => $userId,
                'university_id' => $this->uniId,
                'channel_id'    => $channel?->id,
                'created_at'    => now()->subDays($daysAgo)->subHours(rand(0, 22)),
                'updated_at'    => now()->subDays($daysAgo),
            ]);
            $resolved = $imgFile ? $img($imgFile) : null;
            if ($resolved) {
                PostMedia::create(['post_id' => $p->id, 'path' => "posts/$resolved", 'position' => 0]);
            }
            echo 'POST: ' . substr($body, 0, 60) . PHP_EOL;
        };

        // ── Dev Web ─────────────────────────────────────────────────────────────
        $make(
            'Thread : les 5 erreurs que j ai commises sur mon premier projet Laravel en equipe. Gestion des migrations en conflit, pas de .env.example, commits directs sur main... Lisez avant votre prochain projet.',
            $u(), $ch('dev-web'), 'post_dev_web.jpg', 3
        );
        $make(
            'TypeScript vs JavaScript en 2026 pour les projets academiques ? Mon prof dit JS suffit, mais toutes les offres de stage demandent TS. Votre experience ?',
            $u(), $ch('dev-web'), null, 1
        );

        // ── Dev Mobile ──────────────────────────────────────────────────────────
        $make(
            'Mon app Flutter de gestion de notes etudiantes est disponible sur le Play Store ! Developpee en 3 semaines, synchronisation Firebase, mode hors-ligne. Testez et laissez un avis.',
            $u(), $ch('dev-mobile'), 'post_dev_mobile.jpg', 2
        );
        $make(
            'Expo vs Flutter bare workflow : apres 2 projets avec chacun, je pars sur Flutter pour tout. Expo est parfait pour prototyper vite mais les limitations natives deviennent frustrant rapidement.',
            $u(), $ch('dev-mobile'), null, 5
        );

        // ── Intelligence Artificielle ────────────────────────────────────────────
        $make(
            'Projet IA : reconnaissance automatique de la langue (arabe darija / francais / anglais) dans les messages texte. Dataset constitue de 12 000 tweets marocains. Precision 91%. Code sur GitHub.',
            $u(), $ch('intelligence-artificielle'), 'post_ia.jpg', 6
        );
        $make(
            'Quelqu un travaille sur de la vision par ordinateur avec OpenCV ? Je cherche de l aide pour la detection de plaques d immatriculation marocaines. Les caracteres arabes posent probleme au modele.',
            $u(), $ch('intelligence-artificielle'), null, 2
        );

        // ── Cybersecurite ────────────────────────────────────────────────────────
        $make(
            'Writeup CTF : challenge de steganographie ou le flag etait cache dans les metadonnees EXIF d une photo de monument marocain. Technique : exiftool + strings + binwalk. Solution complete en commentaire.',
            $u(), $ch('cybersecurite'), 'post_cyber.jpg', 4
        );
        $make(
            'Rappel securite : si vous codez des APIs Laravel, activez TOUJOURS le rate limiting sur les routes d authentification. J ai teste notre portail etudiant et j ai pu faire 10 000 tentatives par minute sans blocage.',
            $u(), $ch('cybersecurite'), null, 1
        );

        // ── Reseaux & Systemes ───────────────────────────────────────────────────
        $make(
            'Atelier Wireshark ce mercredi : analyse de trafic reseau en direct, detection d anomalies et reconstruction de sessions HTTP. Salle informatique C301, 15h-17h. Places limitees a 20 etudiants.',
            $u(), $ch('reseaux-systemes'), 'post_reseau.jpg', 1
        );

        // ── Bases de Donnees ─────────────────────────────────────────────────────
        $make(
            'Comprendre les transactions ACID avec un exemple concret : virement bancaire entre deux comptes. Si vous avez eu du mal avec ce concept en cours, ce thread va tout clarifier avec du code SQL reel.',
            $u(), $ch('bases-de-donnees'), 'post_bdd.jpg', 7
        );

        // ── Cloud & DevOps ───────────────────────────────────────────────────────
        $make(
            'GitHub Actions pour les projets universitaires : pipeline CI/CD complet en 30 lignes de YAML. Tests automatiques, lint, build et deploiement sur VPS. Template disponible dans mon repo public.',
            $u(), $ch('cloud-devops'), 'post_cloud.jpg', 3
        );

        // ── Gestion de Projet ────────────────────────────────────────────────────
        $make(
            'Retour honnete sur notre projet de groupe de 5 personnes : ce qui a marche (daily standup de 10 min, tickets GitHub), ce qui a echoue (Google Docs pour le code, reunions de 2h sans agenda). Notes pour la prochaine fois.',
            $u(), $ch('gestion-projet'), 'post_projet.jpg', 9
        );

        // ── Entrepreneuriat ──────────────────────────────────────────────────────
        $make(
            'J ai interviewe 10 fondateurs de startups tech marocaines sur leurs premiers clients. Resultat commun : le premier client venait toujours du reseau personnel, jamais de la publicite. Votre reseau EST votre marche.',
            $u(), $ch('entrepreneuriat'), 'post_startup.jpg', 12
        );

        // ── Marketing Digital ────────────────────────────────────────────────────
        $make(
            'Tuto : creer une newsletter universitaire avec Brevo (ex-Sendinblue) en version gratuite. 300 emails/jour suffisent pour toute une promo. J ai lance la newsletter SupMTI Tech avec 180 abonnes en 2 semaines.',
            $u(), $ch('marketing-digital'), 'post_marketing.jpg', 4
        );

        // ── Mathematiques & Algo ─────────────────────────────────────────────────
        $make(
            'Visualisation interactive des algorithmes de tri (bubble, merge, quick, heap) en JavaScript. Super pour comprendre intuitvement la complexite O(n log n) vs O(n2). Lien dans les commentaires.',
            $u(), $ch('maths-algo'), 'post_maths.jpg', 8
        );

        // ── Stages & Opportunites ────────────────────────────────────────────────
        $make(
            'Maroc Telecom recrute 15 stagiaires PFE en 2026 : cybersecurite (5 postes), big data (4), dev mobile (3), DevOps (3). Candidature via leur portail RH. Indemnite 2500-3500 MAD selon filiere.',
            $u(), $ch('opportunites-stages'), 'post_stage.jpg', 2
        );
        $make(
            'Conseils pour negocier son indemnite de stage au Maroc : la fourchette habituelle est 1500-4000 MAD. Montrez votre valeur avec des projets concrets. Ne jamais accepter un stage non remunere en 3eme annee.',
            $u(), $ch('opportunites-stages'), null, 6
        );

        // ── Vie Etudiante ────────────────────────────────────────────────────────
        $make(
            'Conference "Tech & Emploi au Maroc 2026" organisee par le BDE SupMTI : 6 intervenants de Capgemini, OCP Digital, InTech et 2 startups. Inscription gratuite, jeudi prochain a 14h, amphi principal.',
            $admin->id, $ch('vie-etudiante'), 'post_campus2.jpg', 1
        );

        // ── Sport ────────────────────────────────────────────────────────────────
        $make(
            'Club de running SupMTI : sortie chaque mardi et jeudi a 7h du matin, depart devant le batiment principal. Distance : 5-8 km selon le niveau. Tous niveaux bienvenus, meme les grands debutants.',
            $u(), $ch('sport-bien-etre'), 'post_sport.jpg', 3
        );

        // ── PFE ─────────────────────────────────────────────────────────────────
        $make(
            'Guide complet : rediger le cahier des charges de son PFE en 10 pages qui impressionnent le jury. Structure, vocabulaire technique, diagrammes UML indispensables et erreurs a eviter. Partage gratuit, lien en commentaire.',
            $u(), $ch('pfe'), 'post_pfe.jpg', 5
        );

        echo PHP_EOL . 'Done. 20 posts created.' . PHP_EOL;
    }
}
