<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findUsers(): array
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u.id', 'u.username', 'u.email', 'u.roles'); // Выберите только необходимые поля

        return $qb->getQuery()->getArrayResult();
    }
    /**
     * Найти пользователя по ID и вернуть только выбранные поля.
     */
    public function findUserById($id): array
    {
        // Создание QueryBuilder для выборки нужных полей
        $qb = $this->createQueryBuilder('u')
            ->select('u.id', 'u.username', 'u.email', 'u.roles') // Выберите только необходимые поля
            ->where('u.id = :id')
            ->setParameter('id', $id);


        // Выполнение запроса и получение результата
        $user = $qb->getQuery()->getOneOrNullResult();
        if(!empty($user)){
            $user['password'] = "";
        }
        return $user;
    }
    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
