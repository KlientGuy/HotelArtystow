<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserStatistics;
use App\Repository\UserRepository;
use App\Repository\UserStatisticsRepository;
use App\Service\JsonSerializer;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes\Tag;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\JsonContent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/users')]
#[Tag(name: 'Users')]
class UsersController extends AbstractController
{
    public function __construct(private readonly JsonSerializer $serializer, private readonly EntityManagerInterface $em) {}

    #[Route('/login', name: 'api_users_login', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            example: [
                'username' => 'string',
                'password' => 'string'
            ]
        )
    )]
    public function login(AuthenticationUtils $authenticationUtils, UserStatisticsRepository $statisticsRepository): JsonResponse
    {
        $error = $authenticationUtils->getLastAuthenticationError();

        if(empty($error))
        {
            $statisticsRepository->updateLoginStreak($this->getUser());
        }
        return new JsonResponse();
    }

    #[Route('/logout', name: 'api_users_logout', methods: ['GET'])]
    public function logout(Security $security)
    {
        $security->logout(false);
        return new JsonResponse();
    }

    #[Route('/ping', name: 'api_users_ping', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Used for checking if user is authorized'
    )]
    public function ping()
    {
        return new JsonResponse('pong');
    }

    #[Route('/getUsers', name: 'api_users_get_users', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'List of users',
        content: new Model(type: User::class, groups: ['usersList'])
    )]
    public function getUsers(UserRepository $userRepository)
    {
        $users = $userRepository->findAll();
        return $this->serializer->res($users, ['usersList']);
    }

    #[Route('/profile', name: 'api_users_my_profile', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Logged user profile data',
        content: new Model(type: User::class, groups: ['userProfile'])
    )]
    public function myProfile(#[CurrentUser] User $user)
    {
        return $this->serializer->res($user, ['userProfile']);
    }

    #[Route('/profile/{id}', name: 'api_users_profile', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Specified user profile data',
        content: new Model(type: User::class, groups: ['userProfile'])
    )]
    public function profile(int $id, UserRepository $userRepository)
    {
        $user = $userRepository->find($id);
        return $this->serializer->res($user, ['userProfile']);
    }

    #[Route('/saveDescription', name: 'api_users_profile_save_description', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        description: 'Description to set',
        content: new OA\JsonContent(
            example: [
                'description' => 'string'
            ]
        )
    )]
    public function saveDescription(#[CurrentUser] User $user, Request $request)
    {
        [
            'description' => $description
        ] = $request->toArray();

        $user->setDescription($description);
        try
        {
            $this->em->beginTransaction();
            $this->em->persist($user);
            $this->em->flush();
            $this->em->commit();

            return new JsonResponse(['status' => true]);
        }
        catch(\Exception $e)
        {
            $this->em->rollback();
            return new JsonResponse(['status' => false], 500);
        }
    }

    #[Route('/getNavbarStats', name: 'api_users_profile_get_navbar_stats', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Logged user navbar stats',
        content: new Model(type: UserStatistics::class, groups: ['userProfile'])
    )]
    public function getNavbarStats(#[CurrentUser] User $user)
    {
        $stats = $user->getUserStatistics();

        return $this->serializer->res($stats, ['navbarStats']);
    }

    #[Route('/ranking', name: 'api_users_get_by_rank', methods: ['GET'])]
    public function getByRank(UserStatisticsRepository $statisticsRepository)
    {
        $res = $statisticsRepository->getByRank();
        return $this->serializer->res($res, ['ranking']);
    }

    #[Route('/getUserRank/{id}', name: 'api_users_get_user_rank', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Specified user ranking place',
        content: new JsonContent(
            example: ['place' => 'int']
        )
    )]
    public function getUserRank(int $id, UserStatisticsRepository $statisticsRepository)
    {
        try
        {
            $res = $statisticsRepository->getUserRank($id);
            return new JsonResponse(['place' => $res]);
        }
        catch(\Exception $e)
        {
            return new JsonResponse(['message' => 'Nie znaleziono takiego użytkownika'], 404);
        }
    }

    #[Route('/getMyRank', name: 'api_users_get_my_rank', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Specified user ranking place',
        content: new JsonContent(
            example: ['place' => 'int']
        )
    )]
    public function getMyRank(#[CurrentUser] User $user, UserStatisticsRepository $statisticsRepository)
    {
        $res = $statisticsRepository->getUserRank($user->getId());
        return new JsonResponse(['place' => $res]);
    }
}
