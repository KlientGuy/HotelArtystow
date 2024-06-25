<?php

namespace App\Entity;

use App\Repository\DivisionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DivisionRepository::class)]
class Division
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['userProfile'])]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $beesRequired = null;

    #[ORM\Column(length: 255)]
    #[Groups(['userProfile'])]
    private ?string $texture = null;

    #[ORM\Column(length: 255)]
    #[Groups(['userProfile'])]
    private ?string $vertexShader = null;

    #[ORM\Column(length: 255)]
    #[Groups(['userProfile'])]
    private ?string $fragmentShader = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getBeesRequired(): ?int
    {
        return $this->beesRequired;
    }

    public function setBeesRequired(int $beesRequired): static
    {
        $this->beesRequired = $beesRequired;

        return $this;
    }

    public function getTexture(): ?string
    {
        return $this->texture;
    }

    public function setTexture(string $texture): static
    {
        $this->texture = $texture;

        return $this;
    }

    public function getVertexShader(): ?string
    {
        return $this->vertexShader;
    }

    public function setVertexShader(string $vertexShader): static
    {
        $this->vertexShader = $vertexShader;

        return $this;
    }

    public function getFragmentShader(): ?string
    {
        return $this->fragmentShader;
    }

    public function setFragmentShader(string $fragmentShader): static
    {
        $this->fragmentShader = $fragmentShader;

        return $this;
    }
}
