# ⚠️ Database Migratie Vereist

## Probleem
Je krijgt een 500 Internal Server Error bij het maken van een opleiding omdat de database nog niet is gemigreerd met de nieuwe velden.

## Oplossing

### Optie 1: Prisma DB Push (Snelste voor Development)
```bash
npx prisma db push
```

### Optie 2: Prisma Migrate (Aanbevolen voor Production)
```bash
# Maak een nieuwe migratie
npx prisma migrate dev --name update_opleiding_model

# Of deploy bestaande migraties
npx prisma migrate deploy
```

### Optie 3: Voor Vercel Deployment

1. **Lokaal migratie uitvoeren:**
   ```bash
   npx prisma db push
   ```

2. **Of voeg toe aan build proces:**
   Update `package.json`:
   ```json
   {
     "scripts": {
       "build": "prisma generate && prisma db push && next build"
     }
   }
   ```

3. **Of gebruik Vercel CLI:**
   ```bash
   vercel env pull
   npx prisma db push
   ```

## Nieuwe Velden in Opleiding Model

De volgende velden zijn toegevoegd aan het Opleiding model:
- `partnerCountry`
- `partnerSchool`
- `shortDescription`
- `longDescription`
- `programType` (enum)
- `schoolAddress`, `schoolCity`, `schoolCountry`
- `schoolEmail`, `schoolPhone`, `schoolWebsite`
- `admissionRequirements`
- `studyDurationYears`
- `startDate`
- `language`
- `tuitionFeeYear`
- `scholarships`
- `requiredDocuments` (array)
- `applicationDeadline`
- `processingTime`
- `interviewRequired`
- `intakeFormRequired`
- `additionalTests` (array)
- `thumbnailUrl`, `bannerUrl`, `promoVideoUrl`
- `isVisible`
- `tags` (array)
- `documents` (array)

## Verificatie

Na de migratie, controleer of alles werkt:
```bash
npx prisma studio
```

Je zou alle nieuwe velden moeten zien in de `opleidingen` tabel.


