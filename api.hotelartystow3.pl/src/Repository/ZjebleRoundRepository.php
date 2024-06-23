<?php

namespace App\Repository;

use App\Entity\ZjebleRound;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ZjebleRound>
 */
class ZjebleRoundRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ZjebleRound::class);
    }

    public function getCurrent(): ZjebleRound
    {
        $dql = "
            SELECT z FROM App\Entity\ZjebleRound z
            ORDER BY z.id DESC
        ";

        return $this->getEntityManager()->createQuery($dql)->setMaxResults(1)->getSingleResult();
    }

    //    /**
    //     * @return ZjebleRound[] Returns an array of ZjebleRound objects
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

    //    public function findOneBySomeField($value): ?ZjebleRound
    //    {
    //        return $this->createQueryBuilder('z')
    //            ->andWhere('z.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
