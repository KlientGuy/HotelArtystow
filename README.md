# :hotel: Hotel Artystów VOL. 3 :art:

### Co to

Projekt stworzony z myślą o wakacjach 2024.\
Aplikacja webowa, gdzie każdy uczestnik może się zalogować i zagrać w różne minigierki,\
zbierając pszczoły (punkty) a główną nagrodą podobno jest wybranie pokoju

---

### Po co to

Bo to fajna zabawa i ~~nowe technologie~~  \
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;^^^^^^^^^^^^^^^ chuja prawda, bo na mydevilu się nie da dotneta 8

---

### Tech stack (dosyć prosty jak na dzisiejsze czasy)
* Backend: ~~C#, ASP.NET~~ (Incydent się wydarzył :angry:), \
PHP, Symfony, MySql (MariaDB)
* Frontend: Svelte (bundler Vite), vanilla css, bez TS (JSDoc też działa)

---

### Jak przygotować :bomb:

Potrzebujemy najpierw parę rzeczy mieć zainstalowanych
* ~~.NET runtime, .NET SDK~~
* przynajmniej php 8.3 i composer
* NodeJS :rofl:

Chyba tyle, potem robimy sobie

```bash
$ git pull git@github.com:KlientGuy/HotelArtystow.git
$ cd hotel_artystow_front/
$ npm install
$ cd ../api.hotelartystow3.pl/
$ composer install
```

EDIT: Jeszcze trzeba symfony ogarnąć a do tego potrzeba .enva, potem w folderze `api.hotelartystow3.pl`
```bash
#Migracje:
$ mkdir migrations
$ php bin/console make:migration
$ php bin/console doctrine:migrations:migrate

#Wypełnienie bazy
$ php bin/console app:add-fixtures
$ php bin/console app:add-users
```

---

### Jak to odpalić :gear:

```bash
#$ cd HotelArtystowApi/
#$ dotnet run
$ cd api.hotelartystow3.pl/
$ ./symfony server:start
$ cd ../hotel_artystow_front/
$ npm run dev
```

Potem odpalamy w przeglądarce
* http://localhost:5001 -- na front
* ~~http://localhost:5000/swagger/index.html -- na szwagra do testowania api~~
* http://localhost:8000/swagger -- na szwagra do testowania api
