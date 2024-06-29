<?php

namespace App\Repository;

use App\Entity\Division;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Division>
 */
class DivisionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Division::class);
    }

    public function canUserAdvance(User $user) {
        $dql = "
            SELECT d FROM App\Entity\Division d
            WHERE d.beesRequired <= :userBees
            ORDER BY d.beesRequired DESC
        ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('userBees', $user->getUserStatistics()->getBees());
        $query->setMaxResults(1);

        /** @var Division */
        $division = $query->getSingleResult();

        return $division->getId() !== $user->getUserStatistics()->getDivision()->getId();
    }

    //    /**
    //     * @return Division[] Returns an array of Division objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Division
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
