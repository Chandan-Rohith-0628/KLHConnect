# 🎨 KLH Logo Setup Guide

## Quick Setup

### Step 1: Save the Logo
Save the KLH University logo (the one you provided with the gear icon and colorful text) as:

**File name:** `klh-logo.png`

**Location:** `client/public/images/klh-logo.png`

### Step 2: Verify Directory Structure
```
KLHConnect/
└── client/
    └── public/
        └── images/
            └── klh-logo.png  ← Your logo goes here
```

### Step 3: Check Logo Display
After placing the logo, refresh your application and check:

1. **Navbar** (top-left corner)
   - Logo should appear beside "KLHConnect" text
   - Height: ~40px

2. **Login Page** (center top)
   - Large logo above "KLHConnect" heading
   - Height: ~96px

3. **Register Page** (center top)
   - Large logo above "KLHConnect" heading
   - Height: ~96px

---

## Logo Specifications

**Recommended:**
- Format: PNG with transparent background
- Minimum height: 200px
- Aspect ratio: Original (will auto-adjust width)
- File size: Under 500KB
- Quality: High resolution for crisp display

---

## Where Logo Appears

✅ **Navbar** - Top-left, beside "KLHConnect"
✅ **Login Page** - Center top, large size
✅ **Register Page** - Center top, large size

---

## Troubleshooting

**Logo not showing?**
1. Check file name is exactly: `klh-logo.png` (lowercase)
2. Check file is in: `client/public/images/` directory
3. Refresh browser (Ctrl+F5 or Cmd+Shift+R)
4. Check browser console for errors

**Logo looks stretched?**
- The logo uses `object-contain` CSS property
- It will maintain aspect ratio automatically
- No stretching or distortion

**Logo too small/large?**
- Navbar: h-10 (40px height)
- Login/Register: h-24 (96px height)
- Width adjusts automatically

---

## Quick Test

After placing the logo:
```bash
cd client
npm start
```

Then check:
1. ✅ Navbar shows logo
2. ✅ Login page shows logo
3. ✅ Register page shows logo

---

**That's it! Your KLH branding is now complete.** 🎉
