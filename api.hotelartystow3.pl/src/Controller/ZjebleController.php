<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\ZjebleRound;
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

#[Route('/zjeble')]
#[Tag(name: 'Zjeble')]
class ZjebleController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ZjebleUserSessionRepository $sessionRepository,
        private readonly ZjebleRoundRepository $roundRepository,
        private readonly JsonSerializer $serializer
    ) {}

    #[Route('/getUserSession', name: 'api_zjeble_get_user_session', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Logged user session for zjeble',
        content: new Model(type: ZjebleUserSession::class, groups: ['session'])
    )]
    public function getUserSession(#[CurrentUser] User $user)
    {
        $round = $this->roundRepository->getCurrent();

        $session = $this->sessionRepository->getForRound($user, $round);

        if(empty($session))
        {
            $session = new ZjebleUserSession();
            $session
                ->setStartedAt(new \DateTimeImmutable())
                ->setLivesLeft(3)
                ->setUser($user)
                ->setRound($round);

            try
            {
                $this->em->beginTransaction();
                $this->em->persist($session);
                $this->em->flush();
                $this->em->commit();
            }
            catch(\Exception $e)
            {
                $this->em->rollback();

                return new JsonResponse(['message' => 'Nie udało się pobrać sesji na dzisiaj'], 500);
            }
        }

        return $this->serializer->res($session, ['session']);
    }

    #[Route('/submitAnswer', name: 'api_zjeble_submit_answer', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new JsonContent(
            example: ['answer' => 'string']
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Submit answer for zjeble',
        content: new JsonContent(
            example: [
                'status' => 'true|false',
                'message' => 'string',
                'noAction' => '?int'
            ]
        )
    )]
    public function submitAnswer(#[CurrentUser] User $user, Request $request)
    {
        [
            'answer' => $answer
        ] = $request->toArray();

        $round = $this->roundRepository->getCurrent();
        $session = $this->sessionRepository->getForRound($user, $round);

        if(empty($session))
            return new JsonResponse(['status' => false, 'message' => 'Nie znaleziono wygenerowanej sesji', 'noAction' => 1], 404);

        if(!empty($session->getEndedAt()) && $session->getLivesLeft() <= 0)
            return new JsonResponse(['status' => false, 'message' => 'Nie możesz już zgadywać, wyczerpałeś wszystkie życia ;(', 'noAction' => 1]);

        if(!empty($session->getEndedAt()))
            return new JsonResponse(['status' => false, 'message' => 'Już zgadłeś, czego tu jeszcze szukasz?', 'noAction' => 1]);

        $lives = $session->getLivesLeft();

        $response = [];
        if($answer !== $round->getAnswer())
        {
            $lives--;

            if($lives === 0)
                $session->setEndedAt(new \DateTimeImmutable());

            $session->setLivesLeft($lives);

            $response = [
                'status' => false,
                'message' => 'Próbuj dalej'
            ];
        }
        else
        {
            $session->setEndedAt(new \DateTimeImmutable());
            $response = [
                'status' => true,
                'message' => 'Gratulacje użytkowniku'
            ];

            $statistics = $user->getUserStatistics();
            $beesEarned = $session->getLivesLeft() * 10;

            $statistics->setBees($statistics->getBees() + $beesEarned);
        }

        try
        {
            $this->em->beginTransaction();
            $this->em->persist($session);

            if(isset($statistics))
                $this->em->persist($statistics);

            $this->em->flush();
            $this->em->commit();
        }
        catch(\Exception $e)
        {
            $this->em->rollback();
            return new JsonResponse(['false' => 'Nie udało się zapisać w bazie', 'noAction' => 1]);
        }

        return new JsonResponse($response);
    }

    #[Route('/getImageForUser', name: 'api_zjeble_get_image_for_user', methods: ['GET'])]
    public function getImageForUser(#[CurrentUser] User $user, Zjeble $zjeble)
    {
        $round = $this->roundRepository->getCurrent();
        $session = $this->sessionRepository->getForRound($user, $round);

        $image = empty($session->getEndedAt()) ? $zjeble->blurImage($round->getPicturePath(), $session->getLivesLeft() * 3) : $zjeble->getClearImage($round->getPicturePath());

        return new Response($image, 200, [
            'Content-Type' => 'image/webp'
        ]);
    }

    #[Route('/createTodaysRound', name: 'api_zjeble_create_todays_round', methods: ['GET'])]
    public function createTodaysRound(Zjeble $zjeble)
    {
        $round = null;
        try
        {
            $round = $this->roundRepository->getCurrent();
        }
        catch(\Exception $e) {
            $round = new ZjebleRound();
            $round->setPhotoIndex(0)->setCreatedAt(new \DateTimeImmutable('-1 day'));
        }

        if($round->getCreatedAt()->format('z') === (new \DateTime('+10 minutes'))->format('z'))
            return new JsonResponse(['status' => false, 'message' => 'Todays round already exists'], 418);

        try
        {
            $res = $zjeble->createNextRound($round);
            return new JsonResponse(['status' => true], 200);
        }
        catch(\Exception $e)
        {
            return new JsonResponse(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
