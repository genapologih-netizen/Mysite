---
name: site-dev
description: Use this skill for ALL tasks related to the avtopoliv-ufa website located in avtopoliv-site/. Triggers whenever the user asks to change appearance, fix layout, add a section, improve code, optimize SEO, fix responsiveness, update text/colors/fonts, or anything visual or functional on the site. Also use when the user says "переделай", "добавь", "измени", "улучши", "сломалось", "не работает" in the context of this site.
---

# Навык: доработка сайта АвтополивУфа

Сайт находится в `avtopoliv-site/`. Ветка для всех работ — `dev`. Ветку `main` не трогать никогда.

## Правила работы

### Перед изменением существующего кода — СПРОСИ
Если задача требует изменить **уже написанный** CSS-класс, JS-функцию или HTML-блок (не добавить новый, а именно изменить существующий) — сначала опиши пользователю что именно хочешь изменить и почему, и дождись подтверждения.

Исключение: явные баги (синтаксическая ошибка, битый тег) — их можно чинить без спроса, но сообщить об этом.

### Не ломать сайт
После каждого изменения обязательно:
1. Проверить HTML-структуру (все теги закрыты)
2. Проверить что все JS-идентификаторы (`getElementById`, `querySelector`) присутствуют в HTML
3. Убедиться что CSS-классы, добавленные в HTML, определены в style.css

### Всегда работать в dev ветке
```bash
git checkout dev
```

---

## Процесс выполнения задачи

### 1. Понять задачу
Если запрос расплывчатый ("сделай красивее", "исправь"), уточни одним конкретным вопросом что именно.

### 2. Запланировать изменения
Кратко скажи пользователю что собираешься изменить — 2-3 строки. Для небольших правок (цвет, отступ, текст) можно сразу делать без уточнения.

### 3. Внести изменения
Файлы сайта:
- `avtopoliv-site/index.html` — разметка
- `avtopoliv-site/style.css` — стили
- `avtopoliv-site/script.js` — поведение
- `avtopoliv-site/privacy.html` — политика конфиденциальности

Правила:
- CSS: добавляй новые правила в конец файла, не переписывай существующие без спроса
- JS: не удаляй и не переписывай существующие обработчики без спроса
- HTML: сохраняй все `id` и `class` на которые есть ссылки в JS

### 4. Проверка после изменений
```python
# Быстрая проверка целостности
python3 -c "
from html.parser import HTMLParser
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def handle_starttag(self,t,a):
        if t not in self.void: self.stack.append(t)
    def handle_endtag(self,t):
        if t not in self.void and self.stack and self.stack[-1]==t: self.stack.pop()
with open('avtopoliv-site/index.html') as f: html=f.read()
c=Check(); c.feed(html)
print('OK' if not c.stack else 'BROKEN: '+str(c.stack[-5:]))
"
```

### 5. Запустить сервер для просмотра
После каждого изменения перезапусти сервер:
```bash
fuser -k 8080/tcp 2>/dev/null; cd avtopoliv-site && python3 -m http.server 8080 > /tmp/server.log 2>&1 &
sleep 1 && curl -s -o /dev/null -w "Server: %{http_code}" http://localhost:8080/
```
Сообщи пользователю: **"Открой http://localhost:8080 для просмотра"**

### 6. Закоммитить (только если пользователь просит)
```bash
git add avtopoliv-site/
git commit -m "описание изменений"
```

---

## Структура сайта (секции index.html)

| Секция | id/class | Описание |
|--------|----------|----------|
| Шапка | `#header` | Лого, телефон, навигация, бургер |
| Герой | `.hero` | SVG-иллюстрация, заголовок, кнопки, статистика |
| Услуги | `#services` | 4 карточки услуг |
| Преимущества | `#benefits` | 6 блоков |
| Процесс | `#process` | 5 шагов |
| Цены | `#pricing` | 3 тарифа |
| Портфолио | `#portfolio` | Фото-галерея |
| Отзывы | `#reviews` | Слайдер + форма отзыва |
| FAQ | `#faq` | Аккордеон |
| Бонусы | `#bonuses` | 4 карточки |
| Заявка | `#cta` | Форма с согласием 152-ФЗ |
| Футер | `footer` | Контакты, ссылки |

## Ключевые CSS-переменные (из style.css)
```
--g6, --g7, --g8  — зелёные акценты
--t5              — серый текст
```

## Важные ограничения
- Форма заявки (`#cta-form`) и форма отзыва (`#review-form`) должны сохранять чекбоксы согласия (152-ФЗ)
- Не удалять `privacy.html` и ссылки на неё
- Все анимации в `.hero` управляются через CSS-классы `hwater`, `hero-cloud-*`, `hero-controller` и т.д.
