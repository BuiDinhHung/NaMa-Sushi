# Ảnh bìa danh mục menu — tạo ảnh mới bằng AI

Khung ảnh bìa trên web luôn có tỷ lệ **16:9**. Kích thước hiển thị thực tế khoảng 957×538 px trên laptop 1440 px và 1105×622 px trên màn 1920 px. Trên điện thoại khung rộng bằng màn hình, khoảng 342×192 px.

**Xuất ảnh: 1920×1080 px (16:9), JPG hoặc WebP, nhẹ hơn 300 KB.** Ảnh đúng tỷ lệ này sẽ hiện trọn vẹn, không bị cắt.

## Cách làm

1. Mở công cụ tạo ảnh có chức năng mở rộng ảnh (outpaint) hoặc tạo ảnh từ ảnh mẫu, chẳng hạn Photoshop *Generative Expand*, ChatGPT/DALL·E, Gemini hoặc Canva *Magic Expand*.
2. Tải lên ảnh gốc ghi trong bảng (thư mục `dist/assets/`) và chọn khung 16:9.
3. Dán prompt của danh mục đó, kèm đoạn phong cách chung bên dưới.
4. Lưu ảnh đè lên đúng tên file `dist/assets/cover-XX.webp`. Có thể lưu `.jpg`, nhưng khi đó phải sửa tên file tương ứng trong `dist/menu.json`.
5. Tải lại trang bằng Ctrl+F5.

**Lưu ý:** chạy `.source/make_covers.py` sẽ ghi đè ảnh cover. Sau khi đã thay bằng ảnh AI thì không chạy script đó nữa.

**Phong cách chung (dán thêm vào mọi prompt):**
`Premium restaurant food photography, dark moody background in deep charcoal green, warm soft side light, shallow depth of field, elegant minimal plating, photorealistic, 16:9 landscape composition with the dish centered and some breathing room on both sides, no text, no logo, no watermark.`

## Danh sách

| File | Danh mục | Ảnh gốc làm mẫu | Prompt |
|---|---|---|---|
| cover-01 | Suppen & Vorspeisen | original-03 | Pan-fried Japanese gyoza on a rustic ceramic plate with spring onion, small bowl of ponzu dipping sauce, edamame on the side |
| cover-02 | Salate | original-04 | Asian green papaya / mango salad with shredded carrot, herbs and peanuts in a grey ceramic bowl |
| cover-03 | Bowls | original-05 | Poke bowl with salmon rose, avocado slices, cucumber, edamame, radish, corn and sushi rice |
| cover-04 | Hauptspeisen | original-06 | Yaki udon stir-fried noodles with sliced seared beef, pak choi, peppers and sesame in a stoneware bowl |
| cover-05 | Vietnamesische Spezialitäten | original-07 | Vietnamese pho with beef, rice noodles, fresh herbs and chili in a dark bowl on a wooden table, chopsticks beside it, light steam |
| cover-06 | Beilagen | original-08 | Simple sides: a bowl of steamed jasmine rice, a bowl of sushi rice and a small bowl of udon noodles, neatly arranged |
| cover-07 | Nigiri · 2 Stück | original-09 + nama-06 | Row of salmon and tuna nigiri on a dark stone plate |
| cover-08 | Aburi Nigiri · 2 Stück | original-10 + nama-05 | Flame-seared (aburi) salmon and tuna nigiri with light torch char, small garnish |
| cover-09 | Maki · 6 Stück | original-11 | Six salmon maki rolls on a speckled white rectangular ceramic plate |
| cover-10 | Inside-Out · 8 Stück | original-13 | Eight inside-out sushi rolls with sesame and tobiko, avocado and cucumber filling |
| cover-11 | Special Rolls · 8 Stück | original-14 | Special sushi rolls topped with seared beef, edible violet flowers and sauce dots on a deep blue oval plate |
| cover-12 | Sashimi · 6 Stück | original-16 | Salmon sashimi slices on a bed of crushed ice with shiso leaf, daikon threads and an edible purple flower |
| cover-13 | Tempura Rolls | original-18 + nama-12 | Crispy tempura sushi rolls with unagi sauce and mayo drizzle on a blue ceramic plate |
| cover-14 | Sushi-Menüs | original-20 | Large sushi platter for sharing on black slate: nigiri, maki, special rolls and a small sashimi bowl |
| cover-15 | Nachtisch | original-21 | Three mochi ice cream balls (white, matcha, red bean) on a dark plate |
| cover-16 | Softdrinks & Säfte | original-22 | Glass of cola with ice cubes and condensation next to a glass of orange juice |
| cover-17 | Kaffee & Tee | original-23 | Espresso pouring into a cup next to a glass of Asian tea with lemongrass |
| cover-18 | Hausgemachte Getränke | original-24 | Homemade iced lemonade with lime, mint and chia seeds in tall glasses |
| cover-19 | Aperitif, Digestif & Bier | original-25 + original-27 | Aperol Spritz, a freshly tapped pilsner beer and a small glass of sake on a bar counter |
| cover-20 | Weine | original-26 | Glass of red wine and glass of white wine with a bottle beside, wooden barrel in the background |

**Lưu ý:** ảnh AI là ảnh minh hoạ, món thật có thể trông khác. Nên cho chủ quán duyệt trước khi đưa lên. Nếu muốn ảnh chân thực nhất, cách tốt nhất vẫn là chụp ngang (16:9) món thật tại quán.
