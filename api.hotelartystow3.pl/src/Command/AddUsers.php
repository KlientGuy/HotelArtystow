<?php

namespace App\Command;

use App\Entity\Division;
use App\Entity\User;
use App\Entity\UserStatistics;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:add-users')]
class AddUsers extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $hasher
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $added = $this->addUsers();
        $output->writeln("<fg=green>Added $added Users</>");
        return Command::SUCCESS;
    }

    private function addUsers()
    {
        $users = [
            [
                'username' => 'patryk',
                'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
                'firstname' => 'Patryk',
                'profilePic' => 'patryk-256.webp',
            ],
            [
                'username' => 'gabrys',
                'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
                'firstname' => 'Gabryś',
                'profilePic' => 'gabrys-256.webp',
            ],
            [
                'username' => 'damian',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Damian',
                'profilePic' => 'damian-256.webp',
            ],
            [
                'username' => 'gabrysia',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Gabrysia',
                'profilePic' => 'gabsuia-256.webp',
            ],
            [
                'username' => 'kacper',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Kacper',
                'profilePic' => 'kacper-256.webp',
            ],
            [
                'username' => 'bartek',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Bartek',
                'profilePic' => 'bartek-256.webp',
            ],
            [
                'username' => 'oliwier',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Olik',
                'profilePic' => 'olik-256.webp',
            ],
            [
                'username' => 'pawel',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Paweł',
                'profilePic' => 'pawel-256.webp',
            ],
            [
                'username' => 'kinga',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Kinga',
                'profilePic' => 'kinga-256.webp',
            ],
            [
                'username' => 'weronika',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Weronika',
                'profilePic' => 'weronika-256.webp',
            ],
            [
                'username' => 'zosia',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Zosia',
                'profilePic' => 'zosia-256.webp',
            ],
            [
                'username' => 'julka',
                'roles' => ['ROLE_USER'],
                'firstname' => 'Julka',
                'profilePic' => 'julka-256.webp',
            ]
        ];

        $added = 0;
        $dirt = $this->em->getReference(Division::class, 1);
        foreach($users as $one)
        {
            $user = new User();
            $user->setUsername($one['username'])
                ->setFirstname($one['firstname'])
                ->setRoles($one['roles'])
                ->setProfilePic($one['profilePic'])
                ->setLastLogin(new \DateTimeImmutable('1970-01-01'));

            $userStatistics = new UserStatistics();
            $userStatistics->setUser($user)
                ->setBees(0)
                ->setDivision($dirt)
                ->setLoginStreak(0);

            $user->setUserStatistics($userStatistics);

            $hashedPassword = $this->hasher->hashPassword($user, 'Komputer1');
            $user->setPassword($hashedPassword);

            $this->em->beginTransaction();
            $this->em->persist($user);
            $this->em->flush();
            $this->em->commit();
            $added++;
        }

        return $added;
    }
}
