<?php

use App\Kernel;

$allowed = [
    'https://hotelartystow3.pl',
    'https://www.hotelartystow3.pl',
    'http://localhost:5001'
];

if(isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed))
{
    header("Access-Control-Allow-Origin: $_SERVER[HTTP_ORIGIN]");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, withCredentials');

    if($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
        die;
}

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
