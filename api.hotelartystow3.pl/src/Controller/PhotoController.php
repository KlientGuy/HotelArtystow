<?php

namespace App\Controller;

use App\Entity\Photo;
use App\Entity\User;
use App\Kernel;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\Tag;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/photos')]
#[Tag('Photos')]
class PhotoController extends AbstractController
{
    private $imagePath = '/files/photos/';
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly Kernel $kernel
    ) {}

    #[Route('/upload', name: 'api_photos_upload', methods: ['POST'])]
    public function upload(#[CurrentUser] User $user, Request $request)
    {
        $files = $request->files->get('files');

        $path = $this->kernel->getProjectDir().'/public'.$this->imagePath;

        if(!file_exists($path)) {
            mkdir($path, 7770, true);
        }

        try {
            $this->em->beginTransaction();

            /** @var UploadedFile $file */
            foreach($files as $file)
            {
                $newFilename = md5(time().$user->getUsername());
                $photo = new Photo();
                $photo->setUploadedBy($user)
                ->setUploadedAt(new \DateTimeImmutable())
                ->setOriginalName($file->getClientOriginalName())
                ->setMimeType($file->getClientMimeType())
                ->setPath($this->imagePath.$newFilename);

                $this->em->persist($photo);

                $file->move($path, $newFilename);
            }
            $this->em->flush();
            $this->em->commit();

            return new JsonResponse('Dzięki za fotkę');
        }
        catch(\Exception $e) {
            throw $e;
            $this->em->rollback();
            return new JsonResponse('Wystąpił problem przy uploadzie', 500);
        }

    }

    #[Route('/getAll', name: 'api_photos_get_all', methods: ['GET'])]
    public function getAll(PhotoRepository $photoRepository)
    {
        $res = $photoRepository->getAllFilePaths();

        return new JsonResponse($res);
    }
}
