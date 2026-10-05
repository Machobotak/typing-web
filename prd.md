# PRD — 3D Typing Test App

## 1. Overview

### Nama sementara
**Type3D**

### Deskripsi
Type3D adalah aplikasi web typing test yang memungkinkan pengguna menguji dan meningkatkan kemampuan mengetik melalui pengalaman interaktif dengan **keyboard 3D yang bergerak secara real-time ketika tombol ditekan**.

Aplikasi menggabungkan:
- Typing test seperti Monkeytype
- Visualisasi keyboard 3D
- Animasi tombol keyboard
- Sound effect setiap tombol ditekan
- Statistik typing secara real-time
- Dukungan bahasa Indonesia dan Inggris
- Interface minimalis dan modern

Fokus utama aplikasi adalah memberikan pengalaman typing yang **immersive, responsive, dan menyenangkan**.

---

# 2. Problem Statement

Aplikasi typing test pada umumnya hanya menampilkan teks yang harus diketik dan statistik hasil.

Walaupun efektif untuk mengukur kemampuan mengetik, pengalaman tersebut cenderung monoton.

Type3D ingin memberikan pengalaman yang lebih interaktif dengan menghadirkan keyboard virtual 3D yang:
1. Bergerak ketika pengguna menekan tombol.
2. Menampilkan tombol yang sedang ditekan.
3. Memberikan suara keyboard.
4. Memberikan feedback visual ketika terjadi kesalahan.
5. Tetap mempertahankan fokus utama pada typing performance.

---

# 3. Goals

## Primary Goals
1. Membuat typing test yang cepat dan responsif.
2. Menampilkan keyboard 3D yang bereaksi terhadap input pengguna.
3. Memberikan sound effect keyboard secara real-time.
4. Mendukung bahasa Indonesia dan Inggris.
5. Menampilkan statistik typing secara akurat.
6. Memberikan pengalaman UI yang minimalis dan modern.
7. Membuat aplikasi dapat digunakan tanpa login.

## Secondary Goals
1. Menyimpan hasil typing test secara lokal.
2. Menyediakan berbagai mode typing test.
3. Memberikan statistik performa pengguna.
4. Menyediakan pengaturan sound dan visual.
5. Menyediakan leaderboard pada pengembangan berikutnya.

---

# 4. Target User

Target utama:
- Mahasiswa
- Programmer
- Typing enthusiast
- Pengguna yang ingin meningkatkan typing speed
- Pengguna mechanical keyboard
- Orang yang ingin melakukan typing practice

Target sekunder:
- Content creator
- Gamer
- Competitive typist

---

# 5. Core User Experience

```text
Open Website
     ↓
Typing Test
     ↓
Choose Language
     ↓
Choose Test Mode
     ↓
Start Typing
     ↓
3D Keyboard Reacts
     ↓
Keyboard Sound Plays
     ↓
Typing Statistics Update
     ↓
Finish Test
     ↓
Result Screen
     ↓
Retry / Change Mode
```

---

# 6. Core Features

## 6.1 Typing Test

Pengguna diberikan sebuah teks yang harus diketik.

Contoh:

```text
Teknologi berkembang dengan sangat cepat dan
memberikan banyak perubahan dalam kehidupan manusia.
```

Setiap karakter memiliki state:
- Pending
- Current
- Correct
- Incorrect

---

# 7. Language

Aplikasi mendukung dua bahasa:

```text
🇮🇩 Indonesian
🇬🇧 English
```

Pengguna dapat memilih bahasa sebelum memulai typing test.

### Indonesian

```text
Teknologi memberikan banyak kemudahan dalam
kehidupan manusia dan terus berkembang setiap hari.
```

### English

```text
Technology continues to change the way people
work, communicate, and learn every day.
```

---

# 8. Typing Modes

Untuk MVP:

## Time Mode

Pilihan:

```text
15s
30s
60s
120s
```

Default:

```text
30 seconds
```

## Words Mode

Pilihan:

```text
10
25
50
100
```

## Quote Mode

Pengguna diberikan sebuah paragraf atau quote lengkap.

Mode ini dapat dikembangkan setelah MVP.

---

# 9. 3D Keyboard

## Concept

