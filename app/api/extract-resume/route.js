import { createRequire } from 'node:module';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const require = createRequire(import.meta.url);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('resume');
    if (!file || typeof file.arrayBuffer !== 'function') return Response.json({error:'Choose a resume file.'},{status:400});
    const ext = String(file.name || '').toLowerCase().split('.').pop();
    if (!['pdf','docx','txt'].includes(ext)) return Response.json({error:'Use PDF, DOCX or TXT. Legacy .doc files are not supported.'},{status:415});
    if (!file.size || file.size > MAX_BYTES) return Response.json({error:'File must be between 1 byte and 5 MB.'},{status:413});
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';
    if (ext === 'pdf') {
      if (buffer.subarray(0,5).toString() !== '%PDF-') return Response.json({error:'This is not a valid PDF file.'},{status:422});
      // Import the parser implementation directly. The pdf-parse v1.1.1 package
      // root entry point runs a development-only fixture when NODE_ENV differs
      // from 'test', which fails on production servers with ENOENT.
      const parse = require('pdf-parse/lib/pdf-parse.js');
      text = (await parse(buffer)).text || '';
    } else if (ext === 'docx') {
      if (buffer.subarray(0,2).toString() !== 'PK') return Response.json({error:'This is not a valid DOCX file.'},{status:422});
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({buffer})).value || '';
    } else {
      text = buffer.toString('utf8');
    }
    text = text.replace(/\0/g,'').trim();
    if (text.length < 30) return Response.json({error:'Not enough readable text found. Image-only PDFs need OCR; please upload a text-based PDF or paste the resume text.'},{status:422});
    if (text.length > 50000) return Response.json({error:'Resume text exceeds the 50,000-character limit.'},{status:413});
    return Response.json({text},{headers:{'Cache-Control':'no-store'}});
  } catch (error) {
    console.error('Resume extraction error:', error?.name, error?.message);
    return Response.json({error:'Unable to read this file. Please try a text-based PDF, DOCX, TXT, or paste your resume.'},{status:422,headers:{'Cache-Control':'no-store'}});
  }
}
