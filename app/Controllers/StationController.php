<?php

namespace App\Controllers;

use GuzzleHttp\Exception\ConnectException;

class StationController extends Controller
{
    // public function __construct($container) 
    // {
    //     parent::__construct($container);
    // }

    public function create($request, $response)
    {
        $result = $this->client->get('genres');
        $body = json_decode($result->getBody(), true);
        $data['genres'] = $body['genres'];

        $result = $this->client->get('locations');
        $body = json_decode($result->getBody(), true);
        $data['locations'] = $body['locations'];

        return $this->view->render($response, 'station/station-create.twig', $data);
    }

    public function index($request, $response)
    {
        try {
            $this->checkServerConnection();
        } catch (\GuzzleHttp\Exception\ConnectException $e) {
            return $this->view->render($response, '500a.twig', array('message'=>$e->getMessage()));
            // return $this->view->render($response, 'templates/500b.twig', array('message'=>$e->getMessage()));
        }         

        $result = $this->client->get('genres');
        $body = json_decode($result->getBody(), true);
        $data['genres'] = $body['genres'];

        $result = $this->client->get('locations');
        $body = json_decode($result->getBody(), true);
        $data['locations'] = $body['locations'];

        return $this->view->render($response, 'station/station-search.twig', $data);
    }

    public function search($request, $response, $args)
    {
        $params = $request->getParsedBody();
        foreach ($params as $key => $value) {
            if($value && substr($key, 0, 4) != 'csrf') {
                $qs[] = "$key=$value";
            }
        }

        $result = $this->client->get('stations?' . implode($qs, '&'));
        $data = json_decode($result->getBody(), true);
        return $this->view->render($response, 'station-results.twig', $data);
    }



    public function view($request, $response, $args)
    { 
        $data = array();
        $url = "stations/$args[id]";
        $result = $this->client->get($url);

        if($result->getStatusCode() === 200) {
            $body = json_decode($result->getBody(), true);
            $data = current($body['stations']);

            $result = $this->client->get('genres');
            $body = json_decode($result->getBody(), true);
            $data['genres'] = $body['genres'];

            $result = $this->client->get('locations');
            $body = json_decode($result->getBody(), true);
            $data['locations'] = $body['locations'];
        }
        return $this->view->render($response, 'station-view.twig', $data);
    }


    public function update($request, $response, $args)
    {
        $data = array();
        $params = $request->getQueryParams();

        if($params['id']) {
            $url = "stations/$params[id]";
            $result = $this->client->get($url);
            if($result && $result->getStatusCode() === 200) {
                $json = json_decode($result->getBody()->getContents(), true);
                // Output values for station 
                $data = $json['data'][0];
                // Output values for genres
                foreach ($json['data'] as $value) {
                    $data['genreids'][] = $value['genreid'];
                }
            }
        }

        $result = $this->client->get('genres');
        $json = json_decode($result->getBody(), true);
        $data['genres'] = $json['genres'];

        $result = $this->client->get('locations');
        $json = json_decode($result->getBody(), true);
        $data['locations'] = $json['locations'];

        return $this->view->render($response, 'station/station-update.twig', $data);
    }

}
