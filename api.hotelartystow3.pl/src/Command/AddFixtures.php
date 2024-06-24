<?php

namespace App\Command;

use App\Entity\Division;
use App\Repository\DivisionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:add-fixtures')]
class AddFixtures extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly DivisionRepository $divisionRepository
    ) { parent::__construct(); }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $divRes = $this->addDivisions();
        $output->writeln("<fg=green>Added $divRes divisions</>");
        return Command::SUCCESS;
    }

    private function addDivisions()
    {
        $divisions = [
            [
                'name' => 'Dirt',
                'beesRequired' => 0,
                'texture' => 'divisions/dirt_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Stone',
                'beesRequired' => 50,
                'texture' => 'divisions/stone_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Miedź',
                'beesRequired' => 100,
                'texture' => 'divisions/copper_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Żelazo',
                'beesRequired' => 150,
                'texture' => 'divisions/iron_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Złoto',
                'beesRequired' => 200,
                'texture' => 'divisions/gold_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Diament',
                'beesRequired' => 300,
                'texture' => 'divisions/diamond_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Szmaragd',
                'beesRequired' => 400,
                'texture' => 'divisions/emerald_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Bedrock',
                'beesRequired' => 500,
                'texture' => 'divisions/bedrock_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Legendary Bedrock',
                'beesRequired' => 1000,
                'texture' => 'divisions/bedrock_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ],
            [
                'name' => 'Giga duper hiper Miód',
                'beesRequired' => 2000,
                'texture' => 'divisions/honey_block.png',
                'vertexShader' => 'generic_texture_mvp.vert',
                'fragmentShader' => 'generic_texture.frag'
            ]
        ];

        $added = 0;
        foreach($divisions as $one)
        {
            /** @var Division */
            $division = $this->divisionRepository->findOneBy(['name' => $one['name']]);

            if(empty($division))
                $division = new Division();

            $division->setName($one['name']);
            $division->setBeesRequired($one['beesRequired']);
            $division->setTexture($one['texture']);
            $division->setVertexShader($one['vertexShader']);
            $division->setFragmentShader($one['fragmentShader']);

            $this->em->beginTransaction();
            $this->em->persist($division);
            $this->em->flush();
            $this->em->commit();
            $added++;
        }
        return $added;
    }
}
