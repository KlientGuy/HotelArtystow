<?php

namespace App\Service;

use App\Entity\ZjebleRound;
use App\Kernel;
use App\Repository\ZjebleRoundRepository;
use Doctrine\ORM\EntityManagerInterface;

class Zjeble
{
    private string $imagePath = 'assets/zjeble/';

    public function __construct(
        private readonly Kernel $kernel,
        private readonly EntityManagerInterface $em,
        private readonly ZjebleRoundRepository $roundRepository
    ) {}

    public function blurImage(string $imgName, int $blurStrength)
    {
        $imagick = new \Imagick($this->kernel->getProjectDir().'/'. $this->imagePath . $imgName);
        $imagick->resizeImage(512, 512, null, null);
        $imagick->gaussianBlurImage($blurStrength, $blurStrength);
        $imagick->setImageFormat('webp');
        return $imagick->getImageBlob();
    }

    public function getClearImage(string $imgName)
    {
        $imagick = new \Imagick($this->kernel->getProjectDir().'/'. $this->imagePath . $imgName);
        $imagick->setImageFormat('webp');
        return $imagick->getImageBlob();
    }

    public function createNextRound()
    {
        $round = $this->roundRepository->getCurrent();
        $nextIndex = $round->getId() + 1;
        $globPath = $this->kernel->getProjectDir().'/'.$this->imagePath. "*_$nextIndex.jpg";

        $globRes = glob($globPath);

        if(!$globRes)
            throw new \Exception('Next photo does not exist');

        $path = $globRes[0];
        $lastSlash = strrpos($path, '/') + 1;
        $answer = substr($path, $lastSlash, strrpos($path, '_') - $lastSlash);

        $newRound = new ZjebleRound();
        $newRound
            ->setCreatedAt(new \DateTimeImmutable())
            ->setPicturePath($globRes[0])
            ->setAnswer($answer);

        try
        {
            $this->em->beginTransaction();
            $this->em->persist($newRound);
            $this->em->flush();
            $this->em->commit();
            return true;
        }
        catch(\Exception $e)
        {
            $this->em->rollback();
            throw new \Exception('Could not persist round in database');
        }
    }
}
