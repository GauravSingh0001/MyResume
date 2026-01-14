# Custom Sections Feature - Implementation Guide

## ✅ What's Already Done:
1. **Backend Support** - Redux actions are ready:
   - `addCustomSection`
   - `updateCustomSectionTitle`
   - `deleteCustomSection`
   - `addCustomSectionItem`
   - `updateCustomSectionItem`
   - `deleteCustomSectionItem`

2. **Type Definitions** - Already in `types/resume.ts`:
   - `CustomSection` interface
   - `CustomSectionItem` interface

3. **PDF Rendering** - Already in `ResumePDF.tsx`:
   - Custom sections render in the PDF

## 🔧 What Needs to be Added to `app/resume-builder/page.tsx`:

### Step 1: Update Imports (around line 10-27)
Add these imports to the existing Redux imports:
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

### Step 2: Update Delete Confirmation State (around line 60-65)
Change from:
```tsx
const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: string;
    id: string;
    name: string;
} | null>(null);
```

To:
```tsx
const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: string;
    id: string;
    name: string;
    sectionId?: string;  // Add this line
} | null>(null);
```

### Step 3: Update handleDelete Function (around line 106)
Change from:
```tsx
const handleDelete = (type: string, id: string, name: string) => {
    setDeleteConfirm({ show: true, type, id, name });
};
```

To:
```tsx
const handleDelete = (type: string, id: string, name: string, sectionId?: string) => {
    setDeleteConfirm({ show: true, type, id, name, sectionId });
};
```

### Step 4: Update confirmDelete Function (around line 136-152)
Add these cases before the closing brace:
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

### Step 5: Add Custom Sections UI (after line 920, before `</div>`)
Insert this entire section after the Certifications section closes:

```tsx
{/* Custom Sections */}
<section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" />
        Custom Sections
    </h2>
    <p className="text-sm text-gray-600 mb-6">
        Add additional sections like Achievements, Awards, Publications, Languages, etc.
    </p>

    <div className="space-y-6">
        {/* Existing Custom Sections */}
        {resume.customSections && resume.customSections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="flex-1 flex items-center justify-between"
                    >
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                                e.stopPropagation();
                                dispatch(updateCustomSectionTitle({ id: section.id, title: e.target.value }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                            placeholder="Section Title"
                        />
                        <span className="text-gray-400 ml-2">
                            {expandedSections[section.id] ? '−' : '+'}
                        </span>
                    </button>
                    <button
                        onClick={() => handleDelete('customSection', section.id, section.title)}
                        className="ml-4 text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Delete section"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                {expandedSections[section.id] && (
                    <div className="space-y-4">
                        {section.items.map((item: any, index: number) => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <GripVertical size={16} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800">
                                            Item #{index + 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete('customSectionItem', item.id, item.title, section.id)}
                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                        title="Delete item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) =>
                                                dispatch(updateCustomSectionItem({
                                                    sectionId: section.id,
                                                    itemId: item.id,
                                                    data: { title: e.target.value }
                                                }))
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                            placeholder="Title"
                                        />
                                        <input
                                            type="text"
                                            value={item.date || ''}
                                            onChange={(e) =>
                                                dispatch(updateCustomSectionItem({
                                                    sectionId: section.id,
                                                    itemId: item.id,
                                                    data: { date: e.target.value }
                                                }))
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                            placeholder="Date (optional)"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={item.subtitle || ''}
                                        onChange={(e) =>
                                            dispatch(updateCustomSectionItem({
                                                sectionId: section.id,
                                                itemId: item.id,
                                                data: { subtitle: e.target.value }
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                                        placeholder="Subtitle (optional)"
                                    />

                                    <textarea
                                        value={item.description || ''}
                                        onChange={(e) =>
                                            dispatch(updateCustomSectionItem({
                                                sectionId: section.id,
                                                itemId: item.id,
                                                data: { description: e.target.value }
                                            }))
                                        }
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                        placeholder="Description (optional)"
                                    />

                                    <div>
                                        <label className="block text-xs font-medium text-gray-900 mb-1">
                                            Details (one per line, optional)
                                        </label>
                                        <textarea
                                            value={(item.details || []).join('\n')}
                                            onChange={(e) =>
                                                dispatch(updateCustomSectionItem({
                                                    sectionId: section.id,
                                                    itemId: item.id,
                                                    data: { details: e.target.value.split('\n').filter((d: string) => d.trim()) }
                                                }))
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
                                            placeholder="• Detail 1&#10;• Detail 2&#10;• Detail 3"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() =>
                                dispatch(addCustomSectionItem({
                                    sectionId: section.id,
                                    item: {
                                        id: Date.now().toString(),
                                        title: '',
                                        subtitle: '',
                                        date: '',
                                        description: '',
                                        details: []
                                    }
                                }))
                            }
                            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Item to {section.title}
                        </button>
                    </div>
                )}
            </div>
        ))}

        {/* Quick Add Buttons */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Add:</p>
            <div className="flex flex-wrap gap-2">
                {['Achievements', 'Awards', 'Publications', 'Languages', 'Volunteer Work', 'Hobbies'].map((sectionName) => (
                    <button
                        key={sectionName}
                        onClick={() => {
                            const id = Date.now().toString();
                            dispatch(addCustomSection({ id, title: sectionName }));
                            setExpandedSections(prev => ({ ...prev, [id]: true }));
                        }}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-medium"
                    >
                        + {sectionName}
                    </button>
                ))}
            </div>
        </div>

        {/* Custom Section Name Input */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Or create your own:</p>
            <div className="flex gap-2">
                <input
                    type="text"
                    id="customSectionName"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
                    placeholder="Enter section name (e.g., Volunteer Experience)"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                                const id = Date.now().toString();
                                dispatch(addCustomSection({ id, title: input.value.trim() }));
                                setExpandedSections(prev => ({ ...prev, [id]: true }));
                                input.value = '';
                            }
                        }
                    }}
                />
                <button
                    onClick={() => {
                        const input = document.getElementById('customSectionName') as HTMLInputElement;
                        if (input && input.value.trim()) {
                            const id = Date.now().toString();
                            dispatch(addCustomSection({ id, title: input.value.trim() }));
                            setExpandedSections(prev => ({ ...prev, [id]: true }));
                            input.value = '';
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    Create
                </button>
            </div>
        </div>
    </div>
</section>
```

## 🎯 How to Use After Implementation:
1. Scroll to the bottom of the form
2. Click quick-add buttons for common sections (Achievements, Awards, etc.)
3. Or type a custom section name and click "Create"
4. Add items to each section with title, date, subtitle, description, and bullet points
5. All changes auto-save and appear in the PDF preview

## ✅ Features:
- Quick-add buttons for common sections
- Custom section names
- Full CRUD operations
- Auto-expanding new sections
- Delete confirmations
- PDF rendering included
