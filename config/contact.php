<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Destinataire des messages « Contact » (page d’accueil)
    |--------------------------------------------------------------------------
    |
    | Par défaut : même adresse que l’expéditeur système (MAIL_FROM_ADDRESS).
    |
    */

    'mail_to' => env('CONTACT_MAIL_TO', env('MAIL_FROM_ADDRESS', 'hello@example.com')),

];