Fitur utama aplikasi adalah keyboard virtual 3D.

Keyboard dibuat menggunakan model 3D sehingga setiap tombol dapat bergerak ketika pengguna menekan tombol fisik.

Ketika user menekan sebuah tombol:
1. Tombol bergerak ke bawah.
2. Sound effect dimainkan.
3. Pencahayaan/visual tombol berubah.
4. Tombol kembali ke posisi semula.

---

# 10. Keyboard Animation

Setiap tombol memiliki animation state:

```text
IDLE
  ↓
PRESSED
  ↓
RELEASED
  ↓
IDLE
```

Contoh animasi:

```text
Idle
  ↓
translateY(0)

Pressed
  ↓
translateY(4px)

Released
  ↓
translateY(0)
```

Target durasi animasi:

```text
50–100ms
```

Animasi harus terasa cepat agar tidak mengganggu typing.

---

# 11. Keyboard Layout

Default menggunakan layout QWERTY:

```text
Q W E R T Y U I O P

 A S D F G H J K L

  Z X C V B N M
```

Tombol tambahan:

```text
ESC
TAB
CAPS
SHIFT
CTRL
ALT
SPACE
ENTER
BACKSPACE
```

Untuk MVP, fokus visual dapat diberikan pada:

```text
A-Z
SPACE
BACKSPACE
ENTER
SHIFT
```

---

# 12. Keyboard Interaction

Ketika user menekan keyboard fisik:

```text
User presses "A"
        ↓
Detect Keyboard Event
        ↓
Find 3D Key "A"
        ↓
Trigger Animation
        ↓
Play Sound
        ↓
Process Typing Input
```

3D keyboard harus mengikuti input keyboard pengguna secara real-time.

---

# 13. Key Highlight

Tombol yang harus ditekan berikutnya dapat diberi highlight.

Contoh:

```text
Text:

hello world
^

Next character = h
```

Keyboard:

```text
┌───┐
│ H │ ← Highlight
└───┘
```

Fitur ini dapat dibuat sebagai opsi:

```text
Key Hint:
ON / OFF
```

Default:

```text
OFF
```

---

# 14. Keyboard Sound

Setiap tombol menghasilkan suara.

Contoh:
- A → key sound
- B → key sound
- C → key sound
- SPACE → spacebar sound
- ENTER → enter sound
- BACKSPACE → backspace sound

Sound harus terasa seperti mechanical keyboard.

---

# 15. Sound Settings

## Sound

```text
Keyboard Sound
ON / OFF
```

## Volume

```text
0%
25%
50%
75%
100%
```

Default:

```text
50%
```

---

# 16. Typing Statistics

Statistik ditampilkan secara real-time.

Minimal:

```text
WPM
Accuracy
Errors
Time
```

Contoh:

```text
       87 WPM

      96.4%

     3 Errors

     00:18
```

---

# 17. WPM Calculation

WPM menggunakan standar:

```text
WPM = (Characters Typed / 5) / Minutes
```

Contoh:

```text
Characters = 250
Time = 1 minute

WPM = 250 / 5
    = 50 WPM
```

---

# 18. Accuracy

```text
Accuracy =
Correct Characters / Total Typed Characters × 100
```

Contoh:

```text
Correct = 95
Incorrect = 5

Accuracy =
95 / 100 × 100

= 95%
```

---

# 19. Error Detection

Jika user mengetik karakter yang salah:

```text
Expected:
A

User:
S
```

Result:

```text
Expected Character → A
User Input → S
Result → Incorrect
```

Karakter salah diberikan visual berbeda.

```text
Correct → normal
Incorrect → red
```

---

# 20. Backspace Behavior

Backspace dapat menghapus karakter terakhir yang diketik.

Contoh:

```text
Expected:
hello

User:
hellp
```

Jika user menekan Backspace:

```text
hell
```

User dapat mengetik ulang karakter yang benar.

---

# 21. Test Start

Sebelum mulai:

```text
Ready?

30
seconds

Press any key to start
```

Ketika pengguna menekan tombol pertama:

```text
Timer starts
```

---

# 22. Test Result

Setelah test selesai, tampilkan result screen.

Contoh:

