🎯 Projektöversikt
En fullstack trading-plattform där användare kan köpa och sälj fotbollsspelare som aktier baserat på deras matchprestationer. Priserna fluktuerar baserat på köp/sälj och simulerade matchresultat.

✅ MVP (minsta funktionella version)
– Auth: register, login, profil
– Player/Card: lista spelare, card details, ett kort per spelare
– Marketplace: köpa och sälja kort, säljaren sätter pris
– Portfolio: se sina ägda kort
– Transactions: enkel historik för köp/sälj

1. Backend – .NET API (Clean Architecture)
✅ 5 entiteter: Player, User, Transaction, Portfolio, PriceHistory

✅ Relationsmodeller: One-to-Many, Many-to-Many

✅ DTOs + AutoMapper: PlayerDto, TradeRequestDto, PortfolioDto

✅ Services + Repositories: PlayerService, TradeService, PortfolioRepository

✅ Validering: FluentValidation för alla requests

✅ Logging: Serilog med Azure Application Insights

✅ Global error handling: Custom Exception Middleware

✅ Avancerade endpoints:

GET /api/players/filter (filtrering på position/team)

GET /api/players/stats (aggregate statistik)

POST /api/trade/bulk (bulk trading)

2. Frontend – React
✅ 5 sidor/vyer:

/ - Landing page

/market - Marknad (alla spelare)

/portfolio - Min portfolio

/leaderboard - Topplista

/profile - Användarprofil

✅ Formulär för CRUD: Trade forms, user registration

✅ Listor + dynamisk rendering: Virtual scrolling för spelarlista

✅ API-integration: Axios med interceptors

✅ Error states + loading states: Skeletons, error boundaries

✅ Miljövariabler: .env för API URLs

✅ UI/UX: Responsiv design med Tailwind CSS

3. Databas – Azure SQL
✅ Skapad i Azure: fse-database.database.windows.net

✅ Connection string: Azure Key Vault integration

✅ Migrationer: EF Core migrations

✅ Relationsmodell: Normaliserad med foreign keys

✅ Indexering: Clustered indexes på PlayerId, UserId

4. CI/CD – GitHub Actions
✅ Backend pipeline:

yaml
- dotnet restore
- dotnet build
- dotnet test
- deploy to Azure App Service
✅ Frontend pipeline:

yaml
- npm install
- npm run build
- deploy to Azure Static Web Apps

