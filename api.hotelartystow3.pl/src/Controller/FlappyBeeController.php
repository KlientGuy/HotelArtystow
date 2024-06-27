<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\ZjebleUserSession;
use App\Repository\ZjebleRoundRepository;
use App\Repository\ZjebleUserSessionRepository;
use App\Service\JsonSerializer;
use App\Service\Zjeble;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes\Tag;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\JsonContent;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Route('/flappyBee')]
#[Tag(name: 'FlappyBee')]
class FlappyBeeController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ZjebleUserSessionRepository $sessionRepository,
        private readonly ZjebleRoundRepository $roundRepository,
        private readonly JsonSerializer $serializer
    ) {}

    #[Route('/submitPoints', name: 'api_flappy_bee_submit_points', methods: ['POST'])]
    #[OA\RequestBody(
        content: new JsonContent(
            example: ["points" => "integer"]
        )
    )]
    public function submitPoints(Request $request, #[CurrentUser] ?User $user): Response
    {
        [
            'points' => $points
        ] = $request->toArray();
        echo $points;
        die;
    }
}
