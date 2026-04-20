import { writeFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timestamp = Date.now()
    const filename = `${timestamp}_${originalName}`
    
    // Save to public/fichas
    const filepath = join(process.cwd(), 'public', 'fichas', filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ 
      success: true, 
      filename,
      path: `/fichas/${filename}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 })
  }
}
