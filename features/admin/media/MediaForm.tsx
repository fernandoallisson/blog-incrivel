'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { type ApiPost } from '@/lib/api';
import { type MediaFormState } from './types';

export default function MediaForm({ form, posts, message, onChange, onSubmit }: { form: MediaFormState; posts: ApiPost[]; message: string; onChange: (form: MediaFormState) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const hasUpload = Boolean(form.file);

  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <ImageUploadInput form={form} onChange={onChange} />
        <Input label="Arquivo" value={form.filename} onChange={(e) => onChange({ ...form, filename: e.target.value })} disabled={hasUpload} />
        <Input label="URL" value={form.url} onChange={(e) => onChange({ ...form, url: e.target.value })} disabled={hasUpload} hint={hasUpload ? 'A URL publica sera preenchida automaticamente apos o upload.' : undefined} />
        <Input label="Tipo" value={form.type} onChange={(e) => onChange({ ...form, type: e.target.value })} disabled={hasUpload} />
        <Input label="Tamanho" value={form.size} onChange={(e) => onChange({ ...form, size: e.target.value })} disabled={hasUpload} />
        <Select label="Post vinculado" value={form.post_id} onChange={(e) => onChange({ ...form, post_id: e.target.value })} options={[{ value: '', label: 'Sem post' }, ...posts.map((post) => ({ value: String(post.id), label: post.title }))]} />
        {message && <div className={`text-xs ${message.includes('Falha') ? 'text-error' : 'text-success'}`}>{message}</div>}
        {form.post_id && <Badge tone="info">Essa midia sera a capa do post selecionado</Badge>}
        <Button type="submit" full disabled={hasUpload ? false : (!form.filename || !form.url)}>Salvar</Button>
      </form>
    </Card>
  );
}

function ImageUploadInput({ form, onChange }: { form: MediaFormState; onChange: (form: MediaFormState) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted">Upload de imagem</label>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          onChange({
            ...form,
            file,
            filename: file?.name || form.filename,
            type: file?.type || form.type,
            size: file ? String(file.size) : form.size,
          });
        }}
        className="rounded-md border border-border-strong bg-glass px-3 py-2 text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-brand/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
      />
      {form.file && (
        <button
          type="button"
          className="self-start text-xs font-semibold text-subtle hover:text-text"
          onClick={() => onChange({ ...form, file: null, filename: '', type: '', size: '' })}
        >
          Remover arquivo selecionado
        </button>
      )}
    </div>
  );
}
