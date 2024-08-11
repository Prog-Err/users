<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/{vueRouting}', name: 'index', requirements: ['vueRouting' => '^(?!api).*$'])]
    public function index(): Response
    {
        $projectDir = $this->getParameter('public_directory').'index.html';

        $response = new Response(file_get_contents($projectDir), 200, ['Content-Type' => 'text/html']);

        return $response;
    }
}

