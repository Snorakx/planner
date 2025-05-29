# Design System - ADHD Planner

Dokumentacja systemu designu aplikacji ADHD Planner z inspiracją stylem iOS.

## Spis treści
1. [Filozofia designu](#filozofia-designu)
2. [Kolory](#kolory)
3. [Typografia](#typografia)
4. [Komponenty UI](#komponenty-ui)
5. [Efekty i animacje](#efekty-i-animacje)
6. [Responsywność](#responsywność)
7. [Zasady dostępności](#zasady-dostępności)
8. [Elementy do dorobienia](#elementy-do-dorobienia)

## Filozofia designu

System designu ADHD Planner jest zainspirowany estetyką iOS 17, koncentrując się na:
- Minimalizmie i czystości interfejsu
- Czytelności i hierarchii informacji
- Efektach szkła i translucencji (backdrop blur)
- Subtelnych gradientach i efektach
- Zaokrąglonych kształtach
- Cieniowaniu dla budowania głębi
- Spójności w całej aplikacji
- Wsparciu dla trybu ciemnego i jasnego

## Kolory

### Kolory podstawowe

```css
/* Kolory podstawowe */
--color-primary: #4338CA;     /* Indigo 700 - Kolor główny, akcje, przyciski */
--color-secondary: #9333EA;   /* Fiolet 600 - Kolor uzupełniający */
--color-accent: #EC4899;      /* Różowy 500 - Kolor akcentowy */

/* Kolory tła */
--color-background: #F3F4F6;  /* Gray 100 - Tło główne (jasny tryb) */
--color-surface: #FFFFFF;     /* Biały - Tło kart i elementów (jasny tryb) */

/* Tryb ciemny - tła */
--color-dark-background: #0a0c14;  /* Gray 950 - Tło główne (ciemny tryb) */
--color-dark-surface: #1a1d29;     /* Gray 850 - Tło kart i elementów (ciemny tryb) */

/* Kolory statusów */
--color-error: #EF4444;       /* Czerwony 500 - Błędy */
--color-success: #10B981;     /* Szmaragdowy 500 - Sukces */
--color-warning: #F59E0B;     /* Bursztynowy 500 - Ostrzeżenia */

/* Kolory tekstu */
--color-text-primary: #111827;    /* Gray 900 - Tekst główny (jasny tryb) */
--color-text-secondary: #4B5563;  /* Gray 600 - Tekst uzupełniający (jasny tryb) */
--color-text-disabled: #9CA3AF;   /* Gray 400 - Tekst nieaktywny (jasny tryb) */

--color-dark-text-primary: #FFFFFF;      /* Biały - Tekst główny (ciemny tryb) */
--color-dark-text-secondary: #E5E7EB;    /* Gray 200 - Tekst uzupełniający (ciemny tryb) */
--color-dark-text-disabled: #9CA3AF;     /* Gray 400 - Tekst nieaktywny (ciemny tryb) */
```

### Paleta kolorów rozszerzonych

```css
/* Niebieskie */
--color-blue-100: #DBEAFE;
--color-blue-500: #3B82F6;
--color-blue-900: #1E3A8A;

/* Indigo */
--color-indigo-100: #E0E7FF;
--color-indigo-500: #6366F1;
--color-indigo-900: #312E81;

/* Fioletowe */
--color-purple-100: #EDE9FE;
--color-purple-500: #8B5CF6;
--color-purple-900: #4C1D95;

/* Różowe */
--color-pink-100: #FCE7F3;
--color-pink-500: #EC4899;
--color-pink-900: #831843;

/* Czerwone */
--color-red-100: #FEE2E2;
--color-red-500: #EF4444;
--color-red-900: #7F1D1D;

/* Pomarańczowe */
--color-orange-100: #FFEDD5;
--color-orange-500: #F97316;
--color-orange-900: #7C2D12;

/* Szare */
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-850: #1a1d29;
--color-gray-900: #111827;
--color-gray-950: #0a0c14;
```

### Stosowanie kolorów

#### Tła i powierzchnie

Tryb jasny:
```css
/* Tło główne */
bg-background dark:bg-gray-950

/* Powierzchnie (karty, panele) */
bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm
```

Tryb ciemny:
```css
/* Tło główne */
dark:bg-gray-950 dark:bg-gradient-to-b dark:from-gray-950 dark:to-black

/* Powierzchnie (karty, panele) */
dark:bg-gray-800/70 dark:border-gray-700/50
```

#### Efekt szkła

```css
backdrop-blur-sm bg-white/80 dark:bg-gray-800/70
backdrop-blur-md bg-white/80 dark:bg-black/10
backdrop-blur-xl bg-white/10 dark:bg-gray-800/30
```

#### Gradienty

```css
/* Gradientowe tła */
bg-gradient-to-r from-blue-500 to-indigo-600
bg-gradient-to-b from-gray-900 to-gray-950
bg-gradient-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-900/20

/* Teksty gradientowe */
bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300
```

## Typografia

### Rodzina fontów

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Rozmiary tekstu

```css
/* Nagłówki */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
```

### Grubość fontów

```css
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Przykłady użycia

```css
/* Nagłówek główny */
text-2xl md:text-3xl font-bold text-gray-800 dark:text-white

/* Podtytuł */
text-gray-600 dark:text-gray-300

/* Tekst główny */
text-gray-700 dark:text-gray-200

/* Tekst mały */
text-sm text-gray-500 dark:text-gray-400
```

## Komponenty UI

### Karty

#### Standardowa karta

```jsx
<div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
  {/* Zawartość karty */}
</div>
```

#### Karta z efektem szkła (silniejszy)

```jsx
<div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-3xl p-6 shadow-xl border border-white/10 transform transition-all duration-300">
  {/* Zawartość karty */}
</div>
```

### Przyciski

#### Przycisk podstawowy

```jsx
<button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium">
  Przycisk
</button>
```

#### Przycisk z ikoną

```jsx
<button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium">
  <svg className="w-5 h-5 mr-2" />
  Przycisk z ikoną
</button>
```

#### Przycisk ghost

```jsx
<button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-full transition-colors duration-200">
  Ghost Button
</button>
```

#### Przycisk z efektem szkła

```jsx
<button className="px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors duration-200 flex items-center border border-white/10 shadow-sm">
  Glass Button
</button>
```

### Segmented Controls

```jsx
<div className="flex bg-white/5 dark:bg-white/10 p-1 rounded-full">
  <button
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? "bg-white text-black dark:bg-white dark:text-black"
        : "text-white/60 hover:bg-white/10"
    }`}
  >
    Option 1
  </button>
  <button
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      !isActive
        ? "bg-white text-black dark:bg-white dark:text-black"
        : "text-white/60 hover:bg-white/10"
    }`}
  >
    Option 2
  </button>
</div>
```

### Formularze

#### Input

```jsx
<input
  type="text"
  className="w-full px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
  placeholder="Wpisz tekst..."
/>
```

#### Select

```jsx
<select className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-white/20">
  <option value="option1">Opcja 1</option>
  <option value="option2">Opcja 2</option>
</select>
```

### Wskaźniki

#### Progress Bar

```jsx
<div className="h-3 overflow-hidden rounded-full bg-gray-700/70 backdrop-blur-sm">
  <div
    style={{ width: `${percentage}%` }}
    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-200"
  ></div>
</div>
```

#### Status Badge

```jsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
  Status
</span>
```

## Efekty i animacje

### Tranzycje

```css
/* Standardowa tranzycja */
transition-all duration-300

/* Hover efekty */
hover:shadow-md hover:translate-y-[-2px] hover:bg-white/90
```

### Animacje

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Pulsowanie */
@keyframes pulseSubtle {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse-subtle {
  animation: pulseSubtle 2s ease-in-out infinite;
}

/* Podświetlenie elementu */
@keyframes highlightTask {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    transform: scale(1);
  }
  20% {
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
    transform: scale(1.01);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    transform: scale(1);
  }
}
```

## Responsywność

### Breakpointy

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Przykłady użycia

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {/* zawartość */}
</div>

<h1 className="text-xl md:text-2xl font-semibold">Tytuł</h1>

<div className="hidden md:block">
  {/* widoczne tylko na większych ekranach */}
</div>
```

### Widok mobilny vs desktop

```jsx
{/* Desktop Navigation */}
<div className="hidden md:flex justify-center py-2">
  {/* ... */}
</div>

{/* Mobile Navigation */}
<div className="md:hidden fixed bottom-0 inset-x-0">
  {/* ... */}
</div>
```

## Zasady dostępności

1. **Kontrast kolorów** - Zapewnij odpowiedni kontrast między tekstem a tłem
2. **Atrybuty aria** - Dodawaj do przycisków ikon i elementów interaktywnych
3. **Elementy semantyczne** - Używaj prawidłowych tagów HTML dla struktury
4. **Alternatywny tekst** - Dodawaj atrybuty `alt` do obrazów
5. **Responsywność** - Zapewnij użyteczność na wszystkich rozmiarach ekranów

## Elementy do dorobienia

Na podstawie analizy obecnego stanu aplikacji, poniższe elementy wymagają dopracowania, aby były w pełni zgodne z systemem designu:

1. **Planner View** - Należy zaktualizować niektóre elementy formularzy i przycisków o efekty szkła i odpowiednie zaokrąglenia w stylu iOS
2. **Daily View** - Wymaga dodania efektów translucencji, gradientów i spójnych zaokrągleń kart
3. **Modals** - Niektóre okna modalne używają starszego stylu bez efektu szkła
4. **Formularze** - Formularze edycji zadań wymagają ujednolicenia z resztą systemu designu
5. **Animacje przejść** - Warto dodać płynniejsze animacje przy przełączaniu między widokami 
6. **Ikonografia** - Należy stosować konsekwentny zestaw ikon w całej aplikacji
7. **Loading States** - Stany ładowania wymagają stylizacji zgodnej z systemem
8. **Toast notifications** - Powiadomienia wymagają implementacji w stylu iOS z efektem szkła

Po dostosowaniu powyższych elementów, aplikacja będzie miała w pełni spójny system designu inspirowany estetyką iOS. 