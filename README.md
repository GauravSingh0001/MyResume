# MyResume - Professional Resume Builder

A free, private, and open-source resume builder built with Next.js. Create ATS-friendly resumes with real-time preview and PDF export.

**🚀 [Live Demo](https://quickmyresume.vercel.app/)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GauravSingh0001/MyResume)

---

## ✨ Features

### Core Features
- **Real-time Preview:** See changes instantly as you type
- **Import PDF:** Upload your existing PDF resume to auto-fill details
- **Privacy First:** All data stays in your browser - no servers involved
- **ATS Friendly:** Export optimized PDFs that pass Applicant Tracking Systems
- **Auto-Save:** Your work is automatically saved to browser localStorage

### Resume Sections
- ✅ Personal Information with custom links (GitHub, Portfolio, etc.)
- ✅ Professional Summary
- ✅ Work Experience with highlights
- ✅ Education with GPA
- ✅ Skills (categorized)
- ✅ Projects with descriptions
- ✅ Certifications
- ✅ **Custom Sections** (Achievements, Awards, Publications, Languages, Volunteer Work, etc.)

### Advanced Features
- **Conditional Formatting:** Auto-alignment for optional fields
- **Validation:** Email and phone number validation
- **Delete Confirmations:** Prevent accidental deletions
- **Responsive Design:** Works on desktop, tablet, and mobile
- **PDF Download:** Server-side generation for reliable downloads on Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GauravSingh0001/MyResume.git
   cd MyResume/myresume-style
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

---

## 📖 How to Use

### Basic Usage

1. **Fill in Personal Information:**
   - Name, email, phone, location
   - LinkedIn/Website URL
   - Add additional links (GitHub, Portfolio, etc.)
   - Write a professional summary

2. **Add Work Experience:**
   - Click "Add Work Experience"
   - Fill in job title, company, dates
   - Add bullet points for achievements

3. **Add Education:**
   - Institution, degree, field of study
   - Dates and GPA (optional)

4. **Add Skills:**
   - Create skill categories (e.g., "Programming Languages")
   - List skills separated by commas

5. **Add Projects & Certifications:**
   - Project name, description, technologies
   - Certification name and issuer

6. **Download PDF:**
   - Click "Download PDF" button
   - Your resume will be downloaded as a professional PDF

### Adding Custom Sections

**⚠️ Note:** Custom sections UI requires manual integration. Follow the steps below:

#### Step 1: Update Imports
In `app/resume-builder/page.tsx`, add these imports (around line 10-27):

```tsx
import {
    // ... existing imports ...
    addCustomSection,
    updateCustomSectionTitle,
    deleteCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem
} from '@/lib/redux/resumeSlice';
```

#### Step 2: Update Delete State
Add `sectionId?` to the delete confirmation state (around line 60-65):

```tsx
const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: string;
    id: string;
    name: string;
    sectionId?: string;  // Add this line
} | null>(null);
```

#### Step 3: Update handleDelete Function
Add `sectionId` parameter (around line 106):

```tsx
const handleDelete = (type: string, id: string, name: string, sectionId?: string) => {
    setDeleteConfirm({ show: true, type, id, name, sectionId });
};
```

#### Step 4: Update confirmDelete Function
Add these cases (around line 136-152):

```tsx
case 'customSection':
    dispatch(deleteCustomSection(deleteConfirm.id));
    break;
case 'customSectionItem':
    if (deleteConfirm.sectionId) {
        dispatch(deleteCustomSectionItem({
            sectionId: deleteConfirm.sectionId,
            itemId: deleteConfirm.id
        }));
    }
    break;
```

#### Step 5: Add Custom Sections UI
See `APPLY_CUSTOM_SECTIONS.md` for the complete UI code to insert after the Certifications section.

**Once integrated, you can:**
- Click quick-add buttons (Achievements, Awards, Publications, etc.)
- Create custom section names
- Add items with title, subtitle, date, description, and bullet points
- All custom sections will appear in the PDF export

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[Redux Toolkit](https://redux-toolkit.js.org)** - State management

### PDF Generation
- **[@react-pdf/renderer](https://react-pdf.org)** - PDF generation
- Server-side API route for reliable Vercel deployment

### Other Tools
- **[Lucide React](https://lucide.dev)** - Icons
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF import parsing

---

## 📁 Project Structure

```
myresume-style/
├── app/
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts          # Server-side PDF generation
│   ├── resume-builder/
│   │   └── page.tsx              # Main resume builder page
│   └── layout.tsx
├── components/
│   └── resume/
│       ├── ResumePDF.tsx         # PDF template
│       └── ResumePreview.tsx     # PDF preview component
├── lib/
│   ├── redux/
│   │   ├── store.ts              # Redux store
│   │   ├── resumeSlice.ts        # Resume state management
│   │   └── hooks.ts              # Redux hooks
│   └── parse-resume.ts           # PDF import parser
├── types/
│   └── resume.ts                 # TypeScript interfaces
└── public/
```

---

## 🔧 Configuration

### Vercel Deployment

The app is configured for Vercel deployment with:
- Turbopack support
- Server-side PDF generation
- Optimized serverless functions

**Environment Variables:** None required - everything runs client-side except PDF generation.

### PDF Customization

Edit `components/resume/ResumePDF.tsx` to customize:
- Font sizes and styles
- Section spacing
- Color scheme
- Layout structure

---

## 🐛 Known Issues & Solutions

### PDF Download Fails on Vercel
**Solution:** The app now uses server-side PDF generation via `/api/generate-pdf`. This is already implemented.

### Custom Sections Not Showing
**Solution:** Follow the integration steps in the "Adding Custom Sections" section above or refer to `APPLY_CUSTOM_SECTIONS.md`.

### Data Not Persisting
**Solution:** Data is saved to localStorage. Clear browser cache may reset data. Use "Download PDF" to backup your resume.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add TypeScript types for new features
- Test on both development and production builds
- Ensure PDF export works correctly

---

## 📝 Changelog

### Latest Updates
- ✅ Added server-side PDF generation for Vercel compatibility
- ✅ Implemented custom sections backend (Achievements, Awards, etc.)
- ✅ Added conditional bar separators in PDF header
- ✅ Improved spacing between name and contact info
- ✅ Added delete confirmations for all sections
- ✅ Enhanced validation for email and phone fields
- ✅ PDF import functionality for auto-filling data

---

## 📄 License

This project is open source and available under the MIT License.

**Modified and maintained by [Gaurav Singh](https://github.com/GauravSingh0001)**

---

## 🙏 Acknowledgments

- Original concept inspired by various open-source resume builders
- Built with modern web technologies
- Community contributions and feedback

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/GauravSingh0001/MyResume/issues)
- **Discussions:** [GitHub Discussions](https://github.com/GauravSingh0001/MyResume/discussions)
- **Email:** gauravsinghdevu@gmail.com

---

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=GauravSingh0001/MyResume&type=Date)](https://star-history.com/#GauravSingh0001/MyResume&Date)

---

**Made with ❤️ by Gaurav Singh**
