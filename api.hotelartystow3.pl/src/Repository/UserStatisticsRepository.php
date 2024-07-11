<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\UserStatistics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserStatistics>
 */
class UserStatisticsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserStatistics::class);
    }

    public function getByRank()
    {
        $sql = "
            SELECT
                us.*,
                u.id,
                u.firstname,
                u.profile_pic,
                RANK() OVER (ORDER BY us.bees DESC) as place
            FROM user u
            INNER JOIN user_statistics us on u.id = us.user_id
            ORDER BY bees DESC, u.firstname ASC
        ";

        $em = $this->getEntityManager();
        $rsm = new ResultSetMappingBuilder($em);
        $rsm->addRootEntityFromClassMetadata(User::class, 'u');
        $rsm->addScalarResult('place', 'place');

        $query = $em->createNativeQuery($sql, $rsm);

        return $query->getResult();
    }

    public function getUserRank(int $userId)
    {
        $sql = "
            WITH ranks as (
                SELECT
                    us.user_id,
                    RANK() OVER (ORDER BY us.bees DESC) as place
                FROM user_statistics us
            )
            SELECT * FROM ranks WHERE user_id = :userId
        ";

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('place', 'place', 'integer');
        return $this->getEntityManager()
            ->createNativeQuery($sql, $rsm)
            ->setParameter('userId', $userId)
            ->getSingleScalarResult();
    }

    public function updateLoginStreak(User $user)
    {
        $statistics = $user->getUserStatistics();
        $nowMidnight = new \DateTime(date('Y-m-d'));
        $loginMidnight = new \DateTime($user->getLastLogin()->format('Y-m-d'));

        $lastLoginDiff = date_diff($nowMidnight, $loginMidnight);

        if($lastLoginDiff->days == 1)
        {
            $streak = $statistics->getLoginStreak();
            $statistics->setLoginStreak(++$streak);
        }
        else if($lastLoginDiff->days != 0)
            $statistics->setLoginStreak(1);

        $user->setLastLogin(new \DateTime());

        $em = $this->getEntityManager();
        try
        {
            $em->beginTransaction();
            $em->persist($user);
            $em->flush();
            $em->commit();
        }
        catch(\Exception $e)
        {
            $em->rollback();
        }
    }

//    /**
//     * @return UserStatistics[] Returns an array of UserStatistics objects
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

//    public function findOneBySomeField($value): ?UserStatistics
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
