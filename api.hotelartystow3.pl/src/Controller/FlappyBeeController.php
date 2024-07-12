<?php

namespace App\Controller;

use App\Entity\FlappyBeeScore;
use App\Entity\User;
use App\Entity\ZjebleUserSession;
use App\Repository\FlappyBeeScoreRepository;
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
    public function submitPoints(Request $request, #[CurrentUser] ?User $user, FlappyBeeScoreRepository $flappyBeeScoreRepository): Response
    {
        [
            'points' => $points
        ] = $request->toArray();

        $flappyBeeScore = new FlappyBeeScore();
        $statistics = $user->getUserStatistics();

        $canGetPoints = $flappyBeeScoreRepository->canGetPoints($user);

        if($points >= 10) {
            $flappyBeeScore
                ->setUser($user)
                ->setScore($points)
                ->setCreatedAt(new DateTimeImmutable());

            try {
                $this->em->beginTransaction();
                $this->em->persist($flappyBeeScore);

                if($canGetPoints) {
                    $newBees = $statistics->getBees() + $points;
                    $statistics->setBees($newBees);
                    $this->em->persist($statistics);
                }
                $this->em->flush();
                $this->em->commit();

                if($canGetPoints)
                    return new JsonResponse(['beesAdded' => $points], 200);
                else
                    return new JsonResponse(['message' => 'Nie możesz zdobyć dzisiaj więcej pszczół'], 400);

            } catch (\Exception $e) {
                $this->em->rollback();
                return new JsonResponse(['message' => 'Coś się wyjebało'], 500);
            }
        }
        return new JsonResponse(['message' => 'Musisz się bardziej postarać'], 400);
    }

    #[Route('/getHighScores', name: 'api_flappy_bee_get_high_scores', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'High scores',
        content: new OA\JsonContent(
            example: [
                'overall' => 'integer',
                'mine' => 'integer',
                'todays' => 'integer'
            ]
        )
    )]
    public function getHighScores(#[CurrentUser] $user, FlappyBeeScoreRepository $scoreRepository)
    {
        $overall = $scoreRepository->getOverallHighScore();
        $my = $scoreRepository->getUserHighScore($user);
        $todays = $scoreRepository->getTodaysHighScore();

        return new JsonResponse([
                'overall' => $overall,
                'mine' => $my,
                'todays' => $todays
        ]);
    }
}