```text
TEST COMPLETE

92 WPM

97.2% Accuracy

4 Errors

30 seconds
```

Statistik tambahan:
- Characters
- Correct
- Incorrect
- Consistency

---

# 23. Result Actions

```text
[ Try Again ]

[ Change Mode ]

[ Change Language ]
```

---

# 24. Personal Best

Aplikasi menyimpan best score secara lokal.

Contoh:

```text
Personal Best

WPM
104

Accuracy
98.2%
```

MVP menggunakan:

```text
localStorage
```

Database belum diperlukan.

---

# 25. History

MVP dapat menyimpan beberapa hasil terakhir.

Contoh:

| Date | Mode | Language | WPM | Accuracy |
|---|---|---|---:|---:|
| Today | 30s | English | 92 | 97% |
| Today | 30s | Indonesian | 87 | 95% |
| Yesterday | 60s | English | 90 | 96% |

Jumlah history dapat dibatasi:

```text
Last 50 tests
```

---

# 26. Dashboard

Halaman utama:

```text
┌───────────────────────────────────────┐
│               TYPE3D                  │
│                                       │
│     Indonesian | English              │
│                                       │
│  15s   30s   60s   120s              │
│                                       │
│       Typing Area                     │
│                                       │
│  WPM      Accuracy      Time          │
│                                       │
│           3D Keyboard                 │
│                                       │
└───────────────────────────────────────┘
```

---

# 27. UI Design

## Design Direction

Style:
- Minimal
- Modern
- Dark
- Clean
- Premium
- Minimal distraction

Inspirasi:

```text
Monkeytype
+
Mechanical keyboard
+
3D visualization
```

Desain tidak boleh menyalin UI Monkeytype secara langsung.

---

# 28. Theme

Default:

```text
Dark Mode
```

Contoh palette:

```text
Background
#0F1115

Primary
#FFFFFF

Secondary
#8B8F98

Accent
#7C5CFF

Correct
#FFFFFF

Incorrect
#FF4D4D
```

---

# 29. Responsive Design

Prioritas utama:

```text
Desktop-first
```

Target:
- 1920 × 1080
- 1440 × 900
- 1366 × 768

Tablet tetap didukung.

Mobile tetap dapat membuka aplikasi, tetapi 3D keyboard dapat disederhanakan karena pengguna tidak menggunakan keyboard fisik.

---

# 30. Technology Stack

## Frontend

```text
Next.js
TypeScript
```

## Styling

```text
Tailwind CSS
```

## 3D

```text
Three.js
React Three Fiber
@react-three/drei
```

## Animation

```text
Framer Motion
```

Untuk animasi objek 3D, animasi langsung melalui Three.js/React Three Fiber dapat digunakan.

## Audio

```text
Web Audio API
```

atau library audio ringan.

---

# 31. Architecture

```text
                    ┌───────────────┐
                    │    Browser    │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
        Typing Engine   3D Keyboard    Audio Engine
             │              │              │
             ↓              ↓              ↓
          Stats          Animation       Sound
             │
             ↓
        Result Engine
             │
             ↓
        Local Storage
```

---

# 32. Typing Engine

Typing engine bertanggung jawab terhadap:
- Keyboard event
- Character validation
- Timer
- WPM
- Accuracy
- Errors
- Test completion

Flow:

```text
Keyboard Event
      ↓
Typing Engine
      ↓
Compare Input
      ↓
Correct / Incorrect
      ↓
Update Statistics
      ↓
Update UI
      ↓
Trigger Keyboard Animation
      ↓
Trigger Sound
```

---

# 33. Keyboard Engine

Bertanggung jawab terhadap:
- Mapping keyboard key
- 3D key state
- Animation
- Highlight
- Press/release event

Contoh state:

```typescript
{
  key: "A",
  state: "pressed",
  position: {
    x: 0,
    y: 0,
    z: 0
  }
}
```

---

# 34. Audio Engine

Bertanggung jawab terhadap:

```text
Key Press
Space
Enter
Backspace
Error
```

Flow:

```text
Keyboard Event
      ↓
Audio Engine
      ↓
Play Sound
```

Audio harus di-preload agar tidak terasa delay.

---

# 35. Text Dataset

