export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('resume');
    if (!file || typeof file.arrayBuffer !== 'function') return Response.json({error:'Choose a resume file.'},{status:400});
    const name = String(file.name || '').toLowerCase();
    const ext = name.split('.').pop();
    if (!['pdf','docx','txt'].includes(ext)) return Response.json({error:'Use PDF, DOCX or TXT. Legacy .doc files are not supported.'},{status:415});
    if (file.size > MAX_BYTES || file.size === 0) return Response.json({error:'File must be between 1 byte and 5 MB.'},{status:413});
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';
    if (ext === 'pdf') {
      if (buffer.subarray(0,5).toString() !== '%PDF-') throw new Error('This is not a valid PDF file.');
      const mod = await import('pdf-parse');
      const parse = mod.default || mod;
      text = (await parse(buffer)).text || '';
    } else if (ext === 'docx') {
      if (buffer.subarray(0,2).toString() !== 'PK') throw new Error('This is not a valid DOCX file.');
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({buffer})).value || '';
    } else {
      text = buffer.toString('utf8');
    }
    text = text.replace(/\0/g,'').trim();
    if (text.length < 30) return Response.json({error:'Not enough readable text found. Scanned/image-only PDFs need OCR; try a text-based PDF or paste your resume.'},{status:422});
    if (text.length > 50000) return Response.json({error:'Resume text exceeds the 50,000-character limit.'},{status:413});
    return Response.json({text},{headers:{'Cache-Control':'no-store'}});
  } catch (error) {
    return Response.json({error: error?.message || 'Could not read this file.'},{status:400,headers:{'Cache-Control':'no-store'}});
  }
}
