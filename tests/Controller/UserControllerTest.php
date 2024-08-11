<?php
namespace App\Test\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserControllerTest extends WebTestCase
{
    private $client;
    private $repository;
    private $manager;
    private string $apiPath = '/api/users/';
    private $jwtToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = static::createClient();
        $this->repository = static::getContainer()->get('doctrine')->getRepository(User::class);
        $this->manager = static::getContainer()->get('doctrine')->getManager();

        // Создаем тестового пользователя и получаем JWT токен
        $this->jwtToken = $this->getJwtToken('ilya', 'test');

        // $this->clearDatabase();
    }

    // private function clearDatabase(): void
    // {
    //     foreach ($this->repository->findAll() as $user) {
    //         $this->manager->remove($user);
    //     }
    //     $this->manager->flush();
    // }

    private function getJwtToken(string $username, string $password): ?string
    {
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => $username,
            'password' => $password,
        ]));

        $response = $this->client->getResponse();
        if ($response->getStatusCode() !== Response::HTTP_OK) {
            throw new \Exception('Failed to get JWT token');
        }

        $data = json_decode($response->getContent(), true);
        return $data['token'] ?? null;
    }

    private function authenticateClient(): void
    {
        $this->client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . $this->jwtToken);
    }

    public function testIndex(): void
    {
        $this->authenticateClient();
        $this->client->request('GET', $this->apiPath);
        $response = $this->client->getResponse();

        self::assertResponseIsSuccessful();
        self::assertJson($response->getContent());
    }

    public function testShow(): void
    {
        $user = $this->createUser('showuser');
        $this->authenticateClient();
        $this->client->request('GET', $this->apiPath . $user->getId());
        $response = $this->client->getResponse();

        self::assertResponseIsSuccessful();
        self::assertJson($response->getContent());

        $data = json_decode($response->getContent(), true);
        self::assertEquals($user->getUsername(), $data['username']);
        self::assertEquals($user->getEmail(), $data['email']);
    }

    public function testCreate(): void
    {
        $data = [
            'username' => 'newuser',
            'email' => 'newuser@example.com',
            'password' => 'newpassword',
            'roles' => ['ROLE_USER']
        ];

        $this->authenticateClient();
        $this->client->request('POST', $this->apiPath, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($data));
        $response = $this->client->getResponse();

        self::assertResponseIsSuccessful();
        self::assertJson($response->getContent());

        $data = json_decode($response->getContent(), true);
        $userId = $data['id'];
        $user = $this->repository->find($userId);
        self::assertNotNull($user);
        self::assertEquals($data['username'], $user->getUsername());
    }

    public function testUpdate(): void
    {
        $user = $this->createUser('updateuser');

        $data = [
            'username' => 'updateduser',
            'email' => 'updateduser@example.com',
            'password' => 'updatedpassword',
            'roles' => ['ROLE_USER']
        ];

        $this->authenticateClient();
        $this->client->request('PUT', $this->apiPath . $user->getId(), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($data));
        $response = $this->client->getResponse();

        self::assertResponseIsSuccessful();
        self::assertJson($response->getContent());

        $updatedUser = $this->repository->find($user->getId());
        self::assertEquals($data['username'], $updatedUser->getUsername());
        self::assertEquals($data['email'], $updatedUser->getEmail());
    }

    public function testDelete(): void
    {
        $user = $this->createUser('deleteuser');

        $this->authenticateClient();
        $this->client->request('DELETE', $this->apiPath . $user->getId());
        $response = $this->client->getResponse();

        self::assertResponseIsSuccessful();
        // Проверка JSON может не потребоваться для DELETE-запроса

        $deletedUser = $this->repository->find($user->getId());
        self::assertNull($deletedUser);
    }

    private function createUser(string $username): User
    {
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($username . '@example.com');
        $user->setPassword('password');
        $user->setRoles(['ROLE_USER']);

        $this->manager->persist($user);
        $this->manager->flush();

        return $user;
    }
}
