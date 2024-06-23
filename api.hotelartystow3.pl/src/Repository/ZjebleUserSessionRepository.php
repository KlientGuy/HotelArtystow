<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\ZjebleRound;
use App\Entity\ZjebleUserSession;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ZjebleUserSession>
 */
class ZjebleUserSessionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ZjebleUserSession::class);
    }

    public function getForRound(User $user, ZjebleRound $round): ZjebleUserSession|null
    {
        $dql = "
            SELECT z FROM App\Entity\ZjebleUserSession z
            WHERE 
                z.user = :user
                AND z.round = :round
            ORDER BY z.id desc
        ";

        return $this->getEntityManager()
            ->createQuery($dql)
            ->setParameters([
                'user' => $user,
                'round' => $round
            ])
            ->setMaxResults(1)
            ->getResult()[0] ?? null;
    }

    //    /**
    //     * @return ZjebleUserSession[] Returns an array of ZjebleUserSession objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('z')
    //            ->andWhere('z.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('z.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ZjebleUserSession
    //    {
    //        return $this->createQueryBuilder('z')
    //            ->andWhere('z.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
