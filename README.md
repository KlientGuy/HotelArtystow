# :hotel: Hotel Artystów VOL. 3 :art:

### Co to

Projekt stworzony z myślą o wakacjach 2024.\
Aplikacja webowa, gdzie każdy uczestnik może się zalogować i zagrać w różne minigierki,\
zbierająć pszczoły (punkty) a główną nagrodą podobno jest wybranie pokoju

---

### Po co to

Bo to fajna zabawa i nowe technologie

---

### Tech stack (dosyć prosty jak na dzisiejsze czasy)
* Backend: C#, ASP.NET, MySql (MariaDB)
* Frontend: Svelte (bundler Vite), vanilla css, bez TS (JSDoc też działa)

---

### Jak przygotować :bomb:

```bash
$ git pull git@github.com:KlientGuy/HotelArtystow.git
$ cd hotel_artystow_front/
$ npm install
```

---

### Jak to odpalić :gear:

```bash
$ cd HotelArtystowApi/
$ dotnet run
$ cd ../hotel_artystow_front/
$ npm run dev
```

Potem odpalamy w przeglądarce\
* http://localhost:5001 -- na front
* http://localhost:5000/swagger/index.html -- na szwagra do testowania api
