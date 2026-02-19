"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function DesignUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  const onFile = (f?: File) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleUpload = async () => {
    if (!file) return setMessage('No file selected')
    setIsUploading(true)
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('designs').upload(fileName, file)
      if (error) throw error
      const publicUrl = supabase.storage.from('designs').getPublicUrl(data.path).data.publicUrl

      // insert design record
      await supabase.from('designs').insert({ title: file.name, images: [publicUrl], price: 0 })
      setMessage('Uploaded')
      toast.success('Design uploaded')
    } catch (e: any) {
      setMessage(e?.message ?? 'Upload failed')
      toast.error(e?.message ?? 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-4 border rounded bg-white">
      <div className="mb-3">
        <label className="block mb-1 font-semibold">Upload design</label>
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {preview && <img src={preview} alt="preview" className="w-48 h-48 object-cover mb-3 rounded" />}
      <div className="flex gap-2">
        <button onClick={handleUpload} disabled={isUploading} className="px-4 py-2 bg-[#06302B] text-white rounded">{isUploading ? 'Uploading...' : 'Upload'}</button>
      </div>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  )
}
