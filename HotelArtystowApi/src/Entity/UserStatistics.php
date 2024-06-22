<?php

namespace App\Entity;

use App\Repository\UserStatisticsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserStatisticsRepository::class)]
class UserStatistics
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'userStatistics', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(['userProfile', 'navbarStats'])]
    private ?int $loginStreak = null;

    #[ORM\Column]
    #[Groups(['userProfile', 'navbarStats', 'ranking'])]
    private ?int $bees = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['userProfile'])]
    private ?Division $division = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getLoginStreak(): ?int
    {
        return $this->loginStreak;
    }

    public function setLoginStreak(int $loginStreak): static
    {
        $this->loginStreak = $loginStreak;

        return $this;
    }

    public function getBees(): ?int
    {
        return $this->bees;
    }

    public function setBees(int $bees): static
    {
        $this->bees = $bees;

        return $this;
    }

    public function getDivision(): ?Division
    {
        return $this->division;
    }

    public function setDivision(?Division $division): static
    {
        $this->division = $division;

        return $this;
    }
}
