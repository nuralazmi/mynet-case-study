<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;


class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('people')->delete();
        $people = array();
        $faker = Faker::create();
        for ($i = 1; $i <= 20; $i++) {
            $people[] = [
                'name' => $faker->name,
                'birthday' => $faker->date(),
                'gender' => $i % 2,
            ];
        }
        DB::table('people')->insert($people);
    }
}
