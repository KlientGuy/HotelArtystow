<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

class JsonSerializer
{
    public function __construct(private readonly SerializerInterface $serializer) {}

    public function serialize($entity, array $groups)
    {
        return $this->serializer->serialize($entity, 'json', ['groups' => $groups]);
    }

    public function res($entity, array $groups)
    {
        return JsonResponse::fromJsonString($this->serialize($entity, $groups));
    }
}
