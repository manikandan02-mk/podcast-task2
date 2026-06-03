# 🎙️ Podcast Admin Dashboard

Animal Planet – Podcast Management System built with **ReactJS + PHP + MySQL**.

---

## 📁 Folder Structure

```
podcast-admin/
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/             ← Place converted PNG images here
│   │   ├── components/
│   │   │   ├── Header.jsx / .css
│   │   │   ├── PodcastForm.jsx / .css
│   │   │   ├── PodcastCard.jsx / .css
│   │   │   ├── StatsCard.jsx / .css
│   │   │   ├── AudioPlayer.jsx / .css
│   │   │   ├── ConfirmDialog.jsx / .css
│   │   │   ├── Pagination.jsx / .css
│   │   │   ├── Spinner.jsx / .css
│   │   │   └── Toast.jsx / .css
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   └── AdminDashboard.jsx / .css
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── backend/                    # PHP REST API
│   ├── api/
│   │   ├── index.php           # Main router + all endpoints
│   │   └── .htaccess
│   ├── uploads/
│   │   ├── thumbnails/         ← Uploaded thumbnail images
│   │   └── audio/              ← Uploaded MP3 files
│   └── config.php
│
├── database/
│   └── schema.sql              # MySQL schema + seed data
│
├── scripts/
│   └── convert_images.sh       # Converts GIF/JPG assets → PNG
│
└── source_assets/              ← Drop original uploaded files here
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 16 |
| npm | ≥ 8 |
| PHP | ≥ 7.4 |
| MySQL | ≥ 5.7 |
| Apache / XAMPP | mod_rewrite enabled |
| ImageMagick | Any recent version |

---

## 🚀 Setup Instructions

### Step 1 – Convert Images

Place all original uploaded files in `source_assets/`:
```
source_assets/
  animal_planet_logo.jpg
  logout_icon.png
  edit_icon.png
  delete_icon.png
  attachment_icon.png
  ima_03__1_.gif
  ima_05.gif   ima_07.gif   ima_12.gif   ima_13.gif
  ima_14.gif   ima_18.gif   ima_19.gif
  ima_20.jpg
```

Run conversion:
```bash
bash scripts/convert_images.sh
```

This copies PNG files to `frontend/src/assets/` and `backend/uploads/thumbnails/`.

### Step 2 – Database

```bash
mysql -u root -p < database/schema.sql
```

Or in phpMyAdmin: import `database/schema.sql`.

### Step 3 – Backend

1. Copy the `backend/` folder to your Apache web root:
   ```
   /var/www/html/podcast-admin/backend/
   # OR for XAMPP:
   C:/xampp/htdocs/podcast-admin/backend/
   ```
2. Edit `backend/config.php` with your MySQL credentials:
   ```php
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```
3. Ensure `mod_rewrite` is enabled and `AllowOverride All` is set.
4. Make `uploads/` writable:
   ```bash
   chmod -R 755 backend/uploads/
   ```

API will be available at: `http://localhost/podcast-admin/backend/api/podcasts`

### Step 4 – Frontend

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

> **Production build:**
> ```bash
> npm run build
> ```
> Copy `build/` into Apache web root.

### Step 5 – Add a Sample Audio File

Place any `.mp3` file at:
```
backend/uploads/audio/sample.mp3
```
This is referenced by the seeded podcast records.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/podcasts?page=1&limit=9` | List all podcasts (paginated) |
| GET | `/api/podcasts/{id}` | Get single podcast |
| POST | `/api/podcasts` | Add new podcast (multipart) |
| PUT | `/api/podcasts/{id}` | Update podcast |
| DELETE | `/api/podcasts/{id}` | Delete podcast |

---

## ✨ Features

- **CRUD** – Add, view, edit, delete podcasts
- **File Uploads** – Thumbnail (JPG/PNG/WEBP ≤5MB) + Audio (MP3 ≤20MB)
- **Regex Validation** – Title, description, file type/size validated on both frontend and backend
- **Audio Player** – Modal player with progress bar, play/pause
- **Toast Notifications** – Success/error feedback
- **Confirm Dialog** – Deletion confirmation popup
- **Loading Spinner** – During API calls
- **Pagination** – 9 podcasts per page
- **Responsive** – 3 columns (desktop) → 2 (tablet) → 1 (mobile)
- **Empty State** – Friendly message when no podcasts exist

---

## 🎨 Design

- **Font**: Poppins
- **Primary**: #8CC63F (green)
- **Dark**: #111111
- **Background**: #F5F5F5

---

## 📦 Dependencies

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2 | UI library |
| react-dom | ^18.2 | DOM rendering |
| react-router-dom | ^6.22 | Routing |
| axios | ^1.6 | HTTP client |
| react-scripts | 5.0.1 | Build tooling |

### Backend
| Extension | Purpose |
|-----------|---------|
| PHP MySQLi | Database |
| PHP fileinfo | MIME type detection |
| Apache mod_rewrite | Clean URLs |
