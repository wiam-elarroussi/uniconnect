<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\Resource;
use App\Models\Story;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoContentSeeder extends Seeder
{
    private int $uniId = 1;

    public function run(): void
    {
        $this->downloadImages();
        $this->seedAvatars();
        $this->seedStories();
        $this->seedResources();
        $this->seedMorePosts();
    }

    // ── Download helper ────────────────────────────────────────────────────────
    private function fetch(string $url): ?string
    {
        $ctx = stream_context_create(['http' => [
            'timeout'         => 15,
            'follow_location' => true,
            'max_redirects'   => 5,
            'user_agent'      => 'Mozilla/5.0',
        ]]);
        $data = @file_get_contents($url, false, $ctx);
        return $data ?: null;
    }

    private function save(string $dir, string $name, string $url): bool
    {
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $path = $dir . '/' . $name;
        if (file_exists($path)) { echo "EXISTS: $name\n"; return true; }
        $data = $this->fetch($url);
        if ($data) { file_put_contents($path, $data); echo "OK: $name\n"; return true; }
        echo "FAIL: $name\n"; return false;
    }

    // ── 1. Download images ─────────────────────────────────────────────────────
    private function downloadImages(): void
    {
        echo "\n=== Downloading images ===\n";
        $avatarDir = storage_path('app/public/avatars');
        $storyDir  = storage_path('app/public/stories');

        // Avatar photos from pravatar (real-looking faces, numbered 1-70)
        $avatarMap = [
            'avatar_yassine.jpg'   => 'https://i.pravatar.cc/200?img=11',
            'avatar_fatima.jpg'    => 'https://i.pravatar.cc/200?img=47',
            'avatar_hamza.jpg'     => 'https://i.pravatar.cc/200?img=15',
            'avatar_nadia.jpg'     => 'https://i.pravatar.cc/200?img=49',
            'avatar_mehdi.jpg'     => 'https://i.pravatar.cc/200?img=12',
            'avatar_salma.jpg'     => 'https://i.pravatar.cc/200?img=44',
            'avatar_omar.jpg'      => 'https://i.pravatar.cc/200?img=13',
            'avatar_rim.jpg'       => 'https://i.pravatar.cc/200?img=48',
            'avatar_moussa.jpg'    => 'https://i.pravatar.cc/200?img=20',
            'avatar_aminata.jpg'   => 'https://i.pravatar.cc/200?img=56',
        ];
        foreach ($avatarMap as $name => $url) {
            $this->save($avatarDir, $name, $url);
        }

        // Story images from picsum
        $storyMap = [
            'story_campus.jpg'    => 'https://picsum.photos/id/1043/600/1000',
            'story_code.jpg'      => 'https://picsum.photos/id/1/600/1000',
            'story_sport.jpg'     => 'https://picsum.photos/id/863/600/1000',
            'story_nature.jpg'    => 'https://picsum.photos/id/15/600/1000',
            'story_city.jpg'      => 'https://picsum.photos/id/29/600/1000',
            'story_tech.jpg'      => 'https://picsum.photos/id/2/600/1000',
            'story_books.jpg'     => 'https://picsum.photos/id/24/600/1000',
            'story_food.jpg'      => 'https://picsum.photos/id/431/600/1000',
            'story_office.jpg'    => 'https://picsum.photos/id/60/600/1000',
            'story_friends.jpg'   => 'https://picsum.photos/id/1062/600/1000',
        ];
        foreach ($storyMap as $name => $url) {
            $this->save($storyDir, $name, $url);
        }
    }

    // ── 2. Assign avatar photos to ~10 users ────────────────────────────────
    private function seedAvatars(): void
    {
        echo "\n=== Assigning avatars ===\n";

        $mapping = [
            'yassine.elamrani@supmti.ma'  => 'avatar_yassine.jpg',
            'fatima.benali@supmti.ma'     => 'avatar_fatima.jpg',
            'hamza.ouahabi@supmti.ma'     => 'avatar_hamza.jpg',
            'nadia.tazi@supmti.ma'        => 'avatar_nadia.jpg',
            'mehdi.bakkali@supmti.ma'     => 'avatar_mehdi.jpg',
            'salma.lahlou@supmti.ma'      => 'avatar_salma.jpg',
            'omar.cherkaoui@supmti.ma'    => 'avatar_omar.jpg',
            'rim.alaoui@supmti.ma'        => 'avatar_rim.jpg',
            'moussa.diallo@supmti.ma'     => 'avatar_moussa.jpg',
            'aminata.kone@supmti.ma'      => 'avatar_aminata.jpg',
        ];

        foreach ($mapping as $email => $file) {
            $user = User::where('email', $email)->first();
            if (!$user) { echo "NOT FOUND: $email\n"; continue; }
            if (file_exists(storage_path("app/public/avatars/$file"))) {
                $user->update(['avatar_path' => "avatars/$file"]);
                echo "AVATAR SET: $email\n";
            } else {
                echo "FILE MISSING: $file\n";
            }
        }
    }

    // ── 3. Create stories ──────────────────────────────────────────────────────
    private function seedStories(): void
    {
        echo "\n=== Creating stories ===\n";

        $storyUsers = User::where('university_id', $this->uniId)
            ->where('role', 'user')
            ->limit(5)
            ->get();

        $storyData = [
            // [user_index, media_file, body, hours_ago]
            [0, 'story_campus.jpg',  'Belle journee sur le campus SupMTI ! ☀️',           2],
            [0, 'story_code.jpg',    'Nuit blanche sur mon projet Laravel... mais ca avance ! 💻', 10],
            [1, 'story_sport.jpg',   'Entrainement du matin avant les cours 💪',           1],
            [1, 'story_nature.jpg',  'Week-end ressourçant en dehors de Rabat 🌿',         8],
            [2, 'story_tech.jpg',    'Mon setup de dev apres 3 ans detudes 🖥️',           3],
            [2, 'story_city.jpg',    'Casablanca pour le hackathon DevMaroc ! 🚀',         15],
            [3, 'story_books.jpg',   'Revisions intensives avant les partiels 📚',         5],
            [3, 'story_food.jpg',    'Pause dejeuner bien meritee avec les copains 🥗',    20],
            [4, 'story_office.jpg',  'Premier jour de mon stage chez InTech Maroc ! 🎉',  4],
            [4, 'story_friends.jpg', 'Sortie de groupe apres la soutenance — on a reussi !', 12],
        ];

        foreach ($storyData as [$idx, $media, $body, $hoursAgo]) {
            $user = $storyUsers[$idx] ?? null;
            if (!$user) continue;

            $mediaFile = storage_path("app/public/stories/$media");
            $mediaPath = file_exists($mediaFile) ? "stories/$media" : null;

            Story::create([
                'user_id'       => $user->id,
                'university_id' => $this->uniId,
                'body'          => $body,
                'media_path'    => $mediaPath,
                'expires_at'    => now()->addHours(24 - $hoursAgo),
                'created_at'    => now()->subHours($hoursAgo),
                'updated_at'    => now()->subHours($hoursAgo),
            ]);
            echo "STORY: {$user->name} — $body\n";
        }
    }

    // ── 4. Library resources ───────────────────────────────────────────────────
    private function seedResources(): void
    {
        echo "\n=== Creating resources ===\n";
        $admin = User::where('email', 'admin@supmti.ma')->first();
        $teacher = User::where('email', 'rachid.bensouda@supmti.ma')->first();
        $student = User::where('university_id', $this->uniId)->where('role', 'user')->first();

        $resources = [
            [
                'title'       => 'Cours complet : Algorithmes et Structures de Donnees',
                'link'        => 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
                'category'    => 'cours',
                'filiere'     => 'Informatique',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
            [
                'title'       => 'Introduction au Machine Learning avec Python (Scikit-Learn)',
                'link'        => 'https://scikit-learn.org/stable/tutorial/index.html',
                'category'    => 'tutoriel',
                'filiere'     => 'Intelligence Artificielle',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
            [
                'title'       => 'Documentation officielle Laravel 11',
                'link'        => 'https://laravel.com/docs/11.x',
                'category'    => 'documentation',
                'filiere'     => 'Developpement Web',
                'user_id'     => $student?->id ?? $admin->id,
            ],
            [
                'title'       => 'Roadmap developpeur Full Stack 2026',
                'link'        => 'https://roadmap.sh/full-stack',
                'category'    => 'guide',
                'filiere'     => 'Developpement Web',
                'user_id'     => $student?->id ?? $admin->id,
            ],
            [
                'title'       => 'Cours Reseaux : Protocoles TCP/IP et Routage',
                'link'        => 'https://www.coursera.org/learn/computer-networking',
                'category'    => 'cours',
                'filiere'     => 'Reseaux',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
            [
                'title'       => 'Guide Cybersecurite : OWASP Top 10 explique',
                'link'        => 'https://owasp.org/www-project-top-ten/',
                'category'    => 'guide',
                'filiere'     => 'Cybersecurite',
                'user_id'     => $admin->id,
            ],
            [
                'title'       => 'Tutoriel Docker & Kubernetes pour debutants',
                'link'        => 'https://docs.docker.com/get-started/',
                'category'    => 'tutoriel',
                'filiere'     => 'Cloud & DevOps',
                'user_id'     => $student?->id ?? $admin->id,
            ],
            [
                'title'       => 'Methode Agile Scrum : guide pratique pour equipes etudiantes',
                'link'        => 'https://www.scrum.org/resources/what-is-scrum',
                'category'    => 'guide',
                'filiere'     => 'Gestion de Projet',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
            [
                'title'       => 'Mathematiques pour l IA : algebre lineaire et calcul',
                'link'        => 'https://www.khanacademy.org/math/linear-algebra',
                'category'    => 'cours',
                'filiere'     => 'Mathematiques',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
            [
                'title'       => 'Preparation entretien technique : 100 questions algorithmiques',
                'link'        => 'https://leetcode.com/study-plan/algorithm/',
                'category'    => 'exercices',
                'filiere'     => 'Informatique',
                'user_id'     => $student?->id ?? $admin->id,
            ],
            [
                'title'       => 'React.js Documentation et tutoriels officiels',
                'link'        => 'https://react.dev/learn',
                'category'    => 'documentation',
                'filiere'     => 'Developpement Web',
                'user_id'     => $student?->id ?? $admin->id,
            ],
            [
                'title'       => 'Base de donnees : cours SQL complet avec exercices',
                'link'        => 'https://www.w3schools.com/sql/',
                'category'    => 'cours',
                'filiere'     => 'Bases de Donnees',
                'user_id'     => $teacher?->id ?? $admin->id,
            ],
        ];

        foreach ($resources as $r) {
            Resource::create([
                'title'         => $r['title'],
                'link'          => $r['link'],
                'file_path'     => null,
                'file_name'     => null,
                'category'      => $r['category'],
                'filiere'       => $r['filiere'],
                'user_id'       => $r['user_id'],
                'university_id' => $this->uniId,
            ]);
            echo "RESOURCE: {$r['title']}\n";
        }
    }

    // ── 5. More channel posts ──────────────────────────────────────────────────
    private function seedMorePosts(): void
    {
        echo "\n=== Creating more posts ===\n";
        $users = User::where('university_id', $this->uniId)->where('role', 'user')->pluck('id')->toArray();
        $ch = fn ($slug) => Channel::where('slug', $slug)->where('university_id', $this->uniId)->first();

        $make = function ($body, $userId, $channel, $img = null, $daysAgo = 0) {
            $p = Post::create([
                'body'          => $body,
                'user_id'       => $userId,
                'university_id' => $this->uniId,
                'channel_id'    => $channel?->id,
                'created_at'    => now()->subDays($daysAgo)->subHours(rand(0, 23)),
                'updated_at'    => now()->subDays($daysAgo),
            ]);
            if ($img && file_exists(storage_path("app/public/posts/$img"))) {
                PostMedia::create(['post_id' => $p->id, 'path' => "posts/$img", 'position' => 0]);
            }
            echo "POST: " . substr($body, 0, 55) . "...\n";
        };

        $u = fn () => $users[array_rand($users)];

        // Dev Web
        $make('Conseil pour les debutants en dev web : ne sautez pas les fondamentaux HTML/CSS avant React. J ai perdu 3 mois a debugger du code dont je ne comprenais pas les bases.', $u(), $ch('dev-web'), null, 1);
        $make('Mon portfolio est en ligne ! 6 projets universitaires + 2 projets perso. Stack : React, Laravel, TailwindCSS. Feedback bienvenu avant que je le soumette aux recruteurs.', $u(), $ch('dev-web'), 'post_dev_web.jpg', 0);

        // IA
        $make('Partage de notebook Jupyter : regression lineaire et classification sur un dataset de notes etudiantes marocaines. Resultat surprenant : le temps de sommeil predit mieux la reussite que le temps de revision.', $u(), $ch('intelligence-artificielle'), 'post_ia.jpg', 2);
        $make('GPT-4o vs Claude 3.5 pour la generation de code Python : comparaison sur 50 problemes algorithmiques. Claude gagne sur la qualite du code mais GPT est plus rapide sur les explications.', $u(), $ch('intelligence-artificielle'), null, 4);

        // Cyber
        $make('Certifications recommandees pour debuter en cybersecurite au Maroc en 2026 : CompTIA Security+ (reconnu), CEH (plus pratique), eJPT pour vraiment debuter. Budget total : ~3000 MAD pour les trois.', $u(), $ch('cybersecurite'), 'post_cyber.jpg', 3);

        // Maths
        $make('Aide urgente : examen de probabilites demain et je bloque sur les chaines de Markov. Quelqu un peut m expliquer la difference entre etats transitoires et etats absorbants avec un exemple concret ?', $u(), $ch('maths-algo'), null, 0);
        $make('Solution des exercices du chapitre 4 (transformee de Fourier) — corrige complet disponible. Verifiez vos reponses avant l exam de jeudi.', $u(), $ch('maths-algo'), 'post_maths.jpg', 1);

        // Entrepreneuriat
        $make('Liste des incubateurs et accelerateurs qui acceptent les projets d etudiants au Maroc : StartGate, Maroc Numeric Fund, Hub Africa, UM6P Ventures. Criteres et delais de candidature dans le thread.', $u(), $ch('entrepreneuriat'), null, 5);

        // Stages
        $make('Retour sur mon entretien chez Capgemini Maroc : 3 rounds (RH, technique, manager). Questions posees : algo sur les graphes, design pattern Observer, et un cas sur l optimisation SQL. Je suis pris !', $u(), $ch('opportunites-stages'), 'post_stage.jpg', 1);
        $make('Template CV et lettre de motivation pour postuler en stage tech au Maroc — optimises pour les recruteurs locaux (format A4, pas de photo obligatoire, mettre le niveau de darija c est un plus).', $u(), $ch('opportunites-stages'), null, 7);

        // Petites annonces
        $make('Cherche binome pour projet reseaux (simulation Packet Tracer). Mon niveau : intermediaire Cisco, bonne maitrise du routage statique. Disponible soirs et week-ends. Filiere : Reseaux & Securite L3.', $u(), $ch('petites-annonces'), null, 2);
        $make('Vends livres de 1ere annee : Maths L1 (Analyse + Algebre), Physique generale, Anglais technique. Prix unitaire 30 MAD ou 100 MAD les 4. Tres bon etat. Contactez en MP.', $u(), $ch('petites-annonces'), null, 10);

        // Vie etudiante
        $make('Retour de l echange Erasmus a Lyon — 6 mois incroyables ! Si vous hesitez a postuler, foncez. Bourse Erasmus + hebergement CROUS = viable financierement meme sans famille aisee.', $u(), $ch('vie-etudiante'), 'post_campus1.jpg', 15);

        // Logement
        $make('Recherche chambre ou colocation pres du campus pour la rentree de septembre. Budget max 2000 MAD/mois. Serieux et discret. Contact MP avec photos et details.', $u(), $ch('logement-transport'), null, 3);

        // Langues
        $make('Ressource gratuite pour l anglais technique en informatique : le channel YouTube "TechEnglish" + le livre "English for IT Professionals". Ces deux ressources m ont permis de passer mon entretien chez une boite US.', $u(), $ch('langues-communication'), null, 6);

        // Cloud
        $make('Mon projet de fin d annee deploye sur AWS : API REST Laravel + React frontend sur S3 + CloudFront + RDS MySQL. Cout mensuel en dehors des credits gratuits : environ 8 USD. Tutoriel complet en commentaire.', $u(), $ch('cloud-devops'), 'post_cloud.jpg', 4);

        // Marketing
        $make('Analyse : pourquoi les startups marocaines echouent sur les reseaux sociaux. Etude de 20 cas sur 2 ans. Principal probleme : copier les strategies occidentales sans adapter au contexte local (darija, culture, UX).', $u(), $ch('marketing-digital'), 'post_marketing.jpg', 8);

        // Reseaux
        $make('Projet de simulation complete : architecture reseau d une PME marocaine avec Packet Tracer. VLAN, DHCP, NAT, routage inter-VLAN et securite de base. Fichier .pkt disponible sur demande.', $u(), $ch('reseaux-systemes'), 'post_reseau.jpg', 5);

        // BDD
        $make('Optimisation de requete SQL : comment j ai reduit le temps de reponse de 4s a 80ms sur une table de 2 millions de lignes. Technique : index composite + EXPLAIN ANALYZE + reecriture des jointures.', $u(), $ch('bases-de-donnees'), 'post_bdd.jpg', 3);

        // Sport
        $make('Resultats du tournoi inter-filieres : GL 3-1 IA en finale ! Belle ambiance et fair-play. Photos sur le drive de l asso. Prochaine edition en novembre — commencez a former vos equipes.', $u(), $ch('sport-bien-etre'), 'post_sport.jpg', 0);

        // PFE
        $make('Soutenance PFE terminee avec mention Tres Bien ! Sujet : detection d anomalies reseau par deep learning pour une banque marocaine. Jury impressionne par les resultats (97.3% de precision). Merci a ceux qui m ont soutenu.', $u(), $ch('pfe'), 'post_pfe.jpg', 2);
    }
}
