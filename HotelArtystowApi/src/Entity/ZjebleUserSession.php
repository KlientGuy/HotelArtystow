<?php

namespace App\Entity;

use App\Repository\ZjebleUserSessionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ZjebleUserSessionRepository::class)]
class ZjebleUserSession
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(['session'])]
    private ?int $livesLeft = null;

    #[ORM\ManyToOne(inversedBy: 'zjebleUserSessions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ZjebleRound $round = null;

    #[ORM\Column]
    #[Groups(['session'])]
    private ?\DateTimeImmutable $startedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['session'])]
    private ?\DateTimeImmutable $endedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getLivesLeft(): ?int
    {
        return $this->livesLeft;
    }

    public function setLivesLeft(int $livesLeft): static
    {
        $this->livesLeft = $livesLeft;

        return $this;
    }

    public function getRound(): ?ZjebleRound
    {
        return $this->round;
    }

    public function setRound(?ZjebleRound $round): static
    {
        $this->round = $round;

        return $this;
    }

    public function getStartedAt(): ?\DateTimeImmutable
    {
        return $this->startedAt;
    }

    public function setStartedAt(\DateTimeImmutable $startedAt): static
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getEndedAt(): ?\DateTimeImmutable
    {
        return $this->endedAt;
    }

    public function setEndedAt(?\DateTimeImmutable $endedAt): static
    {
        $this->endedAt = $endedAt;

        return $this;
    }
}