Dataset typing dipisahkan berdasarkan bahasa:

```text
/data
   /id
      words.json
      quotes.json

   /en
      words.json
      quotes.json
```

Contoh:

```json
{
  "words": [
    "teknologi",
    "komputer",
    "program",
    "sistem"
  ]
}
```

---

# 36. Random Text Generator

Flow:

```text
Select Language
       ↓
Load Dataset
       ↓
Randomize Words
       ↓
Generate Text
       ↓
Display Typing Text
```

Generator harus memastikan teks cukup panjang untuk durasi test.

---

# 37. Settings

Settings minimal:

```text
Language
Test Mode
Test Duration
Sound
Sound Volume
3D Keyboard
Key Hint
Theme
```

Contoh:

```text
Settings

Language
[ English ▼ ]

Sound
[ ON ]

Volume
[ ━━━━━━━ ]

3D Keyboard
[ ON ]

Key Hint
[ OFF ]
```

---

# 38. Accessibility

Aplikasi harus memperhatikan:
- Keyboard navigation
- Focus state
- Kontras warna
- Reduced motion
- Sound toggle
- Tidak bergantung hanya pada warna

Pengguna dapat mengaktifkan:

```text
Reduce Motion
```

untuk mengurangi animasi 3D.

---

# 39. Performance Requirements

Karena menggunakan 3D, performa menjadi prioritas.

Target:

```text
60 FPS
```

pada desktop modern.

3D keyboard tidak boleh menyebabkan typing input delay.

Target input latency:

```text
< 50ms
```

Jika device tidak mendukung WebGL dengan baik:

```text
Fallback → 2D Keyboard
```

---

# 40. MVP Scope

## Included
- Typing test
- Indonesian
- English
- 15/30/60/120 second mode
- Word mode
- WPM
- Accuracy
- Error count
- Timer
- 3D keyboard
- Key animation
- Keyboard sound
- Sound toggle
- Volume control
- Result screen
- Personal best
- Local history
- Dark theme
- Responsive desktop UI

## Not Included
- Login
- Cloud database
- Online leaderboard
- Multiplayer
- Social features
- Custom user profiles
- Achievements
- Custom keyboard model
- Custom sound upload

---

# 41. Future Features

## Phase 2
- User account
- Cloud synchronization
- Global leaderboard
- User profile
- More languages
- More typing modes

## Phase 3
- Custom 3D keyboard
- RGB lighting
- Custom keycap
- Custom switch sound
- Sound pack
- Keyboard themes

Contoh switch sound:

```text
Cherry MX Red
Cherry MX Blue
Cherry MX Brown
Linear
Tactile
Clicky
```

---

# 42. Advanced 3D Features

## RGB Keyboard

```text
Reactive RGB
Wave RGB
Per-key RGB
```

## Keycap Animation

Tombol benar:

```text
normal press
```

Tombol salah:

```text
shake animation
```

## Typing Visualization

```text
key press
↓
light pulse
↓
key animation
↓
sound
```

---

# 43. Gamification

## Daily Challenge

```text
Daily Typing Challenge

Target:
100 WPM

Best:
87 WPM
```

## Streak

```text
🔥 7 Day Streak
```

## Achievement

```text
First 50 WPM
First 75 WPM
First 100 WPM
98% Accuracy
100% Accuracy
```

---

# 44. Success Metrics

## Performance
- Typing input tidak terasa delay.
- 3D keyboard berjalan stabil.
- Sound tidak mengalami delay yang mengganggu.
- Target 60 FPS pada desktop modern.

## Functionality
- WPM dihitung dengan benar.
- Accuracy dihitung dengan benar.
- Error terdeteksi dengan benar.
- Timer bekerja dengan benar.
- Test dapat diulang tanpa reload.

## UX

User dapat:

```text
Open website
→ Select language
→ Select mode
→ Start typing
→ Finish test
→ See result
```

tanpa kebingungan.

---

# 45. Acceptance Criteria

## Typing Test
- [ ] User dapat memulai typing test.
- [ ] Timer berjalan setelah input pertama.
- [ ] Karakter benar terdeteksi.
- [ ] Karakter salah terdeteksi.
- [ ] Backspace bekerja.
- [ ] WPM dihitung real-time.
- [ ] Accuracy dihitung real-time.
- [ ] Test berhenti ketika waktu habis.
- [ ] Result ditampilkan setelah test selesai.

