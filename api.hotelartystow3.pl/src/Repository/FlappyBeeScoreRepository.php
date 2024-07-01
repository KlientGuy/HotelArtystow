<?php

namespace App\Repository;

use App\Entity\FlappyBeeScore;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FlappyBeeScore>
 */
class FlappyBeeScoreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FlappyBeeScore::class);
    }

    public function canGetPoints(User $user): bool
    {
        $dql = "
            SELECT SUM(p.score) FROM App\Entity\FlappyBeeScore p
            WHERE p.createdAt BETWEEN :startDate AND :endDate AND p.user = :user
        ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('user', $user);
        $query->setParameter('startDate', new \DateTime(date('Y-m-d').' 00:00:00'));
        $query->setParameter('endDate', new \DateTime(date('Y-m-d').' 23:59:59'));

        return $query->getSingleScalarResult() < 50;

    }

    //    /**
    //     * @return FlappyBeeScore[] Returns an array of FlappyBeeScore objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FlappyBeeScore
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
