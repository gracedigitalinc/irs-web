<?php

namespace App\Controllers;

use GuzzleHttp\Client as Client;

class Controller
{
    protected $container;
    protected $client;

    public function __construct($container)
    {
        $this->container = $container;  

        $this->client = new Client([
            'base_uri' => getenv('API_HOST'),
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ]
        ]);     
    }

    public function __get($property)
    {
        if ($this->container->{$property}) {
            return $this->container->{$property};
        }
    }

    public function checkServerConnection() {
        $this->client->request('OPTIONS');  
    }
}
