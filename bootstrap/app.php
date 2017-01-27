<?php

use Monolog\Logger;
use Monolog\Handler\LogglyHandler;
use Monolog\Formatter\LogglyFormatter;
use Respect\Validation\Validator as v;

session_start();

require __DIR__ . '/../vendor/autoload.php';

// Environment variables
$dotenv = new Dotenv\Dotenv(realpath(__DIR__ . '/..'));
$dotenv->load();

$app = new \Slim\App([
    'settings' => [
        'displayErrorDetails' => true,
        'db' => [
            'driver' => 'mysql',
            'host' => getenv("DB_HOST"),
            'database' => getenv("DB_DATABASE"),
            'username' => getenv("DB_USERNAME"),
            'password' => getenv("DB_PASSWORD"),
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ]
    ],
]);


$container = $app->getContainer();

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection($container['settings']['db']);
$capsule->setAsGlobal();
$capsule->bootEloquent();
    
$container['db'] = function ($container) use ($capsule) {
    return $capsule;
};

$container['auth'] = function ($container) {
    return new \App\Auth\Auth;
};

$container['view'] = function ($container) {
    
    $view = new \Slim\Views\Twig(__DIR__ . '/../app/Views', [
        'cache' => false,
        'debug' => true
    ]);

    $view->addExtension(new \Slim\Views\TwigExtension(
        $container->router,
        $container->request->getUri()
    ));

    $view->getEnvironment()->addGlobal('auth', [
        'admin' => $container->auth->admin(),
        'check' => $container->auth->check(),
        'user' => $container->auth->user()
    ]);
    
    $view->addExtension(new \Twig_Extension_Debug());

    return $view;
};

// Monolog
$container['logger'] = function ($container) {
    $logger = new Monolog\Logger('web');
    // $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    // $logger->pushHandler(new Monolog\Handler\StreamHandler(__DIR__ . '/../log/app.log', Monolog\Logger::DEBUG));
    $logger->pushHandler(new LogglyHandler('e3675142-f8cc-4506-ae76-7c0becacbda5/tag/monolog', Logger::INFO));        
    return $logger;
};


$container['validator'] = function ($container) {
    return new App\Validation\Validator;
};

$container['HomeController'] = function ($container) {
    return new \App\Controllers\HomeController($container);
};

$container['StationController'] = function ($container) {
    return new \App\Controllers\StationController($container);
};

$container['AuthController'] = function ($container) {
    return new \App\Controllers\Auth\AuthController($container);
};

$container['PasswordController'] = function ($container) {
    return new \App\Controllers\Auth\PasswordController($container);
};

$container['csrf'] = function ($container) {
    return new \Slim\Csrf\Guard;
};

$app->add(new \App\Middleware\ValidationErrorsMiddleware($container));
$app->add(new \App\Middleware\OldInputMiddleware($container));
$app->add(new \App\Middleware\CsrfViewMiddleware($container));
$app->add($container->csrf);

v::with('App\\Validation\\Rules\\');

require __DIR__ . '/../app/routes.php';