## Language
- [ ] Indonesian tersedia.
- [ ] English tersedia.
- [ ] Dataset dipisahkan berdasarkan bahasa.
- [ ] User dapat mengganti bahasa.

## 3D Keyboard
- [ ] Keyboard 3D ditampilkan.
- [ ] Tombol dapat dianimasikan.
- [ ] Tombol bergerak ketika ditekan.
- [ ] Keyboard mengikuti input fisik.
- [ ] Key highlight dapat diaktifkan/dinonaktifkan.

## Audio
- [ ] Key sound dimainkan ketika tombol ditekan.
- [ ] Sound dapat dimatikan.
- [ ] Volume dapat diatur.
- [ ] Audio tidak menyebabkan typing delay.

## Result
- [ ] WPM ditampilkan.
- [ ] Accuracy ditampilkan.
- [ ] Error ditampilkan.
- [ ] User dapat mencoba kembali.
- [ ] Personal best disimpan.

---

# 46. Recommended Folder Structure

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── test/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── components/
│   ├── typing/
│   │   ├── TypingArea.tsx
│   │   ├── TypingText.tsx
│   │   ├── TypingStats.tsx
│   │   └── Timer.tsx
│   │
│   ├── keyboard/
│   │   ├── Keyboard3D.tsx
│   │   ├── Key3D.tsx
│   │   └── KeyboardControls.tsx
│   │
│   ├── audio/
│   │   └── AudioManager.ts
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Select.tsx
│       └── Modal.tsx
│
├── engine/
│   ├── typingEngine.ts
│   ├── statistics.ts
│   ├── textGenerator.ts
│   └── timer.ts
│
├── data/
│   ├── id/
│   │   ├── words.json
│   │   └── quotes.json
│   │
│   └── en/
│       ├── words.json
│       └── quotes.json
│
├── hooks/
│   ├── useTyping.ts
│   ├── useKeyboard.ts
│   └── useSound.ts
│
├── lib/
│   └── storage.ts
│
└── types/
    └── typing.ts
```

---

# 47. Development Roadmap

## Phase 1 — Foundation
- Setup Next.js
- Setup TypeScript
- Setup Tailwind
- Setup project structure
- Create basic UI

## Phase 2 — Typing Engine
- Keyboard input
- Text generator
- Timer
- WPM
- Accuracy
- Error detection
- Result screen

## Phase 3 — 3D Keyboard
- Setup Three.js
- Create keyboard model
- Create key components
- Keyboard mapping
- Key press animation
- Key highlight

## Phase 4 — Audio
- Add keyboard sounds
- Audio preload
- Volume control
- Sound toggle

## Phase 5 — Persistence
- localStorage
- Personal best
- Test history

## Phase 6 — Polish
- Animations
- Responsive design
- Loading state
- Error handling
- Performance optimization
- Accessibility

## Phase 7 — Deployment

Recommended:

```text
Frontend → Vercel
```

MVP tidak membutuhkan backend.

---

# 48. Final MVP Experience

Target pengalaman akhir:

```text
             TYPE3D

        English · 30s

     ┌─────────────────────┐
     │ The quick brown fox │
     │ jumps over the lazy │
     │ dog...              │
     └─────────────────────┘

           94 WPM
           97.5%
           00:18


       ┌─────────────────────┐
       │ Q W E R T Y U I O P │
       │  A S D F G H J K L  │
       │   Z X C V B N M     │
       │       SPACE         │
       └─────────────────────┘

        [ Settings ] [ Restart ]
```

Tujuan utama bukan membuat keyboard 3D yang kompleks, tetapi membuat **typing experience yang terasa hidup**:

```text
Physical Keyboard
       ↓
Keyboard Input
       ↓
Typing Engine
       ├──→ Text Update
       ├──→ WPM
       ├──→ Accuracy
       ├──→ 3D Animation
       └──→ Keyboard Sound
```

Dengan pendekatan ini, **3D keyboard menjadi bagian dari typing engine**, bukan sekadar dekorasi.
