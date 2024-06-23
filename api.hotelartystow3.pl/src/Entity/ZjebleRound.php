<?php

namespace App\Entity;

use App\Repository\ZjebleRoundRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ZjebleRoundRepository::class)]
class ZjebleRound
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $picturePath = null;

    #[ORM\Column(length: 100)]
    private ?string $answer = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @var Collection<int, ZjebleUserSession>
     */
    #[ORM\OneToMany(targetEntity: ZjebleUserSession::class, mappedBy: 'round')]
    private Collection $zjebleUserSessions;

    public function __construct()
    {
        $this->zjebleUserSessions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPicturePath(): ?string
    {
        return $this->picturePath;
    }

    public function setPicturePath(string $picturePath): static
    {
        $this->picturePath = $picturePath;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): static
    {
        $this->answer = $answer;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, ZjebleUserSession>
     */
    public function getZjebleUserSessions(): Collection
    {
        return $this->zjebleUserSessions;
    }

    public function addZjebleUserSession(ZjebleUserSession $zjebleUserSession): static
    {
        if (!$this->zjebleUserSessions->contains($zjebleUserSession)) {
            $this->zjebleUserSessions->add($zjebleUserSession);
            $zjebleUserSession->setRound($this);
        }

        return $this;
    }

    public function removeZjebleUserSession(ZjebleUserSession $zjebleUserSession): static
    {
        if ($this->zjebleUserSessions->removeElement($zjebleUserSession)) {
            // set the owning side to null (unless already changed)
            if ($zjebleUserSession->getRound() === $this) {
                $zjebleUserSession->setRound(null);
            }
        }

        return $this;
    }
}
