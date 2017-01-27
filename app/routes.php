<?php

use App\Middleware\AuthMiddleware;
use App\Middleware\GuestMiddleware;

$app->get('/', 'AuthController:checkSignIn');

$app->group('', function () {
    
    $this->get('/auth/signup', 'AuthController:getSignUp')->setName('auth.signup');
    $this->post('/auth/signup', 'AuthController:postSignUp');

    $this->get('/auth/signin', 'AuthController:getSignIn')->setName('auth.signin');
    $this->post('/auth/signin', 'AuthController:postSignIn');

    $this->get('/auth/forgot', 'PasswordController:getForgotPassword')->setName('auth.forgot');
    $this->post('/auth/password/forgot', 'PasswordController:postForgotPassword')->setName('auth.password.forgot');

})->add(new GuestMiddleware($container));

$app->group('', function ()  use ($app) {
	
    $app->get('/home', 'HomeController:index')->setName('home');
    
    $app->group('/stations', function () use ($app) {
        
        $app->get('/search', 'StationController:index')->setName('station.search');        
        $app->get('/update', 'StationController:update')->setName('station.update');
        $app->get('/create', 'StationController:create')->setName('station.create');

        $app->get('/{id:\d+}', 'StationController:view')->setName('station.view');
        $app->post('', 'StationController:update')->setName('station.update');
    });

    $app->get('/auth/signout', 'AuthController:getSignOut')->setName('auth.signout');

    $app->get('/auth/password/change', 'PasswordController:getChangePassword')->setName('auth.password.change');
    $app->post('/auth/password/change', 'PasswordController:postChangePassword');

})->add(new AuthMiddleware($container));
