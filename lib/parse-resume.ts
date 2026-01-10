import * as pdfjsHelper from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';

// Configure worker
pdfjsHelper.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsHelper.version}/build/pdf.worker.min.mjs`;

export interface ParsedResume {
    basics: {
        name: string;
        email: string;
        phone: string;
        summary: string;
        location: string;
    };
    skills: string[];
}

export const parseResumeFromPdf = async (file: File): Promise<ParsedResume> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsHelper.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            // @ts-ignore
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n';
        }

        // --- Heuristic Extraction ---

        // 1. Email
        const emailMatch = fullText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
        const email = emailMatch ? emailMatch[0] : '';

        // 2. Phone (Basic)
        // Matches: (123) 456-7890, 123-456-7890, +1 123 456 7890
        const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '';

        // 3. Name (Guessing: First line or capital words at top)
        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const nameCandidate = lines[0] || '';
        // Basic cleanup if name is "Resume" or something
        const name = nameCandidate.toLowerCase().includes('resume') ? '' : nameCandidate;

        // 4. Skills (Keyword matching)
        // We can scan for common tech keywords if we had a dictionary.
        // For now, let's leave skills empty or try to find a "Skills" section.

        // 5. Summary - use the first chunk of text that isn't the header?
        const summary = lines.slice(1, 4).join(' ');

        return {
            basics: {
                name: name.slice(0, 50),
                email: email.slice(0, 50),
                phone: phone.slice(0, 20),
                location: '',
                summary: summary.slice(0, 300),
            },
            skills: []
        };
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF");
    }
};
